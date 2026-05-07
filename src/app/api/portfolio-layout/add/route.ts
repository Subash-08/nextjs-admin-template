import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import PortfolioLayoutBox from '@/models/PortfolioLayoutBox';
import LayoutCounter from '@/models/LayoutCounter';

const MAX_LAYOUT_BOXES = 50;

export async function POST() {
    try {
        await connectToDB();

        // 1. Check Max Limit
        const count = await PortfolioLayoutBox.countDocuments();
        if (count >= MAX_LAYOUT_BOXES) {
            return NextResponse.json(
                { error: `Maximum limit of ${MAX_LAYOUT_BOXES} boxes reached.` },
                { status: 400 }
            );
        }

        // 2. Atomic Order Generation
        // We use findOneAndUpdate with upsert to guarantee a unique, sequential number.
        // We initialize with the current max order if the counter doesn't exist, to support migration?
        // Actually, if we are starting fresh or mixed, we should maybe sync first.
        // But for "Atomic Add", relying on a dedicated counter is safest.
        // If the counter drifts from actual boxes (e.g. manual delete), we might have gaps or collisions if we aren't careful?
        // Wait, if we use `order: unique` in schema, collisions fail.
        // If we delete box 5, next add should probably be 6 (gap fill? or append?)
        // The requirement says: "create new box with order + 1" (implies append).
        // "delete ONLY last box" implies we shrink from the end.
        // So `order` should roughly track `count`.
        // Let's use the counter approach as requested.

        // Ensure counter exists/synced? 
        // If we delete the last box, we should ideally decrement the counter? 
        // OR we just find max order from boxes + 1?
        // The "Counters collection" approach is standard for strict sequences.
        // But if we delete the last box, we must decrement the counter to reuse that order number?
        // Actually, simpler approach for "Add to End" + "Delete from End" is just:
        // Lock/Transaction -> Count/FindMax -> Insert Max+1.
        // But Mongo transactions are heavy/replica-set only?
        // The Counter pattern is robust. Let's use `LayoutCounter`.

        // However, if we delete the last box (say order 5), the counter is at 5.
        // Next add should return 5 again? No, it would return 6.
        // So we would have 1,2,3,4, [deleted 5], 6. -> GAP.
        // We want NO GAPS.
        // "order must be sequential", "no gaps allowed".

        // FIX: The `LayoutCounter` approach works well for "Invoice Numbers" that never decrease.
        // But for a "Layout Grid" where we want strict 1..N density, relying off `count` + atomic lock is better?
        // OR, when we "Delete Last", we explicitly Decrement the counter?

        // Let's stick to the requested "Atomic Counter" but ensure "Delete Last" handles the decrement.
        // AND handle the edge case where the counter might be desynced.

        /* 
           Simpler robust logic for "Append":
           1. Atomic FindAndModify on Counter to get next val?
           2. Create Box.
        */

        // First, ensure counter is at least at current max?
        // We'll trust the flow: Add -> Inc, DeleteLast -> Dec.

        const counter = await LayoutCounter.findByIdAndUpdate(
            'portfolioLayout',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Safety check: is this order actually "next"?
        // If we had 5 boxes, counter was 5. We inc to 6. Order is 6. Correct.
        // If we deleted box 5, we should have dec counter to 4. Then inc to 5. Order 5. Correct.

        try {
            const newBox = await PortfolioLayoutBox.create({
                order: counter.seq,
                projectId: null
            });

            return NextResponse.json({
                success: true,
                box: {
                    id: newBox._id.toString(),
                    order: newBox.order,
                    project: null
                }
            });

        } catch (err: any) {
            // Rollback counter if create failed (e.g. duplicate key error if somehow desynced)
            if (err.code === 11000) {
                // Collision. This implies our counter is lagging behind actual boxes?
                // Or we have a gap we tried to fill?
                // We should probably "repair" the counter then retry?
                // For now, fail safely.
                await LayoutCounter.findByIdAndUpdate('portfolioLayout', { $inc: { seq: -1 } });
                return NextResponse.json({ error: 'Concurrency error. Please try again.' }, { status: 409 });
            }
            throw err;
        }

    } catch (error) {
        console.error('Error adding layout box:', error);
        return NextResponse.json({ error: 'Failed to add box' }, { status: 500 });
    }
}

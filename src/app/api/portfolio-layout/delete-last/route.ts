import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import PortfolioLayoutBox from '@/models/PortfolioLayoutBox';
import LayoutCounter from '@/models/LayoutCounter';

export async function DELETE() {
    try {
        await connectToDB();

        // 1. Find the box with the highest order
        const lastBox = await PortfolioLayoutBox.findOne().sort({ order: -1 });

        if (!lastBox) {
            return NextResponse.json({ error: 'No boxes to delete.' }, { status: 400 });
        }

        // 2. Delete it
        await PortfolioLayoutBox.findByIdAndDelete(lastBox._id);

        // 3. Decrement the counter to maintain sequence for next Add
        // We use $max to ensure we don't go below 0 (though application logic shouldn't allow it)
        // Also strictly set it to the PREVIOUS order to be safe?
        // $inc -1 is correct if we assume we just removed N. New max is N-1. Next add should be N.
        await LayoutCounter.findByIdAndUpdate('portfolioLayout', { $inc: { seq: -1 } });

        // Double check integrity? (Optional but good)
        // If we deleted order 5, remaining max should be 4.

        return NextResponse.json({ success: true, deletedOrder: lastBox.order });

    } catch (error) {
        console.error('Error deleting last box:', error);
        return NextResponse.json({ error: 'Failed to delete box' }, { status: 500 });
    }
}

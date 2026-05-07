import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import PortfolioLayoutBox from '@/models/PortfolioLayoutBox';
import Project from '@/models/Project';

// Types for the sanitized response
interface SanitizedProject {
    id: string;
    title: string;
    thumbnail: string | null;
    slug?: string;
    category?: any;
}

interface SanitizedBox {
    id: string;
    order: number;
    project: SanitizedProject | null;
}

export async function GET() {
    try {
        await connectToDB();

        // Fetch all boxes sorted by order
        const boxes = await PortfolioLayoutBox.find()
            .sort({ order: 1 })
            .populate({
                path: 'projectId',
                populate: { path: 'categoryId' } // Allow WorkCard to show category name
            });

        // Sanitize and transform the data
        const sanitizedBoxes: SanitizedBox[] = boxes.map((box) => {
            let projectData: SanitizedProject | null = null;

            if (box.projectId) {
                // If projectId is populated but is null (deleted project), it will be null here
                // However, Mongoose populate sometimes returns nothing if ref is missing
                // We should check if box.projectId has _id to confirm it's a document
                const projectDoc = box.projectId as any;

                if (projectDoc._id) {
                    projectData = {
                        id: projectDoc._id.toString(),
                        title: projectDoc.title,
                        thumbnail: projectDoc.coverImage?.url || null, // Assuming coverImage structure
                        slug: projectDoc.slug,
                        category: projectDoc.categoryId || null // Assuming categoryId is populated or is an object?
                        // Wait, if categoryId is a ref, we need to populate it too in the main query?
                        // "populate('projectId')" might not populate 'projectId.categoryId'.
                        // We need nested populate: .populate({ path: 'projectId', populate: { path: 'categoryId' } })
                    };
                }
            }

            return {
                id: box._id.toString(),
                order: box.order,
                project: projectData,
            };
        });

        // Lazy Integrity Check: Ensure sequential order [1, 2, 3...]
        // If we find a gap, we should ideally fix it. 
        // For now, we'll just log it or maybe assume the frontend handles distinct orders?
        // The plan said "Integrity: Call validateLayoutIntegrity() (lazy fix) if gaps detected."
        // We will implement a simple inline check for now to re-sequence if needed.
        let needsResequencing = false;
        for (let i = 0; i < sanitizedBoxes.length; i++) {
            if (sanitizedBoxes[i].order !== i + 1) {
                needsResequencing = true;
                break;
            }
        }

        if (needsResequencing && sanitizedBoxes.length > 0) {
            console.warn('Portfolio Layout integrity issue detected. Resequencing...');
            // We can trigger a background fix or just fix in memory?
            // To be safe and persistent, we should fix in DB.
            // WE WONT BLOCK the response for this, but we should fire and forget or await if critical.
            // Let's await to be safe.
            for (let i = 0; i < boxes.length; i++) {
                if (boxes[i].order !== i + 1) {
                    await PortfolioLayoutBox.findByIdAndUpdate(boxes[i]._id, { order: i + 1 });
                    sanitizedBoxes[i].order = i + 1; // Update response too
                }
            }
        }

        return NextResponse.json({ boxes: sanitizedBoxes });
    } catch (error) {
        console.error('Error fetching portfolio layout:', error);
        return NextResponse.json({ error: 'Failed to fetch layout' }, { status: 500 });
    }
}

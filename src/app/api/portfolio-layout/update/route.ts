import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import PortfolioLayoutBox from '@/models/PortfolioLayoutBox';

export async function PUT(request: Request) {
    try {
        await connectToDB();

        const body = await request.json();
        const { boxId, projectId } = body;

        if (!boxId) {
            return NextResponse.json({ error: 'Box ID and Project ID are required' }, { status: 400 });
        }

        // Validate: Ensure project ID is not already used in ANOTHER box?
        // "Prevent duplicate project assignment."
        // We must check if this projectId is used elsewhere.
        if (projectId) {
            const existingBox = await PortfolioLayoutBox.findOne({ projectId: projectId });
            if (existingBox && existingBox._id.toString() !== boxId) {
                return NextResponse.json(
                    { error: 'This project is already assigned to another layout box.' },
                    { status: 409 }
                );
            }
        }

        // Update the box
        const updatedBox = await PortfolioLayoutBox.findByIdAndUpdate(
            boxId,
            { projectId: projectId },
            { new: true }
        ).populate('projectId');

        if (!updatedBox) {
            return NextResponse.json({ error: 'Box not found' }, { status: 404 });
        }

        // Santize response
        const projectDoc = updatedBox.projectId as any;
        const sanitizedProject = projectDoc ? {
            id: projectDoc._id.toString(),
            title: projectDoc.title,
            thumbnail: projectDoc.coverImage?.url || null,
        } : null;

        return NextResponse.json({
            success: true,
            box: {
                id: updatedBox._id.toString(),
                order: updatedBox.order,
                project: sanitizedProject
            }
        });

    } catch (error) {
        console.error('Error updating layout box:', error);
        return NextResponse.json({ error: 'Failed to update box' }, { status: 500 });
    }
}

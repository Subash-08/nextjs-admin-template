import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import PortfolioLayoutBox from '@/models/PortfolioLayoutBox';
import Project from '@/models/Project';

export async function GET() {
    try {
        await connectToDB();

        // 1. Get all Project IDs currently assigned to boxes
        // Filter out nulls explicitly
        const usedProjectIds = await PortfolioLayoutBox.distinct('projectId', { projectId: { $ne: null } });

        // 2. Fetch all Projects whose IDs are NOT in the used list
        // Select only necessary fields for the dropdown
        const projects = await Project.find({
            _id: { $nin: usedProjectIds }
        })
            .select('_id title coverImage')
            .sort({ createdAt: -1 }); // Show newest first?

        // 3. Transform for frontend
        const availableProjects = projects.map(p => ({
            id: p._id.toString(),
            title: p.title,
            thumbnail: p.coverImage?.url || null
        }));

        return NextResponse.json({ projects: availableProjects });

    } catch (error) {
        console.error('Error fetching available projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

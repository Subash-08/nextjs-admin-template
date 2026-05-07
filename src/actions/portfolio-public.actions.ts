'use server';

import connectToDB from '@/lib/db';
import Project from '@/models/Project';

export async function getProjectsByCategory(categoryId: string) {
    try {
        await connectToDB();

        // If 'all', we technically shouldn't use this action for the layout, 
        // but if we wanted a fallback list view, we could.
        // The frontend handles 'all' via the layout API.

        const query = categoryId && categoryId !== 'all' ? { categoryId } : {};

        const projects = await Project.find(query)
            .populate('categoryId')
            .sort({ createdAt: -1 })
            .limit(50); // Hard limit for now, pagination to be added if needed

        return JSON.parse(JSON.stringify(projects));
    } catch (error) {
        console.error('Error fetching projects by category:', error);
        return [];
    }
}

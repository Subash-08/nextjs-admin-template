import '@/models/Category'; // MUST be imported before Project use to register schema
import Project from '@/models/Project';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import { serialize } from '@/lib/utils';

// Ensure ID serialization for client components if needed
// const serialize = (obj: any) => JSON.parse(JSON.stringify(obj)); // This line is now replaced by the import

export async function getFeaturedProjects() {
    await dbConnect();
    try {
        const projects = await Project.find({
            status: 'published',
            featured: true,
            showInHomepage: true,
        })
            .sort({ displayOrder: 1, createdAt: -1 })
            .limit(4)
            .populate('categoryId', 'name')
            .lean();

        return serialize(projects);
    } catch (error) {
        console.error('Error fetching featured projects:', error);
        return [];
    }
}

export async function getPortfolioProjects() {
    await dbConnect();
    try {
        const projects = await Project.find({
            status: 'published',
            showInPortfolio: true,
        })
            .sort({ displayOrder: 1, createdAt: -1 })
            .populate('categoryId', 'name')
            .lean();

        console.log(`[getPortfolioProjects] Found ${projects.length} projects`);
        if (projects.length > 0) {
            console.log('[getPortfolioProjects] First project sample:', JSON.stringify(projects[0].thumbnail, null, 2));
        }

        return serialize(projects);
    } catch (error) {
        console.error('Error fetching portfolio projects:', error);
        return [];
    }
}

export async function getProjectBySlug(slug: string) {
    await dbConnect();
    try {
        console.log(`[getProjectBySlug] Fetching slug: "${slug}"`);
        const project = await Project.findOne({
            slug,
            status: 'published',
        })
            .populate('categoryId', 'name')
            .populate('techStack') // If techStack was a ref, but it's embedded in schema. Populate not needed if embedded.
            .lean();

        if (!project) {
            console.log(`[getProjectBySlug] No published project found for slug: "${slug}"`);
            // Debug: Check if it exists but is draft
            const draft = await Project.findOne({ slug }).select('status').lean();
            if (draft) console.log(`[getProjectBySlug] Project exists but status is: ${draft.status}`);
            return null;
        }

        console.log(`[getProjectBySlug] Project found: ${project.title}`);
        return serialize(project);
    } catch (error) {
        console.error(`Error fetching project with slug ${slug}:`, error);
        return null;
    }
}

export async function getRelatedProjects(currentProjectId: string, categoryId?: string) {
    await dbConnect();
    try {
        // 1. Try to fetch manually set related projects
        const currentProject = await Project.findById(currentProjectId).select('relatedProjects').lean();

        if (currentProject?.relatedProjects && currentProject.relatedProjects.length > 0) {
            const manualRelated = await Project.find({
                _id: { $in: currentProject.relatedProjects },
                status: 'published'
            })
                .populate('categoryId', 'name')
                .limit(3)
                .lean();

            if (manualRelated.length > 0) return serialize(manualRelated);
        }

        // 2. Fallback to same category
        if (categoryId) {
            const categoryRelated = await Project.find({
                categoryId: categoryId,
                status: 'published',
                _id: { $ne: currentProjectId }
            })
                .sort({ displayOrder: 1, createdAt: -1 })
                .limit(3)
                .populate('categoryId', 'name')
                .lean();

            return serialize(categoryRelated);
        }

        return [];
    } catch (error) {
        console.error('Error fetching related projects:', error);
        return [];
    }
}

import Project, { IProject } from '@/models/Project';
import '@/models/Category'; // Import to register the schema
import dbConnect from '@/lib/dbConnect';
import { PaginationParams, PaginatedResponse } from '@/types/pagination';
import { FilterQuery } from 'mongoose';

export async function getProjects(params: PaginationParams = {}): Promise<PaginatedResponse<IProject>> {
    await dbConnect();
    
    const page = params.page || 1;
    const limit = params.limit || 12;
    const skip = (page - 1) * limit;
    
    const query: FilterQuery<IProject> = {};
    
    if (params.categoryId) query.categoryId = params.categoryId;
    if (params.status) query.status = params.status;
    if (params.search) {
        query.$text = { $search: params.search };
    }

    const [data, total] = await Promise.all([
        Project.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('categoryId', 'name slug')
            .lean(),
        Project.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data: JSON.parse(JSON.stringify(data)),
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore: page < totalPages
        }
    };
}

export async function getFeaturedProjects(limit = 6) {
    await dbConnect();
    
    const projects = await Project.find({ status: 'published', showInPortfolio: true, featured: true })
        .sort({ displayOrder: 1, createdAt: -1 })
        .limit(limit)
        .select('title slug shortSummary thumbnail categoryId')
        .populate('categoryId', 'name slug')
        .lean();
        
    return JSON.parse(JSON.stringify(projects));
}

export async function createProject(data: unknown) {
    await dbConnect();
    const project = await Project.create(data);
    return JSON.parse(JSON.stringify(project.toObject()));
}

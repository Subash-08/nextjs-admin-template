import Project from '@/models/Project';
import dbConnect from '@/lib/db';

export async function getProjects() {
    await dbConnect();
    return await Project.find({}).sort({ createdAt: -1 });
}

export async function createProject(data: any) {
    await dbConnect();
    return await Project.create(data);
}

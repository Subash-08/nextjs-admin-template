'use server';

import Project from '@/models/Project';
import '@/models/Category'; // Ensure Category model is registered
import dbConnect from '@/lib/dbConnect';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProjectCreateSchema, ProjectUpdateSchema } from '@/validations/project.schema';

export async function fetchProjects() {
    await dbConnect();
    // We need to return plain JSON objects
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(projects));
}

export async function fetchProjectById(id: string) {
    await dbConnect();
    const project = await Project.findById(id).lean();
    return project ? JSON.parse(JSON.stringify(project)) : null;
}

export async function fetchProjectBySlug(slug: string) {
    await dbConnect();
    const project = await Project.findOne({ slug }).lean();
    return project ? JSON.parse(JSON.stringify(project)) : null;
}

export async function addProject(data: unknown) {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
        throw new Error('Unauthorized: Admin or editor role required');
    }

    const validatedData = ProjectCreateSchema.parse(data);

    await dbConnect();
    try {
        await Project.create({
            ...validatedData,
            createdBy: session.user.id
        });
        revalidatePath('/admin/projects');
        revalidatePath('/portfolio');
        revalidatePath('/works');
    } catch (error: any) {
        if (error.code === 11000) {
            throw new Error('Project with this slug already exists.');
        }
        throw error;
    }
}

export async function editProject(id: string, data: unknown) {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
        throw new Error('Unauthorized: Admin or editor role required');
    }

    const validatedData = ProjectUpdateSchema.parse(data);

    await dbConnect();
    try {
        await Project.findByIdAndUpdate(id, {
            ...validatedData,
            updatedBy: session.user.id
        }, { new: true });
        revalidatePath('/admin/projects');
        revalidatePath('/portfolio');
        if (validatedData.slug) {
            revalidatePath(`/portfolio/${validatedData.slug}`);
            revalidatePath(`/works/${validatedData.slug}`);
        }
    } catch (error: any) {
        if (error.code === 11000) {
            throw new Error('Project with this slug already exists.');
        }
        throw error;
    }
}

export async function deleteProject(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        throw new Error('Unauthorized: Admin role required for deletion');
    }

    await dbConnect();
    const project = await Project.findByIdAndDelete(id);
    if (project) {
        revalidatePath('/admin/projects');
        revalidatePath('/portfolio');
        revalidatePath(`/portfolio/${project.slug}`);
        revalidatePath(`/works/${project.slug}`);
    }
}

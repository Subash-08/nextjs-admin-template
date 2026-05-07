'use server';

import Project from '@/models/Project';
import '@/models/Category'; // Ensure Category model is registered
import dbConnect from '@/lib/dbConnect';
import { revalidatePath } from 'next/cache';

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

export async function addProject(data: any) {
    await dbConnect();
    try {
        await Project.create(data);
        revalidatePath('/admin/projects');
        revalidatePath('/portfolio');
    } catch (error: any) {
        if (error.code === 11000) {
            throw new Error('Project with this slug already exists.');
        }
        throw error;
    }
}

export async function editProject(id: string, data: any) {
    await dbConnect();
    try {
        await Project.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/admin/projects');
        revalidatePath('/portfolio');
        revalidatePath(`/portfolio/${data.slug}`);
    } catch (error: any) {
        if (error.code === 11000) {
            throw new Error('Project with this slug already exists.');
        }
        throw error;
    }
}

export async function deleteProject(id: string) {
    await dbConnect();
    const project = await Project.findByIdAndDelete(id);
    if (project) {
        revalidatePath('/admin/projects');
        revalidatePath('/portfolio');
        revalidatePath(`/portfolio/${project.slug}`);
    }
}

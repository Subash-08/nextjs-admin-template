import Category, { ICategory } from '@/models/Category';
import dbConnect from '@/lib/db';

export async function getCategories() {
    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(categories));
}

export async function getCategoryById(id: string) {
    await dbConnect();
    const category = await Category.findById(id).lean();
    return category ? JSON.parse(JSON.stringify(category)) : null;
}

export async function createCategory(data: Partial<ICategory>) {
    await dbConnect();
    const category = await Category.create(data);
    return JSON.parse(JSON.stringify(category));
}

export async function updateCategory(id: string, data: Partial<ICategory>) {
    await dbConnect();
    const category = await Category.findByIdAndUpdate(id, data, { new: true }).lean();
    return category ? JSON.parse(JSON.stringify(category)) : null;
}

export async function deleteCategory(id: string) {
    await dbConnect();
    const category = await Category.findByIdAndDelete(id);
    return category ? JSON.parse(JSON.stringify(category)) : null;
}

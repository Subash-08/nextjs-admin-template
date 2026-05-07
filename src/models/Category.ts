import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    parentId?: mongoose.Types.ObjectId;
    icon?: string;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', index: true },
    icon: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
}, { timestamps: true });

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;

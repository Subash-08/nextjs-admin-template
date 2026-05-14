import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  blogCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogCategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  blogCount: { type: Number, default: 0 },
}, { timestamps: true });

// Indexes
// Unique constraint already handled in schema definition

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.BlogCategory;
}

const BlogCategory: Model<IBlogCategory> = mongoose.models.BlogCategory || 
  mongoose.model<IBlogCategory>('BlogCategory', BlogCategorySchema);

export default BlogCategory;

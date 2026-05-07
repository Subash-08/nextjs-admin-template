import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IImage {
    url: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
    aspectRatio?: string;
    fileSize?: number;
}

export interface IProject extends Document {
    title: string;
    slug: string;
    shortSummary: string;
    description: string;

    // Client Info
    clientName: string;
    clientCompany: string;
    clientWebsite?: string;
    clientIndustry?: string;
    clientLogo?: IImage;

    // Project Meta
    projectYear?: string;
    projectLocation?: string;
    projectDuration?: string;
    projectUrl?: string; // Live Site

    // Classification
    categoryId: mongoose.Types.ObjectId;
    displayCategoryOverride?: string; // New
    subcategoryId?: mongoose.Types.ObjectId;
    tags: string[];
    techStack: { name: string; category?: string }[];

    // Media
    thumbnail: IImage;
    coverImage: IImage;
    galleryImages: IImage[];
    heroImageOverride?: IImage;
    heroImageOverlayOpacity?: number;
    heroImageOverlayColor?: string;

    // Case Study
    overview: string;
    problemStatement: string;
    objectives: string;
    goals: string;
    targetAudience: string;
    challenges: string[];
    solution: string[];
    processSteps: { title: string; description: string; image?: IImage }[];

    // Results
    metrics: { label: string; value: string; unit?: string }[];
    testimonial?: { quote: string; author: string; role: string; image?: IImage };

    // Portfolio Control
    featured: boolean;
    showInPortfolio: boolean;
    showInHomepage: boolean;
    displayOrder: number;
    relatedProjects: mongoose.Types.ObjectId[];
    publishDate?: Date; // New
    unpublishDate?: Date; // New

    // SEO
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    ogImage?: IImage;

    // System
    status: 'draft' | 'published' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema = new Schema({
    url: { type: String, required: true },
    alt: { type: String },
    caption: { type: String },
    width: { type: Number },
    height: { type: Number },
    aspectRatio: { type: String },
    fileSize: { type: Number },
}, { _id: false });

const ProjectSchema: Schema = new Schema({
    // Basic Info
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortSummary: { type: String, required: true },
    description: { type: String, required: true },

    // Client Info
    clientName: { type: String, required: true },
    clientCompany: { type: String, required: true },
    clientWebsite: { type: String },
    clientIndustry: { type: String },
    clientLogo: { type: ImageSchema },

    // Project Meta
    projectYear: { type: String },
    projectLocation: { type: String },
    projectDuration: { type: String },
    projectUrl: { type: String },

    // Classification
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    displayCategoryOverride: { type: String },
    subcategoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: String }],
    techStack: [{
        name: { type: String, required: true },
        category: { type: String }
    }],

    // Media
    thumbnail: { type: ImageSchema, required: true },
    coverImage: { type: ImageSchema, required: true },
    galleryImages: [ImageSchema],
    heroImageOverride: { type: ImageSchema },
    heroImageOverlayOpacity: { type: Number, min: 0, max: 1 },
    heroImageOverlayColor: { type: String },

    // Case Study
    overview: { type: String },
    problemStatement: { type: String },
    objectives: { type: String },
    goals: { type: String },
    targetAudience: { type: String },
    challenges: [{ type: String }],
    solution: [{ type: String }],
    processSteps: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: ImageSchema }
    }],

    // Results
    metrics: [{
        label: { type: String, required: true },
        value: { type: String, required: true },
        unit: { type: String }
    }],
    testimonial: {
        quote: { type: String },
        author: { type: String },
        role: { type: String },
        image: { type: ImageSchema }
    },

    // Portfolio Control
    featured: { type: Boolean, default: false, index: true },
    showInPortfolio: { type: Boolean, default: true, index: true },
    showInHomepage: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    relatedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    publishDate: { type: Date },
    unpublishDate: { type: Date },

    // SEO
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: [{ type: String }],
    ogImage: { type: ImageSchema },

    // System
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
}, { timestamps: true });

// Prevent overwrite error for hot reloads
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Project;
}
const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;

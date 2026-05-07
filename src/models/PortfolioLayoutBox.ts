import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPortfolioLayoutBox extends Document {
    order: number;
    projectId: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const PortfolioLayoutBoxSchema: Schema = new Schema(
    {
        order: {
            type: Number,
            required: true,
            unique: true,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model overwrite in development
const PortfolioLayoutBox: Model<IPortfolioLayoutBox> =
    mongoose.models.PortfolioLayoutBox || mongoose.model<IPortfolioLayoutBox>('PortfolioLayoutBox', PortfolioLayoutBoxSchema);

export default PortfolioLayoutBox;

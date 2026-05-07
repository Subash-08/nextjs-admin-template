import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILayoutCounter extends Omit<Document, '_id'> {
    _id: string;
    seq: number;
}

const LayoutCounterSchema: Schema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});

const LayoutCounter: Model<ILayoutCounter> =
    mongoose.models.LayoutCounter || mongoose.model<ILayoutCounter>('LayoutCounter', LayoutCounterSchema);

export default LayoutCounter;

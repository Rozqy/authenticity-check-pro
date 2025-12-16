import mongoose, { Schema, Document } from 'mongoose';

export interface IReferenceImage extends Document {
  brand_id: mongoose.Types.ObjectId;
  image_url: string;
  type: 'genuine' | 'fake';
  notes?: string;
}

const ReferenceImageSchema: Schema = new Schema({
  brand_id: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['genuine', 'fake'],
    required: true,
  },
  notes: {
    type: String,
  },
});

export default mongoose.models.ReferenceImage || mongoose.model<IReferenceImage>('ReferenceImage', ReferenceImageSchema);





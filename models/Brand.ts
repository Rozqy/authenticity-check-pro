import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  logo?: string;
  description: string;
  official_site?: string;
  tags: string[];
  created_at: Date;
}

const BrandSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  official_site: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);





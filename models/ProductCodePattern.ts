import mongoose, { Schema, Document } from 'mongoose';

export interface IProductCodePattern extends Document {
  brand_id: mongoose.Types.ObjectId;
  pattern: string;
  is_genuine: boolean;
  notes?: string;
}

const ProductCodePatternSchema: Schema = new Schema({
  brand_id: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  pattern: {
    type: String,
    required: true,
  },
  is_genuine: {
    type: Boolean,
    required: true,
    default: true,
  },
  notes: {
    type: String,
  },
});

export default mongoose.models.ProductCodePattern || mongoose.model<IProductCodePattern>('ProductCodePattern', ProductCodePatternSchema);





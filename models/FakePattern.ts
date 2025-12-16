import mongoose, { Schema, Document } from 'mongoose';

export interface IFakePattern extends Document {
  brand_id: mongoose.Types.ObjectId;
  pattern: string;
  fake_signs: string[];
  risk_level: 'low' | 'medium' | 'high';
}

const FakePatternSchema: Schema = new Schema({
  brand_id: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  pattern: {
    type: String,
    required: true,
  },
  fake_signs: {
    type: [String],
    default: [],
  },
  risk_level: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
});

export default mongoose.models.FakePattern || mongoose.model<IFakePattern>('FakePattern', FakePatternSchema);





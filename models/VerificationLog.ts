import mongoose, { Schema, Document } from 'mongoose';

export interface IVerificationLog extends Document {
  method: 'code' | 'image';
  brand?: string;
  score?: number;
  result: 'verified' | 'fake' | 'pending';
  timestamp: Date;
  ip?: string;
  details: Record<string, any>;
  user_email?: string;
}

const VerificationLogSchema: Schema = new Schema({
  method: {
    type: String,
    enum: ['code', 'image'],
    required: true,
  },
  brand: {
    type: String,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  result: {
    type: String,
    enum: ['verified', 'fake', 'pending'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
  },
  details: {
    type: Schema.Types.Mixed,
    default: {},
  },
  user_email: {
    type: String,
  },
});

export default mongoose.models.VerificationLog || mongoose.model<IVerificationLog>('VerificationLog', VerificationLogSchema);





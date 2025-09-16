import mongoose, { Schema, Document } from 'mongoose';

export interface IFine extends Document {
  user: string;
  amount: number;
  reason: string;
  paid: boolean;
}

const FineSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  paid: { type: Boolean, default: false }
});

export default mongoose.model<IFine>('Fine', FineSchema);

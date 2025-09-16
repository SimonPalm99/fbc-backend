import mongoose, { Schema, Document } from 'mongoose';

export interface ITraining extends Document {
  date: Date;
  team: string;
  description: string;
}

const TrainingSchema: Schema = new Schema({
  date: { type: Date, required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  description: { type: String }
});

export default mongoose.model<ITraining>('Training', TrainingSchema);

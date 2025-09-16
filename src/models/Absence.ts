import mongoose, { Schema, Document } from 'mongoose';

export interface IAbsence extends Document {
  activityId: string;
  activityTitle: string;
  userId: string;
  userName: string;
  reason: string;
  comment: string;
  date: string;
}

const AbsenceSchema: Schema = new Schema({
  activityId: { type: String, required: true },
  activityTitle: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  reason: { type: String, required: true },
  comment: { type: String },
  date: { type: String, required: true }
});

export default mongoose.model<IAbsence>('Absence', AbsenceSchema);

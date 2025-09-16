import { Schema, model } from 'mongoose';

export interface CheckInOut {
  activityId: string;
  activityTitle: string;
  userId: string;
  userName: string;
  type: 'in' | 'out';
  bodyFeeling: number; // 1-4
  mentalFeeling: number; // 1-4
  date: string;
}

const checkInOutSchema = new Schema<CheckInOut>({
  activityId: { type: String, required: true },
  activityTitle: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  bodyFeeling: { type: Number, min: 1, max: 4, required: true },
  mentalFeeling: { type: Number, min: 1, max: 4, required: true },
  date: { type: String, required: true }
});

export default model<CheckInOut>('CheckInOut', checkInOutSchema);

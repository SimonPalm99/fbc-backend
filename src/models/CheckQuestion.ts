import { Schema, model } from 'mongoose';

export interface CheckQuestion {
  _id?: string;
  type: 'in' | 'out'; // Vilken popup frågan gäller
  text: string; // Frågetext
  options: string[]; // Svarsalternativ
}

const checkQuestionSchema = new Schema<CheckQuestion>({
  type: { type: String, enum: ['in', 'out'], required: true },
  text: { type: String, required: true },
  options: { type: [String], required: true }
});

export default model<CheckQuestion>('CheckQuestion', checkQuestionSchema);

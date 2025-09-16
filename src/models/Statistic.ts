import mongoose, { Schema, Document } from 'mongoose';

export interface IStatistic extends Document {
  user: string;
  goals: number;
  assists: number;
  matches: number;
}

const StatisticSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  matches: { type: Number, default: 0 }
});

export default mongoose.model<IStatistic>('Statistic', StatisticSchema);

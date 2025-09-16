import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  date: Date;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
}

const MatchSchema: Schema = new Schema({
  date: { type: Date, required: true },
  teamA: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 }
});

export default mongoose.model<IMatch>('Match', MatchSchema);

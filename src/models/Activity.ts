import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  type: string;
  important?: boolean;
  participants: Array<{ userId: string; status: string; absenceReason?: string }>;
  comments: Array<{ userId: string; text: string; timestamp: string }>;
}

const ActivitySchema: Schema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String },
  endTime: { type: String },
  location: { type: String },
  description: { type: String },
  type: { type: String, required: true },
  important: { type: Boolean, default: false },
  participants: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String },
    absenceReason: { type: String }
  }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String },
    timestamp: { type: String }
  }]
});

export default mongoose.model<IActivity>('Activity', ActivitySchema);

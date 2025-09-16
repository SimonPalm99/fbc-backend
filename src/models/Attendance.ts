import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  user: string;
  event: string;
  attended: boolean;
}

const AttendanceSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: Schema.Types.ObjectId, required: true },
  attended: { type: Boolean, default: false }
});

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);

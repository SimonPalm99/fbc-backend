const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  id: { type: String, required: true, unique: true }, // strängbaserat id
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
  }],
  color: { type: String },
  tags: [{ type: String }]
});

module.exports = mongoose.model('Activity', ActivitySchema);

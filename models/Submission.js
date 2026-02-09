/**
 * @model Submission
 * @description Stores file submissions from participants for events
 */
import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  eventId: {
    type: Number,
    required: true,
  },
  eventName: {
    type: String,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
  },
  fileType: {
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index for faster lookups
SubmissionSchema.index({ eventId: 1, userEmail: 1 });

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);

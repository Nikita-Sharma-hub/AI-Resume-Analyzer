import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'screening', 'interview', 'shortlisted', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Get all applications for a specific user
export async function getApplicationsByUser(userId) {
  try {
    const applications = await mongoose.model('Application', applicationSchema)
      .find({ userId })
      .populate('jobId', 'title company location')
      .populate('resumeId', 'fileUrl originalName')
      .sort({ appliedAt: -1 })
      .exec();
    
    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

export default mongoose.model('Application', applicationSchema);

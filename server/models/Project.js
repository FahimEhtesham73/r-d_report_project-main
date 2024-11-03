import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  projectLead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  duration: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'on-hold'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
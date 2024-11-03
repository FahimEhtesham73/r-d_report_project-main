import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['draft', 'in-review', 'completed'],
    default: 'draft'
  },
  files: [{
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
  }],
  researchPapers: [{
    title: String,
    publishedYear: Number,
    dataset: String,
    accuracy: Number,
    precision: Number,
    recall: Number
  }]
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
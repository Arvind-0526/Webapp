const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  abstract: {
    type: String,
    required: [true, 'Abstract is required'],
  },
  authors: {
    type: [String],
    required: [true, 'Authors are required'],
  },
  primaryAuthor: {
    type: String,
    required: [true, 'Primary author is required'],
  },
  college: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
    default: [],
  },
  pdfPath: {
    type: String,
    required: [true, 'PDF file is required'],
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  publicationId: {
    type: String,
    unique: true,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adminNotes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
  },
});

// Generate publication ID before saving
journalSchema.pre('save', async function() {
  if (!this.publicationId) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.publicationId = `NEX-JRNL-${year}-${String(count + 1).padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Journal', journalSchema);
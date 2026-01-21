const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const Journal = require('../models/Journal');
const User = require('../models/User');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer for PDF uploads with custom naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Enforce naming: journal-title_timestamp.pdf (student name will be added via rename if needed)
    const title = req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'journal';
    const timestamp = Date.now();
    const filename = `${title}_${timestamp}.pdf`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

// Upload Journal
router.post('/upload', authenticateToken, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'PDF file is required' });
    }

    const {
      title,
      abstract,
      authors,
      primaryAuthor,
      keywords,
      visibility,
      agreementAccepted,
    } = req.body;

    // Validate agreement
    if (agreementAccepted !== 'true' && agreementAccepted !== true) {
      // Delete uploaded file if agreement not accepted
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'You must accept the agreement' });
    }

    // Parse authors array
    const authorsArray = typeof authors === 'string' ? authors.split(',').map(a => a.trim()) : authors;

    // Parse keywords array
    const keywordsArray = keywords ? (typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : keywords) : [];

    const journal = new Journal({
      title,
      abstract,
      authors: authorsArray,
      primaryAuthor,
      college: req.user.college,
      department: req.user.department,
      year: req.user.year,
      keywords: keywordsArray,
      pdfPath: `/uploads/${req.file.filename}`,
      visibility: visibility || 'public',
      uploadedBy: req.user._id,
    });

    await journal.save();

    res.status(201).json({
      success: true,
      message: 'Journal uploaded successfully',
      journal: {
        id: journal._id,
        title: journal.title,
        publicationId: journal.publicationId,
        status: journal.status,
        pdfFilename: req.file.filename,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Clean up file if save failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Get All Public Journals (with filters)
router.get('/', async (req, res) => {
  try {
    const { status, college, department, keyword } = req.query;

    const filter = { visibility: 'public' };
    
    if (status) filter.status = status;
    if (college) filter.college = new RegExp(college, 'i');
    if (department) filter.department = new RegExp(department, 'i');
    if (keyword) filter.keywords = new RegExp(keyword, 'i');

    const journals = await Journal.find(filter)
      .populate('uploadedBy', 'name email college department')
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: journals.length,
      journals,
    });
  } catch (error) {
    console.error('Fetch journals error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch journals' });
  }
});

// Get Single Journal
router.get('/:id', async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id)
      .populate('uploadedBy', 'name email college department year');

    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal not found' });
    }

    // Increment download count
    journal.downloadCount += 1;
    await journal.save();

    res.json({
      success: true,
      journal,
    });
  } catch (error) {
    console.error('Fetch journal error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch journal' });
  }
});

// Get My Journals (Student Dashboard)
router.get('/my/journals', authenticateToken, async (req, res) => {
  try {
    const journals = await Journal.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: journals.length,
      journals,
    });
  } catch (error) {
    console.error('Fetch my journals error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch journals' });
  }
});

module.exports = router;
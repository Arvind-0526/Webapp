const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Journal = require('../models/Journal');
const User = require('../models/User');
const { sendApprovalEmail } = require('../utils/emailService');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Get All Journals (Admin)
router.get('/journals', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const journals = await Journal.find(filter)
      .populate('uploadedBy', 'name email college department year')
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: journals.length,
      journals,
    });
  } catch (error) {
    console.error('Fetch admin journals error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch journals' });
  }
});

// Get Pending Journals
router.get('/journals/pending', async (req, res) => {
  try {
    const journals = await Journal.find({ status: 'pending' })
      .populate('uploadedBy', 'name email college department year')
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: journals.length,
      journals,
    });
  } catch (error) {
    console.error('Fetch pending journals error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending journals' });
  }
});

// Approve Journal
router.put('/journals/:id/approve', async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const journal = await Journal.findById(req.params.id).populate('uploadedBy');
    
    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal not found' });
    }

    if (journal.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Journal already approved' });
    }

    // Update journal status
    journal.status = 'approved';
    journal.approvedAt = new Date();
    if (adminNotes) journal.adminNotes = adminNotes;
    await journal.save();

    // Send approval email
    const journalLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/journal/${journal._id}`;
    const emailResult = await sendApprovalEmail(
      journal.uploadedBy.email,
      journal.uploadedBy.name,
      journal.title,
      journal.publicationId,
      journalLink
    );

    res.json({
      success: true,
      message: 'Journal approved successfully',
      journal: {
        id: journal._id,
        title: journal.title,
        status: journal.status,
        approvedAt: journal.approvedAt,
      },
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error('Approve journal error:', error);
    res.status(500).json({ success: false, message: 'Failed to approve journal' });
  }
});

// Reject Journal
router.put('/journals/:id/reject', async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal not found' });
    }

    journal.status = 'rejected';
    if (adminNotes) journal.adminNotes = adminNotes;
    await journal.save();

    res.json({
      success: true,
      message: 'Journal rejected',
      journal: {
        id: journal._id,
        title: journal.title,
        status: journal.status,
      },
    });
  } catch (error) {
    console.error('Reject journal error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject journal' });
  }
});

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalJournals = await Journal.countDocuments();
    const pending = await Journal.countDocuments({ status: 'pending' });
    const approved = await Journal.countDocuments({ status: 'approved' });
    const rejected = await Journal.countDocuments({ status: 'rejected' });
    const totalStudents = await User.countDocuments({ role: 'student' });

    res.json({
      success: true,
      stats: {
        totalJournals,
        pending,
        approved,
        rejected,
        totalStudents,
      },
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

module.exports = router;
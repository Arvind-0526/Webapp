const express = require('express');
const User = require('../models/User');
const Journal = require('../models/Journal');

const router = express.Router();

// Get Student Porthole (Public Profile)
router.get('/:id/porthole', async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password -__v');
    
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Get all journals by this student (including private ones if viewing own profile)
    const journals = await Journal.find({ uploadedBy: student._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        college: student.college,
        department: student.department,
        year: student.year,
        joinedDate: student.createdAt,
      },
      journals: journals.map(j => ({
        id: j._id,
        title: j.title,
        abstract: j.abstract,
        publicationId: j.publicationId,
        status: j.status,
        visibility: j.visibility,
        downloadCount: j.downloadCount,
        createdAt: j.createdAt,
        approvedAt: j.approvedAt,
      })),
      stats: {
        totalJournals: journals.length,
        approved: journals.filter(j => j.status === 'approved').length,
        pending: journals.filter(j => j.status === 'pending').length,
        rejected: journals.filter(j => j.status === 'rejected').length,
      },
    });
  } catch (error) {
    console.error('Fetch porthole error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student profile' });
  }
});

module.exports = router;
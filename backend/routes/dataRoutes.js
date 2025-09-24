const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const UserData = require('../models/UserData');
const router = express.Router();

// GET /api/data/:sectionId - Get all data for a specific section
router.get('/:sectionId', async (req, res) => {
  try {
    const { sectionId } = req.params;

    const records = await UserData.find({ sectionType: sectionId }).sort({ createdAt: -1 });
    const data = records.map(record => record.data);

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
});

// POST /api/data/:sectionId - Create new data for a specific section
router.post('/:sectionId', protect, async (req, res) => {
  try {
    const { sectionId } = req.params;
    const userId = req.user._id;

    const newRecord = new UserData({
      userId,
      sectionType: sectionId,
      data: req.body
    });

    await newRecord.save();

    res.status(201).json({
      success: true,
      data: newRecord.data,
      message: 'Data created successfully'
    });
  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating data',
      error: error.message
    });
  }
});

// PUT /api/data/:sectionId/:id - Update specific data record
router.put('/:sectionId/:id', protect, async (req, res) => {
  try {
    const { sectionId, id } = req.params;
    const userId = req.user._id;

    const record = await UserData.findOneAndUpdate(
      { _id: id, userId, sectionType: sectionId },
      { data: req.body },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      data: record.data,
      message: 'Data updated successfully'
    });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating data',
      error: error.message
    });
  }
});

// DELETE /api/data/:sectionId/:id - Delete specific data record
router.delete('/:sectionId/:id', protect, async (req, res) => {
  try {
    const { sectionId, id } = req.params;
    const userId = req.user._id;

    const record = await UserData.findOneAndDelete({
      _id: id,
      userId,
      sectionType: sectionId
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      message: 'Data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting data',
      error: error.message
    });
  }
});

// GET /api/data/:sectionId/stats - Get statistics for a section
router.get('/:sectionId/stats', protect, async (req, res) => {
  try {
    const { sectionId } = req.params;
    const userId = req.user._id;

    const records = await UserData.find({ userId, sectionType: sectionId });
    const count = records.length;

    res.json({
      success: true,
      stats: {
        count,
        sectionType: sectionId
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;

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

    // Debug logging
    console.log(`Found ${records.length} records for sectionId: ${sectionId}`);
    records.forEach((record, index) => {
      console.log(`Record ${index + 1}:`, {
        mongoId: record._id,
        dataId: record.data?.id,
        data: record.data
      });
    });

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

// GET /api/data/:sectionId/:id - Get specific data record by ID
router.get('/:sectionId/:id', async (req, res) => {
  try {
    const { sectionId, id } = req.params;

    let query;
    
    // Check if the ID looks like a MongoDB ObjectId (24 hex chars)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a MongoDB ObjectId
      query = { _id: id, sectionType: sectionId };
    } else {
      // It's a simple ID stored in the data field
      query = { 
        'data.id': parseInt(id), 
        sectionType: sectionId 
      };
    }

    console.log('Fetching by ID with query:', query);

    const record = await UserData.findOne(query);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      data: record.data
    });
  } catch (error) {
    console.error('Error fetching data by ID:', error);
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

// PATCH /api/data/:sectionId/:id - Partially update specific data record
router.patch('/:sectionId/:id', protect, async (req, res) => {
  try {
    const { sectionId, id } = req.params;
    const userId = req.user._id;

    console.log('PATCH request received:', { sectionId, id, userId, body: req.body });

    let query;
    
    // Check if the ID looks like a MongoDB ObjectId (24 hex chars)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a MongoDB ObjectId
      query = { _id: id, userId, sectionType: sectionId };
    } else {
      // It's a simple ID stored in the data field
      query = { 
        'data.id': parseInt(id), 
        userId, 
        sectionType: sectionId 
      };
    }

    console.log('Query:', query);

    // Find the existing record
    const existingRecord = await UserData.findOne(query);

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Merge the existing data with the new data (partial update)
    const updatedData = { ...existingRecord.data, ...req.body };

    // Update the record
    const record = await UserData.findOneAndUpdate(
      query,
      { data: updatedData },
      { new: true, runValidators: true }
    );

    console.log('Record updated successfully:', record.data);

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

// PUT /api/data/:sectionId/:id - Replace entire data record
router.put('/:sectionId/:id', protect, async (req, res) => {
  try {
    const { sectionId, id } = req.params;
    const userId = req.user._id;

    console.log('PUT request received:', { sectionId, id, userId, body: req.body });

    let query;
    
    // Check if the ID looks like a MongoDB ObjectId (24 hex chars)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a MongoDB ObjectId
      query = { _id: id, userId, sectionType: sectionId };
      console.log('Using MongoDB ObjectId query');
    } else {
      // It's a simple ID stored in the data field
      query = { 
        'data.id': parseInt(id), 
        userId, 
        sectionType: sectionId 
      };
      console.log('Using data.id query');
    }

    console.log('Final query:', query);

    // First, let's see what records exist for debugging
    const allRecords = await UserData.find({ userId, sectionType: sectionId });
    console.log(`Found ${allRecords.length} total records for user:`, allRecords.map(r => ({
      mongoId: r._id,
      dataId: r.data?.id,
      hasMatchingDataId: r.data?.id === parseInt(id)
    })));

    // Find the existing record first
    const existingRecord = await UserData.findOne(query);

    if (!existingRecord) {
      console.log('Record not found with query:', query);
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    console.log('Found existing record:', {
      mongoId: existingRecord._id,
      dataId: existingRecord.data?.id,
      existingData: existingRecord.data
    });

    // For PUT, we merge the existing data with new data (partial update behavior)
    // This prevents losing fields that aren't being updated
    const updatedData = { ...existingRecord.data, ...req.body };

    console.log('Updating with merged data:', updatedData);

    // Update the record
    const record = await UserData.findOneAndUpdate(
      query,
      { data: updatedData },
      { new: true, runValidators: true }
    );

    console.log('Record updated successfully:', record.data);

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

    let query;
    
    // Check if the ID looks like a MongoDB ObjectId (24 hex chars)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a MongoDB ObjectId
      query = { _id: id, userId, sectionType: sectionId };
    } else {
      // It's a simple ID stored in the data field
      query = { 
        'data.id': parseInt(id), 
        userId, 
        sectionType: sectionId 
      };
    }

    console.log('Deleting with query:', query);

    const record = await UserData.findOneAndDelete(query);

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
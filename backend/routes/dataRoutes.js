const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const UserData = require('../models/UserData');
const router = express.Router();

// GET /api/data/:sectionId - Get all data for a specific section
// GET /api/data/:sectionId - Get all data for a specific section
router.get('/:sectionId', async (req, res) => {
  try {
    const { sectionId } = req.params;

    const records = await UserData.find({ sectionType: sectionId }).sort({ createdAt: -1 });
    
    // Include both the data and the MongoDB _id for each record
    const data = records.map(record => ({
      _id: record._id.toString(), // Include MongoDB _id as string
      userId: record.userId.toString(), // Include userId for reference
      ...record.data // Spread all the data fields
    }));

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

const mongoose = require('mongoose'); // Make sure this is imported at the top


router.put('/:sectionId/:id', protect, async (req, res) => {
  try {
    const { sectionId, id } = req.params;
    const userId = req.user._id;

    console.log('=== PUT REQUEST DEBUG (USER FILTER DISABLED) ===');
    console.log('Section ID:', sectionId);
    console.log('Record ID:', id);
    console.log('Record ID type:', typeof id);
    console.log('User ID:', userId);
    console.log('User ID type:', typeof userId);
    console.log('Request body:', req.body);
    console.log('⚠️  WARNING: USER FILTER TEMPORARILY DISABLED FOR TESTING');

    let query;
    let isMongoId = false;
    
    // Check if the ID looks like a MongoDB ObjectId (24 hex chars)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a MongoDB ObjectId - WITHOUT user filter
      query = { 
        _id: new mongoose.Types.ObjectId(id), 
        // userId: new mongoose.Types.ObjectId(userId), // COMMENTED OUT FOR TESTING
        sectionType: sectionId 
      };
      isMongoId = true;
      console.log('Using MongoDB ObjectId query WITHOUT user filter');
    } else {
      // It's a simple ID stored in the data field - WITHOUT user filter
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid ID format'
        });
      }
      
      query = { 
        'data.id': numericId, 
        // userId: new mongoose.Types.ObjectId(userId), // COMMENTED OUT FOR TESTING
        sectionType: sectionId 
      };
      console.log('Using data.id query with numeric ID WITHOUT user filter:', numericId);
    }

    console.log('Query object (before MongoDB):', JSON.stringify(query, null, 2));

    // Enhanced debugging: Check what records exist (also without user filter)
    console.log('=== DEBUGGING RECORDS (NO USER FILTER) ===');
    
    // Check all records for this section (without user filter)
    const sectionRecords = await UserData.find({ 
      // userId: new mongoose.Types.ObjectId(userId), // COMMENTED OUT
      sectionType: sectionId 
    });
    console.log(`All records in section "${sectionId}":`, sectionRecords.map(r => ({
      mongoId: r._id.toString(),
      dataId: r.data?.id,
      userId: r.userId.toString(),
      data: r.data
    })));

    // Find the existing record first
    console.log('=== EXECUTING MAIN QUERY (NO USER FILTER) ===');
    console.log('About to execute query:', {
      _id: query._id?.toString(),
      // userId: query.userId?.toString(), // COMMENTED OUT
      sectionType: query.sectionType
    });

    const existingRecord = await UserData.findOne(query);

    if (!existingRecord) {
      console.log('=== RECORD NOT FOUND ===');
      console.log('Query that failed:', {
        _id: query._id?.toString(),
        // userId: query.userId?.toString(), // COMMENTED OUT
        sectionType: query.sectionType
      });
      
      return res.status(404).json({
        success: false,
        message: `Record not found. Looking for ${isMongoId ? 'MongoDB _id' : 'data.id'}: ${id} in section: ${sectionId}`,
        debug: {
          query: {
            _id: query._id?.toString(),
            // userId: query.userId?.toString(), // COMMENTED OUT
            sectionType: query.sectionType
          },
          availableRecords: sectionRecords.map(r => ({
            mongoId: r._id.toString(),
            dataId: r.data?.id,
            userId: r.userId.toString()
          }))
        }
      });
    }

    console.log('=== RECORD FOUND (IGNORING USER OWNERSHIP) ===');
    console.log('Found existing record:', {
      mongoId: existingRecord._id.toString(),
      dataId: existingRecord.data?.id,
      sectionType: existingRecord.sectionType,
      recordUserId: existingRecord.userId.toString(),
      currentUserId: userId.toString(),
      userMatch: existingRecord.userId.toString() === userId.toString(),
      currentData: existingRecord.data
    });

    // ⚠️ SECURITY WARNING: We're updating a record that may belong to another user
    if (existingRecord.userId.toString() !== userId.toString()) {
      console.log('⚠️ ⚠️ ⚠️  SECURITY WARNING: Updating record owned by different user! ⚠️ ⚠️ ⚠️');
      console.log('Record owner:', existingRecord.userId.toString());
      console.log('Current user:', userId.toString());
    }

    // For PUT, we merge the existing data with new data (partial update behavior)
    const updatedData = { ...existingRecord.data, ...req.body };

    // Make sure the inner id is preserved if it exists
    if (existingRecord.data?.id && !req.body.id) {
      updatedData.id = existingRecord.data.id;
    }

    console.log('=== UPDATING RECORD (NO USER FILTER) ===');
    console.log('Merged data to update:', updatedData);

    // Update the record (using the same query without user filter)
    const record = await UserData.findOneAndUpdate(
      query,
      { 
        data: updatedData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!record) {
      console.log('=== UPDATE FAILED ===');
      return res.status(500).json({
        success: false,
        message: 'Failed to update record - findOneAndUpdate returned null'
      });
    }

    console.log('=== UPDATE SUCCESSFUL (NO USER FILTER) ===');
    console.log('Updated record data:', record.data);
    console.log('Record belongs to user:', record.userId.toString());
    console.log('Current user:', userId.toString());

    res.json({
      success: true,
      data: record.data,
      message: 'Data updated successfully (user filter disabled for testing)',
      warning: record.userId.toString() !== userId.toString() 
        ? 'Updated record belonging to different user' 
        : 'Updated own record'
    });
  } catch (error) {
    console.error('=== ERROR IN PUT ROUTE ===');
    console.error('Error updating data:', error);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    
    // Handle specific ObjectId errors
    if (error.name === 'CastError' || error.message.includes('ObjectId')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format provided',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating data',
      error: error.message
    });
  }
});

// Add this route to debug the exact issue
router.get('/debug/:sectionId/:id', protect, async (req, res) => {
  try {
    const { sectionId, id } = req.params;
    const userId = req.user._id;

    console.log('=== COMPREHENSIVE DEBUG ===');
    console.log('Section ID:', sectionId);
    console.log('Looking for ID:', id);
    console.log('User ID:', userId);

    // 1. Check what the GET route returns
    console.log('=== 1. SIMULATING GET REQUEST ===');
    const getAllRecords = await UserData.find({ 
      userId, 
      sectionType: sectionId 
    }).sort({ 'data.date': -1 });
    
    console.log(`GET would return ${getAllRecords.length} records:`);
    getAllRecords.forEach((record, index) => {
      console.log(`  Record ${index + 1}:`, {
        mongoId: record._id.toString(),
        dataId: record.data?.id,
        referralName: record.data?.referralName,
        sectionType: record.sectionType
      });
    });

    // 2. Check specific searches for the target ID
    console.log('=== 2. SEARCHING FOR TARGET ID ===');
    
    // Search by data.id (what PUT uses)
    const byDataId = await UserData.find({ 
      'data.id': parseInt(id), 
      userId, 
      sectionType: sectionId 
    });
    console.log(`Records with data.id = ${id}:`, byDataId.map(r => ({
      mongoId: r._id.toString(),
      dataId: r.data?.id,
      referralName: r.data?.referralName
    })));

    // Search by data.id across all sections
    const byDataIdAllSections = await UserData.find({ 
      'data.id': parseInt(id), 
      userId
    });
    console.log(`Records with data.id = ${id} (all sections):`, byDataIdAllSections.map(r => ({
      mongoId: r._id.toString(),
      sectionType: r.sectionType,
      dataId: r.data?.id,
      referralName: r.data?.referralName
    })));

    // 3. Check for exact record match
    console.log('=== 3. EXACT QUERIES ===');
    
    const exactQuery = { 
      'data.id': parseInt(id), 
      userId, 
      sectionType: sectionId 
    };
    console.log('Exact query object:', JSON.stringify(exactQuery, null, 2));
    
    const exactMatch = await UserData.findOne(exactQuery);
    console.log('Exact match result:', exactMatch ? {
      mongoId: exactMatch._id.toString(),
      dataId: exactMatch.data?.id,
      referralName: exactMatch.data?.referralName,
      fullData: exactMatch.data
    } : 'NO MATCH');

    // 4. Raw database inspection
    console.log('=== 4. RAW DATABASE INSPECTION ===');
    const rawRecords = await UserData.find({ userId }).lean();
    const recordsWithTargetId = rawRecords.filter(r => r.data?.id === parseInt(id));
    console.log(`Raw records with matching ID (${recordsWithTargetId.length}):`, 
      recordsWithTargetId.map(r => ({
        mongoId: r._id.toString(),
        sectionType: r.sectionType,
        dataId: r.data?.id,
        userId: r.userId.toString(),
        userMatch: r.userId.toString() === userId.toString()
      }))
    );

    // 5. Check user ID consistency
    console.log('=== 5. USER ID VERIFICATION ===');
    console.log('Request user ID:', userId.toString());
    console.log('User ID type:', typeof userId);
    
    res.json({
      success: true,
      debug: {
        requestInfo: {
          sectionId,
          targetId: id,
          userId: userId.toString(),
          userIdType: typeof userId
        },
        getAllRecordsCount: getAllRecords.length,
        getAllRecords: getAllRecords.map(r => ({
          mongoId: r._id.toString(),
          dataId: r.data?.id,
          referralName: r.data?.referralName
        })),
        byDataIdInSection: byDataId.map(r => ({
          mongoId: r._id.toString(),
          dataId: r.data?.id,
          referralName: r.data?.referralName
        })),
        byDataIdAllSections: byDataIdAllSections.map(r => ({
          mongoId: r._id.toString(),
          sectionType: r.sectionType,
          dataId: r.data?.id,
          referralName: r.data?.referralName
        })),
        exactMatch: exactMatch ? {
          mongoId: exactMatch._id.toString(),
          dataId: exactMatch.data?.id,
          referralName: exactMatch.data?.referralName
        } : null,
        rawRecordsWithTargetId: recordsWithTargetId.map(r => ({
          mongoId: r._id.toString(),
          sectionType: r.sectionType,
          dataId: r.data?.id,
          userId: r.userId.toString(),
          userMatch: r.userId.toString() === userId.toString()
        }))
      }
    });

  } catch (error) {
    console.error('Error in debug route:', error);
    res.status(500).json({
      success: false,
      message: 'Error in debug route',
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
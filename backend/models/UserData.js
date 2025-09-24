const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sectionType: { type: String, required: true }, // 'p2p', 'business-opportunity-received', 'connections', 'testimonials', etc.
  data: { type: mongoose.Schema.Types.Mixed, required: true }, // Flexible JSON storage
}, { timestamps: true });

// Index for efficient querying
userDataSchema.index({ userId: 1, sectionType: 1 });
userDataSchema.index({ sectionType: 1 });

module.exports = mongoose.model('UserData', userDataSchema);

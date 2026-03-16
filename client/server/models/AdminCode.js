const mongoose = require('mongoose');

const adminCodeSchema = new mongoose.Schema({
  code:      { type: String, required: true, unique: true },
  district:  { type: String, required: true },
  used:      { type: Boolean, default: false },
  usedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  usedAt:    { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('AdminCode', adminCodeSchema);

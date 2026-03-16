const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, enum: ['Roads','Water','Electricity','Sanitation','Parks','Other'], required: true },
  status:      { type: String, enum: ['Pending','In Progress','Resolved','Rejected'], default: 'Pending' },
  priority:    { type: String, enum: ['Low','Medium','High'], default: 'Low' },
  // district should always be provided by client; no hardcoded default
  district:    { type: String, required: true },
  location:    { 
    address: { type: String, default: "" },
    lat:     { type: Number, default: null },
    lng:     { type: Number, default: null },
  },
  images:      [String],
  citizen:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  department:  { type: String },
  comments: [{
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    date:    { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
const mongoose = require('mongoose');

const lockerRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  phone: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },

  reason: {
    type: String,
    required: true,
    maxlength: 500
  },

  locationText: {
    type: String,
    required: true
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },

  areaType: {
    type: String,
    required: true
  },

  urgencyLevel: {
    type: String,
    required: true
  },

  ipAddress: String,

  status: {
    type: String,
    default: 'new'
  }

}, { timestamps: true });

// 🔥 Important for geo queries
lockerRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('LockerRequest', lockerRequestSchema);

const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  semester: { type: String, required: true },       // "Fall 2025"
  courseCode: { type: String, required: true },     // "COMP 2540"
  sectionNumber: String,                            // "01"
  professor: String,
  days: String,                                     // "MWF"
  time: String,                                     // "10:00-10:50"
  location: String,
  seatsAvailable: Number,
}, { timestamps: true });

sectionSchema.index({ semester: 1, courseCode: 1 });

module.exports = mongoose.model('Section', sectionSchema);

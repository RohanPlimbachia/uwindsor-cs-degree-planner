const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameKey: { type: String, required: true, unique: true }, // "lastname_fi" e.g. "kobti_z"
  rmpId: String,
  rating: { type: Number, default: null },         // 1.0–5.0
  difficulty: { type: Number, default: null },     // 1.0–5.0
  wouldTakeAgain: { type: Number, default: null }, // 0–100 percent
  numRatings: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Professor', professorSchema);

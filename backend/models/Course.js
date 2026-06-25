const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true, 
        uppercase: true
    },
    name: {
        type: String,
        required: true 
    },
    credits: {
        type: Number,
        default: 3
    },
    prereqs: [{
        type: String 
    }],
    description: {
        type: String,
        required: false
    },
    year: { type: Number, min: 1, max: 4 },
    isCore: { type: Boolean, default: false },
    category: { type: String, enum: ['core', 'elective', 'math', 'science', 'other'], default: 'other' },
});

module.exports = mongoose.model('Course', courseSchema);
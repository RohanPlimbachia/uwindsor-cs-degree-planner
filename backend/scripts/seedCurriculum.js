require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Course = require('../models/Course');

// Full UWindsor B.Sc. Computer Science curriculum with prereqs, year, and requirement type.
// Source: UWindsor CS undergraduate calendar.
const curriculum = [
  // Year 1 — Core
  { code: 'COMP 1000', name: 'Key Concepts in Computer Science', credits: 3, prereqs: [], year: 1, isCore: true, category: 'core' },
  { code: 'COMP 1400', name: 'Intro to Algorithms and Programming I', credits: 3, prereqs: [], year: 1, isCore: true, category: 'core' },
  { code: 'MATH 1020', name: 'Mathematical Foundations for Computer Science', credits: 3, prereqs: [], year: 1, isCore: true, category: 'math' },
  { code: 'MATH 1250', name: 'Linear Algebra', credits: 3, prereqs: [], year: 1, isCore: true, category: 'math' },
  { code: 'MATH 1720', name: 'Differential Calculus', credits: 3, prereqs: [], year: 1, isCore: true, category: 'math' },
  { code: 'COMP 1410', name: 'Intro to Algorithms and Programming II', credits: 3, prereqs: ['COMP 1400', 'COMP 1000'], year: 1, isCore: true, category: 'core' },
  { code: 'COMP 1047', name: 'Computer Concepts for End-Users', credits: 3, prereqs: [], year: 1, isCore: false, category: 'elective' },
  { code: 'MATH 1730', name: 'Integral Calculus', credits: 3, prereqs: ['MATH 1720'], year: 1, isCore: false, category: 'math' },

  // Year 2 — Core
  { code: 'COMP 2120', name: 'Object-Oriented Programming', credits: 3, prereqs: ['COMP 1410'], year: 2, isCore: true, category: 'core' },
  { code: 'COMP 2540', name: 'Data Structures and Algorithms', credits: 3, prereqs: ['COMP 2120', 'COMP 1000'], year: 2, isCore: true, category: 'core' },
  { code: 'COMP 2560', name: 'Systems Programming', credits: 3, prereqs: ['COMP 1410'], year: 2, isCore: true, category: 'core' },
  { code: 'COMP 2650', name: 'Computer Architecture I', credits: 3, prereqs: ['COMP 1400', 'COMP 1000'], year: 2, isCore: true, category: 'core' },
  { code: 'COMP 2660', name: 'Computer Architecture II', credits: 3, prereqs: ['COMP 2650'], year: 2, isCore: true, category: 'core' },
  { code: 'STAT 2910', name: 'Statistics for the Sciences', credits: 3, prereqs: ['MATH 1720'], year: 2, isCore: true, category: 'science' },

  // Year 3 — Core
  { code: 'COMP 3150', name: 'Database Management Systems', credits: 3, prereqs: ['COMP 2540'], year: 3, isCore: true, category: 'core' },
  { code: 'COMP 3220', name: 'Object-Oriented Software Analysis and Design', credits: 3, prereqs: ['COMP 2120'], year: 3, isCore: true, category: 'core' },
  { code: 'COMP 3300', name: 'Operating Systems', credits: 3, prereqs: ['COMP 2120', 'COMP 2560'], year: 3, isCore: true, category: 'core' },
  { code: 'COMP 3400', name: 'Advanced Object-Oriented System Design', credits: 3, prereqs: ['COMP 2120'], year: 3, isCore: true, category: 'core' },
  { code: 'COMP 3540', name: 'Theory of Computation', credits: 3, prereqs: ['COMP 2540', 'MATH 1020'], year: 3, isCore: false, category: 'core' },
  { code: 'COMP 3670', name: 'Introduction to Artificial Intelligence', credits: 3, prereqs: ['COMP 2540'], year: 3, isCore: false, category: 'elective' },
  { code: 'COMP 3680', name: 'Net-Centric Computing', credits: 3, prereqs: ['COMP 2560'], year: 3, isCore: false, category: 'elective' },
  { code: 'COMP 3770', name: 'Game Design and Development', credits: 3, prereqs: ['COMP 2120'], year: 3, isCore: false, category: 'elective' },

  // Year 4 — Core + Electives
  { code: 'COMP 4400', name: 'Principles of Programming Languages', credits: 3, prereqs: ['COMP 2540', 'COMP 2120'], year: 4, isCore: true, category: 'core' },
  { code: 'COMP 4730', name: 'Machine Learning', credits: 3, prereqs: ['COMP 3670', 'STAT 2910'], year: 4, isCore: false, category: 'elective' },
  { code: 'COMP 4200', name: 'Mobile Application Development', credits: 3, prereqs: ['COMP 3220'], year: 4, isCore: false, category: 'elective' },
  { code: 'COMP 4800', name: 'Selected Topics in Computer Science', credits: 3, prereqs: ['COMP 2540'], year: 4, isCore: false, category: 'elective' },
  { code: 'COMP 4960', name: 'Research Project', credits: 3, prereqs: ['COMP 3220', 'COMP 3300'], year: 4, isCore: false, category: 'elective' },
  { code: 'COMP 4990', name: 'Capstone Project', credits: 3, prereqs: ['COMP 3220', 'COMP 3400'], year: 4, isCore: true, category: 'core' },
];

async function seed() {
  await connectDB();

  let count = 0;
  for (const course of curriculum) {
    await Course.findOneAndUpdate({ code: course.code }, course, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    count++;
  }

  console.log(`Seeded ${count} courses`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err.message); process.exit(1); });

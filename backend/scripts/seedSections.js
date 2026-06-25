// Dev seed: populate realistic UWindsor CS sections and professor ratings
// so POST /api/schedule/suggest works immediately without needing the live scraper.
// Run: node scripts/seedSections.js
// Professor ratings below are sample data — run syncSchedule.js for real RMP data.

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Section = require('../models/Section');
const Professor = require('../models/Professor');

const SEMESTER = process.env.CURRENT_SEMESTER || 'Fall 2025';

const sections = [
  { courseCode: 'COMP 1000', sectionNumber: '01', professor: 'Ziad Kobti',     days: 'MWF', time: '09:00-09:50', location: 'Erie Hall 1120' },
  { courseCode: 'COMP 1000', sectionNumber: '02', professor: 'Dan Wu',          days: 'TR',  time: '10:00-11:15', location: 'Erie Hall 1120' },
  { courseCode: 'COMP 1400', sectionNumber: '01', professor: 'Sherif Saad',     days: 'MWF', time: '10:00-10:50', location: 'Lambton Tower 1120' },
  { courseCode: 'COMP 1400', sectionNumber: '02', professor: 'Imran Ahmad',     days: 'TR',  time: '13:00-14:15', location: 'Erie Hall 2120' },
  { courseCode: 'COMP 1410', sectionNumber: '01', professor: 'Ahmad Biniaz',    days: 'TR',  time: '13:00-14:15', location: 'Erie Hall 2120' },
  { courseCode: 'COMP 2120', sectionNumber: '01', professor: 'Imran Ahmad',     days: 'MWF', time: '11:00-11:50', location: 'Erie Hall 1120' },
  { courseCode: 'COMP 2120', sectionNumber: '02', professor: 'Sherif Saad',     days: 'TR',  time: '08:30-09:45', location: 'Essex Hall 122' },
  { courseCode: 'COMP 2540', sectionNumber: '01', professor: 'Ahmad Biniaz',    days: 'MWF', time: '09:00-09:50', location: 'Essex Hall 122' },
  { courseCode: 'COMP 2560', sectionNumber: '01', professor: 'Arunita Jaekel',  days: 'TR',  time: '14:30-15:45', location: 'Erie Hall 3120' },
  { courseCode: 'COMP 2650', sectionNumber: '01', professor: 'Mehdi Kargar',    days: 'MWF', time: '13:00-13:50', location: 'Lambton Tower 1120' },
  { courseCode: 'COMP 2660', sectionNumber: '01', professor: 'Mehdi Kargar',    days: 'MWF', time: '14:00-14:50', location: 'Lambton Tower 1120' },
  { courseCode: 'COMP 3150', sectionNumber: '01', professor: 'Ziad Kobti',      days: 'TR',  time: '08:30-09:45', location: 'Erie Hall 1120' },
  { courseCode: 'COMP 3220', sectionNumber: '01', professor: 'Sherif Saad',     days: 'MWF', time: '14:00-14:50', location: 'Essex Hall 122' },
  { courseCode: 'COMP 3300', sectionNumber: '01', professor: 'Arunita Jaekel',  days: 'MWF', time: '10:00-10:50', location: 'Erie Hall 2120' },
  { courseCode: 'COMP 3400', sectionNumber: '01', professor: 'Imran Ahmad',     days: 'TR',  time: '11:30-12:45', location: 'Erie Hall 3120' },
  { courseCode: 'COMP 3670', sectionNumber: '01', professor: 'Ziad Kobti',      days: 'TR',  time: '16:00-17:15', location: 'Essex Hall 122' },
  { courseCode: 'COMP 3680', sectionNumber: '01', professor: 'Dan Wu',          days: 'MWF', time: '13:00-13:50', location: 'Erie Hall 1120' },
  { courseCode: 'COMP 3540', sectionNumber: '01', professor: 'Ahmad Biniaz',    days: 'TR',  time: '10:00-11:15', location: 'Erie Hall 3120' },
  { courseCode: 'COMP 4400', sectionNumber: '01', professor: 'Sherif Saad',     days: 'MWF', time: '15:00-15:50', location: 'Essex Hall 122' },
  { courseCode: 'COMP 4990', sectionNumber: '01', professor: 'Ziad Kobti',      days: 'TR',  time: '13:00-14:15', location: 'Erie Hall 1120' },
  { courseCode: 'MATH 1020', sectionNumber: '01', professor: 'TBA',             days: 'MWF', time: '09:00-09:50', location: 'Memorial Hall 105' },
  { courseCode: 'MATH 1250', sectionNumber: '01', professor: 'TBA',             days: 'TR',  time: '10:00-11:15', location: 'Memorial Hall 105' },
  { courseCode: 'MATH 1720', sectionNumber: '01', professor: 'TBA',             days: 'MWF', time: '11:00-11:50', location: 'Memorial Hall 106' },
  { courseCode: 'STAT 2910', sectionNumber: '01', professor: 'TBA',             days: 'TR',  time: '13:00-14:15', location: 'Memorial Hall 105' },
];

// Sample RMP ratings — replace with real data via syncSchedule.js + fetchRatings.js
const professors = [
  { name: 'Ziad Kobti',    nameKey: 'kobti_z',   rating: 3.8, difficulty: 3.2, wouldTakeAgain: 72, numRatings: 45 },
  { name: 'Dan Wu',        nameKey: 'wu_d',       rating: 4.1, difficulty: 2.8, wouldTakeAgain: 81, numRatings: 38 },
  { name: 'Sherif Saad',   nameKey: 'saad_s',     rating: 4.4, difficulty: 3.5, wouldTakeAgain: 88, numRatings: 22 },
  { name: 'Ahmad Biniaz',  nameKey: 'biniaz_a',   rating: 4.6, difficulty: 3.8, wouldTakeAgain: 91, numRatings: 15 },
  { name: 'Imran Ahmad',   nameKey: 'ahmad_i',    rating: 3.5, difficulty: 3.6, wouldTakeAgain: 65, numRatings: 30 },
  { name: 'Arunita Jaekel',nameKey: 'jaekel_a',   rating: 3.9, difficulty: 3.1, wouldTakeAgain: 76, numRatings: 28 },
  { name: 'Mehdi Kargar',  nameKey: 'kargar_m',   rating: 4.2, difficulty: 3.3, wouldTakeAgain: 84, numRatings: 18 },
];

async function seed() {
  await connectDB();

  await Section.deleteMany({ semester: SEMESTER });
  await Section.insertMany(sections.map(s => ({ ...s, semester: SEMESTER })));
  console.log(`Seeded ${sections.length} sections for ${SEMESTER}`);

  for (const p of professors) {
    await Professor.findOneAndUpdate({ nameKey: p.nameKey }, p, { upsert: true });
  }
  console.log(`Seeded ${professors.length} professors`);

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err.message); process.exit(1); });

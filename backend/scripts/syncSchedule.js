// Production sync: scrape live UWindsor schedule and fetch RMP ratings.
// Requires UWINDSOR_SCHEDULE_URL and CURRENT_SEMESTER in .env.
// Run: node scripts/syncSchedule.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Section = require('../models/Section');
const Professor = require('../models/Professor');
const { scrapeSchedule } = require('../services/scrapeSchedule');
const { fetchProfessorRating } = require('../services/rmpService');
const nameKey = require('../utils/nameKey');

async function sync() {
  await connectDB();

  const semester = process.env.CURRENT_SEMESTER;
  if (!semester) throw new Error('CURRENT_SEMESTER not set in .env (e.g. "Fall 2025")');

  console.log(`Scraping schedule for ${semester}...`);
  const sections = await scrapeSchedule(semester);
  console.log(`Found ${sections.length} sections`);

  // Upsert sections
  for (const s of sections) {
    await Section.findOneAndUpdate(
      { semester, courseCode: s.courseCode, sectionNumber: s.sectionNumber },
      { ...s, semester },
      { upsert: true, new: true }
    );
  }
  console.log(`Synced ${sections.length} sections`);

  // Fetch RMP ratings for professors we haven't rated yet
  const names = [...new Set(sections.map(s => s.professor).filter(p => p && p !== 'TBA'))];
  let rated = 0;

  for (const name of names) {
    const key = nameKey(name);
    if (!key) continue;

    const existing = await Professor.findOne({ nameKey: key });
    if (existing?.rmpId) continue; // already fetched

    const rating = await fetchProfessorRating(name);
    await Professor.findOneAndUpdate(
      { nameKey: key },
      { name, nameKey: key, ...(rating || {}) },
      { upsert: true }
    );

    if (rating) rated++;
    await new Promise(r => setTimeout(r, 400)); // avoid RMP rate limiting
  }

  console.log(`Fetched RMP ratings: ${rated}/${names.length} professors matched`);
  await mongoose.disconnect();
}

sync().catch(err => { console.error(err.message); process.exit(1); });

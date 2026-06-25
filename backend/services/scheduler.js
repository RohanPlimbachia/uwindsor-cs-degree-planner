const Course = require('../models/Course');
const Section = require('../models/Section');
const Professor = require('../models/Professor');
const nameKey = require('../utils/nameKey');

// Score a course for a given student context.
// Rubric: required course (+3), at/below current year (+2), exact year match (+1),
//         professor rating scaled to 0–2 pts (requires ≥3 reviews to count).
function scoreCourse(course, professor, programYear) {
  let score = 0;
  if (course.isCore) score += 3;
  if (course.year && course.year <= programYear) score += 2;
  if (course.year && course.year === programYear) score += 1;
  if (professor?.rating != null && (professor.numRatings ?? 0) >= 3) {
    score += ((professor.rating - 1) / 4) * 2; // maps 1–5 → 0–2
  }
  return score;
}

// suggest({ programYear, courseLoad, completedCourses, semester })
// Returns: { semester, courseLoad, courses[], totalCredits, skipped[] }
async function suggest({ programYear, courseLoad, completedCourses, semester }) {
  const maxCourses = courseLoad === 'full' ? 5 : 3;
  const completed = new Set(completedCourses.map(c => c.toUpperCase()));

  const sections = await Section.find({ semester });
  if (!sections.length) {
    return {
      semester, courseLoad, courses: [], totalCredits: 0, skipped: [],
      warning: `No sections found for "${semester}". Run seedSections or syncSchedule first.`,
    };
  }

  // Batch-load professors to avoid N+1
  const profKeys = [...new Set(sections.map(s => nameKey(s.professor)).filter(Boolean))];
  const profDocs = await Professor.find({ nameKey: { $in: profKeys } });
  const profMap = Object.fromEntries(profDocs.map(p => [p.nameKey, p]));

  const offeredCodes = [...new Set(sections.map(s => s.courseCode.toUpperCase()))];
  const courses = await Course.find({ code: { $in: offeredCodes } });

  const results = [];
  const skipped = [];

  for (const course of courses) {
    const code = course.code.toUpperCase();
    if (completed.has(code)) continue;

    const unmet = course.prereqs.filter(p => !completed.has(p.toUpperCase()));
    if (unmet.length) {
      skipped.push({ code, name: course.name, reason: `Prerequisite not met: ${unmet.join(', ')}` });
      continue;
    }

    // Pick the section with the best professor score
    const courseSections = sections.filter(s => s.courseCode.toUpperCase() === code);
    let best = { section: courseSections[0], professor: null, score: -Infinity };

    for (const sec of courseSections) {
      const prof = profMap[nameKey(sec.professor)] ?? null;
      const score = scoreCourse(course, prof, programYear);
      if (score > best.score) best = { section: sec, professor: prof, score };
    }

    results.push({ course, ...best });
  }

  results.sort((a, b) => b.score - a.score);
  const selected = results.slice(0, maxCourses);

  const output = selected.map(({ course, section, professor, score }) => ({
    code: course.code,
    name: course.name,
    credits: course.credits,
    isCore: course.isCore,
    year: course.year,
    sectionNumber: section.sectionNumber,
    professor: section.professor,
    professorRating: professor?.rating ?? null,
    professorDifficulty: professor?.difficulty ?? null,
    professorWouldTakeAgain: professor?.wouldTakeAgain ?? null,
    days: section.days,
    time: section.time,
    location: section.location,
    score: Math.round(score * 10) / 10,
  }));

  return {
    semester,
    courseLoad,
    courses: output,
    totalCredits: output.reduce((s, c) => s + c.credits, 0),
    skipped,
  };
}

module.exports = { suggest };

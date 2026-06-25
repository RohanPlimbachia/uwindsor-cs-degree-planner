const cheerio = require('cheerio');

// Configure UWINDSOR_SCHEDULE_URL in .env — public course timetable search URL.
// UWindsor uses Ellucian Colleague Self-Service; adjust selectors below if needed.
// Example: https://schedule.uwindsor.ca/ or your registrar's timetable search page.
const SCHEDULE_URL = process.env.UWINDSOR_SCHEDULE_URL;

// Scrape all COMP (and MATH/STAT) sections for a given semester string.
// Returns: [{ courseCode, sectionNumber, professor, days, time, location, seatsAvailable }]
async function scrapeSchedule(semester) {
  if (!SCHEDULE_URL) throw new Error('UWINDSOR_SCHEDULE_URL not set in .env');

  const subjects = ['COMP', 'MATH', 'STAT'];
  const all = [];

  for (const subject of subjects) {
    const url = new URL(SCHEDULE_URL);
    url.searchParams.set('subject', subject);
    url.searchParams.set('term', semester);

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': 'UWindsor-Degree-Planner/1.0 (academic tool)' },
    });

    if (!res.ok) throw new Error(`Schedule fetch failed for ${subject}: ${res.status}`);

    const html = await res.text();
    all.push(...parseHTML(html, subject));
  }

  return all;
}

// Parse Colleague Self-Service table HTML.
// Adjust selectors here if UWindsor's HTML structure differs.
function parseHTML(html, subject) {
  const $ = cheerio.load(html);
  const sections = [];

  // ponytail: targets common Colleague schedule table layout — adjust row/cell selectors if needed
  $('table tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 4) return;

    const rawCode = $(cells[0]).text().trim();
    // Match patterns like "COMP-2540-01" or "COMP 2540 01"
    const match = rawCode.match(new RegExp(`(${subject}[\\s-]\\d{4})`, 'i'));
    if (!match) return;

    const code = match[1].replace('-', ' ').toUpperCase();
    const sectionNum = rawCode.split(/[\s-]/).pop();

    sections.push({
      courseCode: code,
      sectionNumber: sectionNum,
      professor: $(cells[2]).text().trim() || 'TBA',
      days: $(cells[3]).text().trim(),
      time: cells[4] ? $(cells[4]).text().trim() : '',
      location: cells[5] ? $(cells[5]).text().trim() : '',
      seatsAvailable: cells[6] ? parseInt($(cells[6]).text().trim()) || null : null,
    });
  });

  return sections;
}

module.exports = { scrapeSchedule };

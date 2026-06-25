// Normalize a professor's full name to a stable lookup key.
// "Ahmad Biniaz" → "biniaz_a", "Dr. Ziad Kobti" → "kobti_z"
module.exports = function nameKey(fullName) {
  if (!fullName || fullName.trim() === 'TBA') return null;
  const parts = fullName.replace(/^Dr\.?\s*/i, '').trim().split(/\s+/);
  const last = parts[parts.length - 1].toLowerCase();
  const first = parts[0]?.[0]?.toLowerCase() || '';
  return `${last}_${first}`;
};

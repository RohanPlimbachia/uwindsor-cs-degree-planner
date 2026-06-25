// RateMyProfessors unofficial GraphQL API.
// Set RMP_SCHOOL_ID in .env — base64 of "School-{legacyId}".
// UWindsor's RMP school ID: find it by searching ratemyprofessors.com for "University of Windsor"
// and taking the ID from the URL, then encoding: btoa("School-" + id)
const RMP_GQL = 'https://www.ratemyprofessors.com/graphql';
const AUTH = 'Basic dGVzdDp0ZXN0';
const SCHOOL_ID = process.env.RMP_SCHOOL_ID;

const QUERY = `query SearchTeacher($text: String!, $schoolID: ID!) {
  newSearch {
    teachers(query: { text: $text, schoolID: $schoolID }, first: 1) {
      edges {
        node {
          id
          firstName
          lastName
          avgRating
          avgDifficulty
          wouldTakeAgainPercent
          numRatings
        }
      }
    }
  }
}`;

// Returns { rmpId, rating, difficulty, wouldTakeAgain, numRatings } or null on failure.
async function fetchProfessorRating(professorName) {
  if (!SCHOOL_ID) {
    console.warn('RMP_SCHOOL_ID not set — skipping professor ratings');
    return null;
  }

  try {
    const res = await fetch(RMP_GQL, {
      method: 'POST',
      headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { text: professorName, schoolID: SCHOOL_ID } }),
    });

    if (!res.ok) return null;

    const { data } = await res.json();
    const node = data?.newSearch?.teachers?.edges?.[0]?.node;
    if (!node) return null;

    return {
      rmpId: node.id,
      rating: node.avgRating,
      difficulty: node.avgDifficulty,
      wouldTakeAgain: node.wouldTakeAgainPercent,
      numRatings: node.numRatings,
    };
  } catch {
    return null; // degrade gracefully if RMP is down or changes their API
  }
}

module.exports = { fetchProfessorRating };

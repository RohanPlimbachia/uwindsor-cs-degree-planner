import { useState } from 'react';

export default function Planner({ result }) {
  const [skippedOpen, setSkippedOpen] = useState(false);

  if (!result) {
    return (
      <div style={styles.boardContainer}>
        <p style={{ color: '#6b7280', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          No results yet. Go back and submit the form.
        </p>
      </div>
    );
  }

  const { suggested = [], skipped = [], remainingRequirements = {}, semester, courseLoad, totalCredits, warning } = result;
  const isFullTime = courseLoad === 'full';

  return (
    <div style={styles.boardContainer}>

      {warning && <p style={styles.warning}>{warning}</p>}

      {/* ── Suggested ── */}
      <div style={styles.column}>
        <div style={styles.columnHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={styles.columnTitle}>{semester}</h3>
            <span style={isFullTime ? styles.badgeF : styles.badgeP}>
              {isFullTime ? 'F' : 'P'}
            </span>
          </div>
          <span style={styles.creditsBadge}>{totalCredits} credits</span>
        </div>

        <div style={styles.courseList}>
          {suggested.length === 0
            ? <p style={styles.emptyNote}>No suggestions — check skipped courses below.</p>
            : suggested.map(c => (
              <div key={c.code} style={styles.card}>
                <div style={styles.cardName}>{c.name}</div>
                <div style={styles.cardDetails}>
                  <span>{c.code}</span>
                  <span>{c.days} {c.time}</span>
                </div>
                <div style={styles.cardDetails}>
                  <span style={{ color: '#374151' }}>{c.professor || '—'}</span>
                  {c.professorRating != null && (
                    <span style={ratingBadgeStyle(c.professorRating)}>
                      ★ {c.professorRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            ))
          }
        </div>

        <div style={styles.progressSection}>
          <div style={styles.progressText}>
            Credits: {totalCredits}/{isFullTime ? 15 : 9}
          </div>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${Math.min((totalCredits / (isFullTime ? 15 : 9)) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* ── Skipped ── */}
      <div style={styles.column}>
        <div style={styles.columnHeader}>
          <h3 style={styles.columnTitle}>Skipped</h3>
          <button style={styles.menuIcon} onClick={() => setSkippedOpen(o => !o)}>
            {skippedOpen ? '▲' : '▼'}
          </button>
        </div>

        {skippedOpen && (
          <div style={styles.courseList}>
            {skipped.length === 0
              ? <p style={styles.emptyNote}>None — all eligible courses were suggested.</p>
              : skipped.map(c => (
                <div key={c.code} style={{ ...styles.card, borderLeft: '3px solid #f59e0b' }}>
                  <div style={styles.cardName}>{c.name}</div>
                  <div style={styles.cardDetails}>
                    <span>{c.code}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>{c.reason}</div>
                </div>
              ))
            }
          </div>
        )}

        {!skippedOpen && (
          <p style={styles.emptyNote}>{skipped.length} course{skipped.length !== 1 ? 's' : ''} skipped — expand to see why.</p>
        )}
      </div>

      {/* ── Remaining Requirements ── */}
      <div style={styles.column}>
        <div style={styles.columnHeader}>
          <h3 style={styles.columnTitle}>Still Needed</h3>
        </div>

        <div style={styles.courseList}>
          {(remainingRequirements.core || []).length === 0 ? (
            <p style={styles.emptyNote}>All core courses complete.</p>
          ) : (
            (remainingRequirements.core || []).map(c => (
              <div key={c.code} style={{ ...styles.card, borderLeft: '3px solid #6366f1' }}>
                <div style={styles.cardName}>{c.name}</div>
                <div style={styles.cardDetails}><span>{c.code}</span></div>
              </div>
            ))
          )}
        </div>

        {remainingRequirements.electives && (
          <div style={styles.progressSection}>
            <div style={styles.progressText}>
              Electives needed: {remainingRequirements.electives.needed}
              {remainingRequirements.electives.categories?.length > 0 &&
                ` (${remainingRequirements.electives.categories.join(', ')})`
              }
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

function ratingBadgeStyle(rating) {
  const color = rating >= 4 ? '#059669' : rating >= 3 ? '#d97706' : '#dc2626';
  return { color, fontWeight: '600', fontSize: '13px' };
}

const styles = {
  boardContainer: {
    display: 'flex',
    gap: '24px',
    padding: '40px 20px',
    overflowX: 'auto',
    alignItems: 'flex-start',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    minHeight: '80vh',
    backgroundColor: '#ffffff',
    position: 'relative'
  },
  column: {
    backgroundColor: '#f9fafb',
    borderRadius: '16px',
    width: '320px',
    minWidth: '320px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  columnTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827'
  },
  badgeF: {
    backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: '700'
  },
  badgeP: {
    backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: '700'
  },
  creditsBadge: {
    fontSize: '13px', color: '#6b7280', fontWeight: '600'
  },
  menuIcon: {
    background: 'none', border: 'none', fontSize: '16px', color: '#6b7280', cursor: 'pointer'
  },
  courseList: {
    display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px'
  },
  card: {
    backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6',
  },
  cardName: {
    fontWeight: '600', fontSize: '15px', color: '#111827', marginBottom: '8px', lineHeight: '1.4'
  },
  cardDetails: {
    display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginTop: '4px'
  },
  emptyNote: {
    fontSize: '13px', color: '#9ca3af', margin: 0
  },
  progressSection: {
    marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e5e7eb'
  },
  progressText: {
    fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '8px'
  },
  progressBarBg: {
    backgroundColor: '#e5e7eb', height: '8px', borderRadius: '9999px', overflow: 'hidden'
  },
  progressBarFill: {
    backgroundColor: '#10b981', height: '100%', borderRadius: '9999px', transition: 'width 0.3s ease'
  },
  warning: {
    position: 'absolute', top: '16px', left: '20px', right: '20px',
    backgroundColor: '#fef3c7', color: '#92400e', padding: '10px 16px', borderRadius: '8px', fontSize: '14px'
  }
};

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Onboarding({ onSubmit, onLoginRequired }) {
  const { token, authFetch } = useAuth();

  const [programYear, setProgramYear] = useState('1');
  const [courseLoad, setCourseLoad] = useState('full');
  const [semester, setSemester] = useState('Fall 2025');
  const [completedCourses, setCompletedCourses] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!token) {
      onLoginRequired();
      return;
    }

    const completed = completedCourses
      .split(',')
      .map(c => c.trim().toUpperCase())
      .filter(Boolean);

    setLoading(true);
    setError('');

    try {
      const res = await authFetch('/api/schedule/suggest', {
        method: 'POST',
        body: JSON.stringify({
          programYear: parseInt(programYear, 10),
          courseLoad,
          completedCourses: completed,
          semester,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Request failed. Are you logged in?');
        return;
      }

      onSubmit(data);
    } catch {
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={styles.heading}>
          Map Out Your <span style={styles.highlight}>Academic Future</span>
        </h1>
        <p style={styles.description}>
          Take the guesswork out of graduation. This degree planner helps you visualize your entire academic journey from your first day to your final semester. Select your program details below to generate a customized, interactive roadmap that tracks your prerequisites, balances your study load, and ensures you meet all requirements to graduate on time.
        </p>
      </div>

      <div style={styles.formCard}>

        {/* Program Year */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Program Year</label>
          <select
            value={programYear}
            onChange={(e) => setProgramYear(e.target.value)}
            style={styles.selectInput}
          >
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>

        {/* Course Load */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Study Pace</label>
          <div style={styles.loadToggleContainer}>
            <button
              style={courseLoad === 'full' ? styles.activeToggle : styles.inactiveToggle}
              onClick={() => setCourseLoad('full')}
            >
              Full Time (5 Courses)
            </button>
            <button
              style={courseLoad === 'part' ? styles.activeToggle : styles.inactiveToggle}
              onClick={() => setCourseLoad('part')}
            >
              Part Time (3 Courses)
            </button>
          </div>
        </div>

        {/* Semester */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Semester</label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            style={styles.selectInput}
          />
        </div>

        {/* Completed Courses */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Completed Courses</label>
          <textarea
            value={completedCourses}
            onChange={(e) => setCompletedCourses(e.target.value)}
            placeholder="e.g. COMP 1000, COMP 1400, MATH 1720"
            rows={3}
            style={{ ...styles.selectInput, resize: 'vertical', lineHeight: '1.5' }}
          />
          <span style={styles.helperText}>Optional for new students — leave blank if you haven't completed any courses yet.</span>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

        <button style={styles.submitButton} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Loading…' : 'View Degree Map →'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '60px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#000000'
  },
  heroSection: {
    marginBottom: '48px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heading: {
    fontSize: '48px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '20px',
    letterSpacing: '-0.02em'
  },
  highlight: {
    backgroundColor: '#fde047',
    padding: '0 12px',
    borderRadius: '8px',
    display: 'inline-block'
  },
  description: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#4b5563',
    maxWidth: '650px',
    margin: '0 auto'
  },
  formCard: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb'
  },
  inputGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  selectInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    fontFamily: 'inherit',
    color: '#111827',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    appearance: 'auto'
  },
  loadToggleContainer: {
    display: 'flex',
    gap: '12px',
  },
  activeToggle: {
    flex: 1,
    backgroundColor: '#111827',
    color: '#fff',
    border: '2px solid #111827',
    borderRadius: '8px',
    padding: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  inactiveToggle: {
    flex: 1,
    backgroundColor: '#f9fafb',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  helperText: {
    display: 'block',
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '6px'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '12px'
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '16px',
    transition: 'background-color 0.2s'
  }
};

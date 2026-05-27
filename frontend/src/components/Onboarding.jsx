import { useState } from 'react';

export default function Onboarding({ onSubmit, studyLoad, setStudyLoad }) {
  const [country, setCountry] = useState('Canada');
  const [institution, setInstitution] = useState('University of Windsor');
  const [department, setDepartment] = useState('Computer Science');
  const [program, setProgram] = useState('B.Sc. Computer Science');

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
        
        {/* Country Dropdown */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Country</label>
          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            style={styles.selectInput}
          >
            <option value="Canada">Canada</option>
            <option value="United States">United States</option>
            <option value="International">International (Other)</option>
          </select>
        </div>

        {/* Institution Dropdown */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Institution</label>
          <select 
            value={institution} 
            onChange={(e) => setInstitution(e.target.value)} 
            style={styles.selectInput}
          >
            <option value="University of Windsor">University of Windsor</option>
            <option value="University of Toronto">University of Toronto</option>
            <option value="University of Waterloo">University of Waterloo</option>
            <option value="Western University">Western University</option>
          </select>
        </div>

        {/* Department Dropdown */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Department</label>
          <select 
            value={department} 
            onChange={(e) => setDepartment(e.target.value)} 
            style={styles.selectInput}
          >
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
            <option value="Science">Science</option>
            <option value="Arts, Humanities & Social Sciences">Arts, Humanities & Social Sciences</option>
          </select>
        </div>

        {/* Program Dropdown */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Program / Major</label>
          <select 
            value={program} 
            onChange={(e) => setProgram(e.target.value)} 
            style={styles.selectInput}
          >
            <option value="B.Sc. Computer Science">B.Sc. Computer Science</option>
            <option value="B.Sc. Applied Computing">B.Sc. Applied Computing</option>
            <option value="B.A. Computer Science">B.A. Computer Science</option>
            <option value="Minor in Computer Science">Minor in Computer Science</option>
          </select>
        </div>

        {/* Study Pace Toggle */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Study Pace</label>
          <div style={styles.loadToggleContainer}>
            <button 
              style={studyLoad === 'full-time' ? styles.activeToggle : styles.inactiveToggle}
              onClick={() => setStudyLoad('full-time')}
            >
              Full Time (5 Courses)
            </button>
            <button 
              style={studyLoad === 'part-time' ? styles.activeToggle : styles.inactiveToggle}
              onClick={() => setStudyLoad('part-time')}
            >
              Part Time (3 Courses)
            </button>
          </div>
        </div>

        <button style={styles.submitButton} onClick={onSubmit}>
          View Degree Map →
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
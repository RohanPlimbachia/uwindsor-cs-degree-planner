import { useState, useEffect } from 'react';

export default function Planner({ studyLoad }) {
  const isFullTime = studyLoad === 'full-time';
  const maxCreditsPerTerm = isFullTime ? 15 : 9;
  const maxCourses = isFullTime ? 5 : 3;

  // Added descriptions so the popup has data to show
  const allCourses = [
    { id: 1, name: 'Key Concepts in Computer Science', code: 'COMP-1000', credits: 3, description: 'An introduction to fundamental computer science concepts, architecture, and programming logic.' },
    { id: 2, name: 'Differential Calculus', code: 'MATH-1720', credits: 3, description: 'Limits, derivatives, applications of derivatives, and introduction to integration.' },
    { id: 3, name: 'Intro to Algorithms I', code: 'COMP-1400', credits: 3, description: 'Problem-solving using a high-level programming language.' },
    { id: 4, name: 'Linear Algebra', code: 'MATH-1250', credits: 3, description: 'Systems of linear equations, matrices, vectors, and eigenvalues.' },
    { id: 5, name: 'Intro to Web Dev', code: 'COMP-1047', credits: 3, description: 'Basic web development using HTML, CSS, and modern web standards.' },
  ];

  const [semesters, setSemesters] = useState([]);
  
  // State to track which course is currently being viewed in the popup
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    setSemesters([
      {
        id: 'fall2024',
        title: 'Fall 2024',
        maxCredits: maxCreditsPerTerm,
        courses: allCourses.slice(0, maxCourses) 
      },
      {
        id: 'winter2024',
        title: 'Winter 2024',
        maxCredits: maxCreditsPerTerm,
        courses: isFullTime ? [] : allCourses.slice(maxCourses, 5) 
      },
      {
        id: 'summer2024',
        title: 'Summer 2024',
        maxCredits: maxCreditsPerTerm,
        courses: []
      }
    ]);
  }, [studyLoad]);

  return (
    <div style={styles.boardContainer}>
      {semesters.map((semester) => {
        const currentCredits = semester.courses.reduce((sum, course) => sum + course.credits, 0);
        const progressPercent = Math.min((currentCredits / semester.maxCredits) * 100, 100);

        return (
          <div key={semester.id} style={styles.column}>
            <div style={styles.columnHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={styles.columnTitle}>{semester.title}</h3>
                <span style={isFullTime ? styles.badgeF : styles.badgeP}>
                  {isFullTime ? 'F' : 'P'}
                </span>
              </div>
              <button style={styles.menuIcon}>⋮</button>
            </div>

            <div style={styles.courseList}>
              {semester.courses.map(course => (
                <div 
                  key={course.id} 
                  style={styles.card} 
                  onClick={() => setSelectedCourse(course)} // <-- Opens the popup!
                >
                  <div style={styles.cardName}>{course.name}</div>
                  <div style={styles.cardDetails}>
                    <span>{course.code}</span>
                    <span>Credits: {course.credits}</span>
                  </div>
                </div>
              ))}
              
              <button style={styles.addCourseBtn}>
                <span style={styles.addIcon}>+</span> Add Course
              </button>
            </div>

            <div style={styles.progressSection}>
              <div style={styles.progressText}>
                Credits: {currentCredits}/{semester.maxCredits}
              </div>
              <div style={styles.progressBarBg}>
                <div style={{...styles.progressBarFill, width: `${progressPercent}%`}}></div>
              </div>
            </div>
          </div>
        );
      })}

      {/* --- COURSE INFO POPUP MODAL --- */}
      {selectedCourse && (
        <div style={styles.modalOverlay} onClick={() => setSelectedCourse(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalCode}>{selectedCourse.code}</h2>
              <button onClick={() => setSelectedCourse(null)} style={styles.closeButton}>✕</button>
            </div>
            <h3 style={styles.modalName}>{selectedCourse.name}</h3>
            
            <div style={styles.modalBody}>
              <p style={styles.modalDetail}><strong>Credits:</strong> {selectedCourse.credits}</p>
              <p style={styles.modalDetail}><strong>Description:</strong> {selectedCourse.description || "No description available."}</p>
              <p style={styles.modalDetail}><strong>Prerequisites:</strong> None</p>
            </div>

            <button style={styles.modalActionBtn} onClick={() => setSelectedCourse(null)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
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
    position: 'relative' // Needed for modal positioning
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
  menuIcon: {
    background: 'none', border: 'none', fontSize: '20px', color: '#6b7280', cursor: 'pointer'
  },
  courseList: {
    display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px'
  },
  card: {
    backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6',
    cursor: 'pointer' // Shows it is clickable
  },
  cardName: {
    fontWeight: '600', fontSize: '15px', color: '#111827', marginBottom: '8px', lineHeight: '1.4'
  },
  cardDetails: {
    display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280'
  },
  addCourseBtn: {
    backgroundColor: 'transparent', border: '2px dashed #d1d5db', borderRadius: '12px', padding: '14px', color: '#6b7280', fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
  },
  addIcon: {
    fontSize: '18px', fontWeight: '400'
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
  
  // Modal Styles
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px', marginBottom: '16px'
  },
  modalCode: {
    margin: 0, fontSize: '24px', fontWeight: '800', color: '#111827'
  },
  closeButton: {
    background: 'none', border: 'none', fontSize: '20px', color: '#9ca3af', cursor: 'pointer'
  },
  modalName: {
    margin: '0 0 24px 0', fontSize: '18px', color: '#4b5563', fontWeight: '500'
  },
  modalBody: {
    marginBottom: '32px'
  },
  modalDetail: {
    fontSize: '15px', color: '#374151', lineHeight: '1.6', marginBottom: '12px'
  },
  modalActionBtn: {
    width: '100%', backgroundColor: '#111827', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer'
  }
};
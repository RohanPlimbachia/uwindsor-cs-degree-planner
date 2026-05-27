import { useAuth } from '../context/AuthContext';

export default function Header({ view, onLoginClick, onHomeClick, onPlannerClick }) {
  const { token, logout } = useAuth();

  return (
    <header style={styles.topBar}>
      <div style={styles.leftNav}>
        <span 
          style={view === 'onboarding' ? { ...styles.navLink, ...styles.activeLink } : styles.navLink} 
          onClick={onHomeClick}
        >
          Home
        </span>
        <span 
          style={view === 'planner' ? { ...styles.navLink, ...styles.activeLink } : styles.navLink} 
          onClick={onPlannerClick}
        >
          Degree Map
        </span>
        <span style={styles.disabledLink} title="Coming Soon">
          Prof Insights
        </span>
      </div>
      
      <div style={styles.rightNav}>
        {token ? (
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        ) : (
          <button style={styles.loginBtn} onClick={onLoginClick}>Login</button>
        )}
      </div>
    </header>
  );
}

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #1f2937',
    backgroundColor: '#000000' // Black Header
  },
  leftNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px' 
  },
  rightNav: {
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    cursor: 'pointer',
    fontSize: '16px',
    color: '#9ca3af', // Gray text for inactive
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
  activeLink: {
    color: '#ffffff', // White text for active
    fontWeight: '700',
  },
  disabledLink: {
    cursor: 'default',
    fontSize: '16px',
    color: '#4b5563', // Darker gray to look disabled
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: '#ffffff', // White Button
    color: '#111827', // Black Text
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '700'
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  }
};
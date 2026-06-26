import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Onboarding from './components/Onboarding';
import Planner from './components/Planner';
import LoginModal from './components/LoginModal';

export default function App() {
  const [view, setView] = useState('onboarding');
  const [showLogin, setShowLogin] = useState(false);
  const [scheduleResult, setScheduleResult] = useState(null);

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header
          view={view}
          onLoginClick={() => setShowLogin(true)}
          onHomeClick={() => setView('onboarding')}
          onPlannerClick={() => setView('planner')}
        />

        <main style={{ flex: 1, backgroundColor: '#f9fafb' }}>
          {view === 'onboarding' ? (
            <Onboarding
              onSubmit={(result) => { setScheduleResult(result); setView('planner'); }}
              onLoginRequired={() => setShowLogin(true)}
            />
          ) : (
            <Planner result={scheduleResult} />
          )}
        </main>

        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    </AuthProvider>
  );
}

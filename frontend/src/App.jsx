import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Onboarding from './components/Onboarding';
import Planner from './components/Planner';
import LoginModal from './components/LoginModal';

export default function App() {
  const [view, setView] = useState('onboarding'); 
  const [showLogin, setShowLogin] = useState(false);
  
  // Track if the student is full-time or part-time globally
  const [studyLoad, setStudyLoad] = useState('full-time'); 

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
               onSubmit={() => setView('planner')} 
               studyLoad={studyLoad}           /* <-- Pass state down */
               setStudyLoad={setStudyLoad}     /* <-- Pass updater down */
             />
           ) : (
             <Planner studyLoad={studyLoad} /> /* <-- Pass state down */
           )}
        </main>

        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    </AuthProvider>
  );
}
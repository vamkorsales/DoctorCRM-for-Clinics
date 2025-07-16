import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import Dashboard from './components/dashboard/Dashboard';
import PatientManagement from './components/patients/PatientManagement';
import AppointmentManagement from './components/appointments/AppointmentManagement';
import DoctorManagement from './components/doctors/DoctorManagement';
import BillingManagement from './components/billing/BillingManagement';
import SettingsManagement from './components/settings/SettingsManagement';
import { CountryConfigProvider } from './context/CountryConfigContext';
import ReportsPage from './components/reports/ReportsPage';
import ErrorBoundary from './components/common/ErrorBoundary';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [route, setRoute] = useState(window.location.pathname);
  const [showSignup, setShowSignup] = useState(false);

  React.useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  React.useEffect(() => {
    console.log('[AppContent] route changed:', route, 'activeSection:', activeSection);
  }, [route, activeSection]);

  const navigate = (path: string, section?: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
    if (section) setActiveSection(section);
    console.log('[AppContent] navigate called:', path, 'section:', section);
  };

  if (!isAuthenticated) {
    if (showSignup) {
      return <SignupForm onSwitchToLogin={() => setShowSignup(false)} />;
    }
    return <LoginForm onSwitchToSignup={() => setShowSignup(true)} />;
  }

  const renderContent = () => {
    if (activeSection === 'reports' || route === '/reports') {
      console.log('[AppContent] Rendering ReportsPage in Layout');
      return <ReportsPage onSectionChange={setActiveSection} />;
    }
    switch (activeSection) {
      case 'patients':
        return <PatientManagement />;
      case 'doctors':
        return <DoctorManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'billing':
        return <BillingManagement />;
      case 'settings':
        return <SettingsManagement />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <CountryConfigProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </CountryConfigProvider>
    </AuthProvider>
  );
}

export default App;
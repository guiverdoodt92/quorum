import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { MembersList } from './components/members/MembersList';
import { MinisteringView } from './components/ministering/MinisteringView';
import { MeetingsView } from './components/meetings/MeetingsView';
import { GoalsView } from './components/goals/GoalsView';
import { PT_BR } from './constants/pt-br';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="text-gray-400">{PT_BR.common.loading}</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return PT_BR.dashboard.title;
      case 'members':
        return PT_BR.members.title;
      case 'families':
        return PT_BR.families.title;
      case 'ministering':
        return PT_BR.ministering.title;
      case 'meetings':
        return PT_BR.meetings.title;
      case 'goals':
        return PT_BR.goals.title;
      case 'reports':
        return PT_BR.reports.title;
      case 'settings':
        return PT_BR.nav.settings;
      default:
        return PT_BR.app.title;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'members':
        return <MembersList />;
      case 'families':
        return (
          <div className="text-center py-12">
            <p className="text-gray-400">Módulo de Famílias em desenvolvimento</p>
          </div>
        );
      case 'ministering':
        return <MinisteringView />;
      case 'meetings':
        return <MeetingsView />;
      case 'goals':
        return <GoalsView />;
      case 'reports':
        return (
          <div className="text-center py-12">
            <p className="text-gray-400">Módulo de Relatórios em desenvolvimento</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <p className="text-gray-400">Módulo de Configurações em desenvolvimento</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      pageTitle={getPageTitle()}
    >
      {renderPage()}
    </MainLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

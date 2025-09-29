import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Screen } from './types';
import Sidebar from './components/Sidebar';
import DashboardScreen from './screens/DashboardScreen';
import MonthlyReportScreen from './screens/MonthlyReportScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import AdvancedSearchScreen from './screens/AdvancedSearchScreen';
import ManageGroupsScreen from './screens/ManageGroupsScreen';
import GuestAccessScreen from './screens/GuestAccessScreen';
import AuthScreen from './screens/AuthScreen';
import GuestScreen from './screens/GuestScreen';
import { Menu, X } from 'lucide-react';
import Logo from './components/Logo';


const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSetScreen = (screen: Screen) => {
    setCurrentScreen(screen);
    if (window.innerWidth < 768) { // md breakpoint
      setSidebarOpen(false);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.DASHBOARD:
        return <DashboardScreen setScreen={handleSetScreen} />;
      case Screen.MONTHLY_REPORT:
        return <MonthlyReportScreen />;
      case Screen.STATISTICS:
        return <StatisticsScreen />;
      case Screen.ADVANCED_SEARCH:
        return <AdvancedSearchScreen />;
      case Screen.MANAGE_GROUPS:
        return <ManageGroupsScreen />;
      case Screen.GUEST_ACCESS:
        return <GuestAccessScreen />;
      default:
        return <DashboardScreen setScreen={handleSetScreen} />;
    }
  };

  return (
    <div className="bg-brand-blue text-brand-light min-h-screen flex font-sans" dir="rtl">
      <div className={`fixed top-0 right-0 h-full z-30 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <Sidebar currentScreen={currentScreen} setScreen={handleSetScreen} />
      </div>

      <main className="flex-grow p-4 md:p-8 md:mr-64 w-full">
         <header className="md:hidden flex justify-between items-center mb-4 p-2 bg-brand-navy rounded-lg">
            <div className="flex-1">
              <Logo />
            </div>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-white z-40">
              {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </header>
        {renderScreen()}
      </main>
    </div>
  );
};


const AppCore: React.FC = () => {
  const { currentUser, isGuestSession, loading } = useAuth();
  
  if (loading) {
    return <div className="bg-brand-navy min-h-screen flex items-center justify-center text-white">جاري التحميل...</div>
  }

  if (isGuestSession && currentUser) {
    return <GuestScreen />;
  }
  
  if (currentUser) {
    return <AppContent />;
  }

  return <AuthScreen />;
};


function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppCore />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
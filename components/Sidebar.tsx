import React from 'react';
import { Screen } from '../types';
import { LayoutDashboard, ClipboardList, BarChart3, Search, Users, Share2, LogOut, User as UserIcon } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

const navItems = [
  { screen: Screen.DASHBOARD, label: 'لوحة التحكم', icon: <LayoutDashboard /> },
  { screen: Screen.MONTHLY_REPORT, label: 'كشف الحساب', icon: <ClipboardList /> },
  { screen: Screen.STATISTICS, label: 'الإحصائيات', icon: <BarChart3 /> },
  { screen: Screen.ADVANCED_SEARCH, label: 'بحث متقدم', icon: <Search /> },
  { screen: Screen.MANAGE_GROUPS, label: 'إدارة المجموعات', icon: <Users /> },
  { screen: Screen.GUEST_ACCESS, label: 'مشاركة التقارير', icon: <Share2 /> },
];

const Sidebar: React.FC<SidebarProps> = ({ currentScreen, setScreen }) => {
  const { logout, currentUser } = useAuth();
  
  return (
    <aside className="bg-brand-navy w-64 p-6 flex flex-col h-screen text-white">
      <div className="mb-10">
        <Logo />
      </div>

      <nav className="flex-grow">
        <ul>
          {navItems.map(item => (
            <li key={item.screen} className="mb-2">
              <button
                onClick={() => setScreen(item.screen)}
                className={`w-full flex items-center gap-4 p-3 rounded-lg text-right transition-colors ${
                  currentScreen === item.screen
                    ? 'bg-brand-gold text-brand-blue font-bold'
                    : 'text-brand-secondary hover:bg-brand-blue hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-brand-secondary/20 pt-4">
        <div className="flex items-center gap-3 p-2 mb-2">
            <div className="w-10 h-10 bg-brand-gold/20 rounded-full flex items-center justify-center">
                <UserIcon className="text-brand-gold" size={22} />
            </div>
            <div>
                <span className="font-bold text-brand-light block">{currentUser?.name}</span>
                <span className="text-xs text-brand-secondary">{currentUser?.phone}</span>
            </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 p-3 rounded-lg text-brand-secondary hover:bg-red-800/50 hover:text-red-300 transition-colors"
        >
          <LogOut />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
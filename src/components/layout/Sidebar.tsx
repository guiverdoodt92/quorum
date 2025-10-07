import { PT_BR } from '../../constants/pt-br';
import {
  LayoutDashboard,
  Users,
  Home,
  UserCheck,
  Calendar,
  Trophy,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { signOut } = useAuth();

  const navItems = [
    { id: 'dashboard', label: PT_BR.nav.dashboard, icon: LayoutDashboard },
    { id: 'members', label: PT_BR.nav.members, icon: Users },
    { id: 'families', label: PT_BR.nav.families, icon: Home },
    { id: 'ministering', label: PT_BR.nav.ministering, icon: UserCheck },
    { id: 'meetings', label: PT_BR.nav.meetings, icon: Calendar },
    { id: 'goals', label: PT_BR.nav.goals, icon: Trophy },
    { id: 'reports', label: PT_BR.nav.reports, icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-dark-surface border-r border-dark-border h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-primary rounded-lg flex items-center justify-center shadow-orange-glow">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-orange-primary">Quórum de Élderes</h1>
            <p className="text-xs text-gray-400">{PT_BR.app.subtitle}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`nav-link w-full text-left ${isActive ? 'nav-link-active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-dark-border space-y-1">
        <button
          onClick={() => onPageChange('settings')}
          className={`nav-link w-full text-left ${currentPage === 'settings' ? 'nav-link-active' : ''}`}
        >
          <Settings className="w-5 h-5" />
          <span>{PT_BR.nav.settings}</span>
        </button>
        <button
          onClick={() => signOut()}
          className="nav-link w-full text-left text-red-400 hover:text-red-300"
        >
          <LogOut className="w-5 h-5" />
          <span>{PT_BR.auth.logout}</span>
        </button>
      </div>
    </aside>
  );
}

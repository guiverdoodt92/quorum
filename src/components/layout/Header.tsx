import { Bell, User } from 'lucide-react';
import { PT_BR } from '../../constants/pt-br';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-6">
      <h2 className="text-2xl font-bold text-gray-100">{title}</h2>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-dark-hover rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-primary rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-dark-border">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-200">Presidência</p>
            <p className="text-xs text-gray-400">Quórum de Élderes</p>
          </div>
          <div className="w-10 h-10 bg-orange-primary rounded-full flex items-center justify-center shadow-orange-glow">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}

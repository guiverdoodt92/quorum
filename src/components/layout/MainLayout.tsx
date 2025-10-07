import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  pageTitle: string;
}

export function MainLayout({ children, currentPage, onPageChange, pageTitle }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />

      <div className="ml-64">
        <Header title={pageTitle} />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

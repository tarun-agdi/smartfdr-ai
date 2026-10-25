import React from 'react';
import { useApp } from './context/AppContext';
import TopBanner from './components/TopBanner';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';

import DashboardView from './views/DashboardView';
import RegistryView from './views/RegistryView';
import RegisterFdrView from './views/RegisterFdrView';
import DocIntelView from './views/DocIntelView';
import QueueView from './views/QueueView';
import ReportsView from './views/ReportsView';

export default function App() {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7fa] text-[#111827]">
      {/* Top Banner */}
      <TopBanner />

      {/* Main Header with Navigation & Role Switcher */}
      <Header />

      {/* Main Content View Container */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-6">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'registry' && <RegistryView />}
        {activeView === 'register' && <RegisterFdrView />}
        {activeView === 'docintel' && <DocIntelView />}
        {activeView === 'queue' && <QueueView />}
        {activeView === 'reports' && <ReportsView />}
      </main>

      {/* Floating Flash Toast */}
      <Toast />

      {/* Footer */}
      <Footer />
    </div>
  );
}

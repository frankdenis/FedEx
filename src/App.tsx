import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { LiveChatModal } from './components/common/LiveChatModal';

import { HomePage } from './pages/HomePage';
import { TrackingPage } from './pages/TrackingPage';
import { ShipNowPage } from './pages/ShipNowPage';
import { QuoteCalculatorPage } from './pages/QuoteCalculatorPage';
import { ServicesPage } from './pages/ServicesPage';
import { LocationsPage } from './pages/LocationsPage';
import { BusinessSolutionsPage } from './pages/BusinessSolutionsPage';
import { ResourcesGuidesPage } from './pages/ResourcesGuidesPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SupportCenterPage } from './pages/SupportCenterPage';
import { AuthPages } from './pages/AuthPages';
import { FleetEquipmentPage } from './pages/FleetEquipmentPage';
import { GoogleChatPage } from './pages/GoogleChatPage';
import { GoogleDrivePage } from './pages/GoogleDrivePage';

import { MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [searchParams, setSearchParams] = useState<string>(window.location.search || '');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(window.location.search || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (pathWithQuery: string) => {
    const [path, query] = pathWithQuery.split('?');
    window.history.pushState({}, '', pathWithQuery);
    setCurrentPath(path || '/');
    setSearchParams(query ? `?${query}` : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse query params (e.g. for /track?q=NX839204715)
  const getQueryParam = (name: string) => {
    const params = new URLSearchParams(searchParams);
    return params.get(name) || '';
  };

  // Route Dispatcher
  const renderCurrentPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/track')) {
      const q = getQueryParam('q');
      return <TrackingPage initialQuery={q} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/equipment') || currentPath.startsWith('/fleet')) {
      return <FleetEquipmentPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/ship')) {
      return <ShipNowPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/quote')) {
      return <QuoteCalculatorPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/services')) {
      const slugMatch = currentPath.split('/services/')[1];
      return <ServicesPage initialSlug={slugMatch} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/locations')) {
      return <LocationsPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/business')) {
      return <BusinessSolutionsPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/resources')) {
      return <ResourcesGuidesPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/dashboard')) {
      return <CustomerDashboardPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/admin')) {
      return <AdminDashboardPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/chat') || currentPath.startsWith('/dispatch-chat')) {
      return <GoogleChatPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/drive') || currentPath.startsWith('/documents')) {
      return <GoogleDrivePage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/support')) {
      return <SupportCenterPage onNavigate={navigate} onOpenChat={() => setIsChatOpen(true)} />;
    }

    if (currentPath.startsWith('/login')) {
      return <AuthPages mode="login" onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/register')) {
      return <AuthPages mode="register" onNavigate={navigate} />;
    }

    // Default 404 Fallback
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900">404 - Page Not Found</h1>
        <p className="text-slate-600 text-sm">
          The logistics portal address you requested could not be located in our routing registry.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-[#4D148C] hover:bg-purple-900 text-white font-bold text-xs transition-colors"
        >
          Return to Hub Homepage
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#FF6600] selection:text-white">
      {/* Sticky Main Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Comprehensive Footer with Mandatory Disclaimer */}
      <Footer onNavigate={navigate} />

      {/* Global Search Dialog (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />

      {/* Live AI Customer Support Chatbot */}
      <LiveChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onNavigate={navigate}
      />

      {/* Floating Bottom-Right Chat Launcher Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-[#1F0838] via-[#4D148C] to-[#1F0838] text-white shadow-2xl border border-purple-400/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group cursor-pointer"
          title="Open FedEx Virtual Dispatch Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-[#FF6600] group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF6600] animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-tight">Virtual Dispatch</span>
        </button>
      )}
    </div>
  );
}

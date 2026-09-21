import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import {
  Search,
  User,
  Menu,
  X,
  Bell,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  HardDrive,
} from 'lucide-react';
import {
  getCurrentUser,
  setCurrentUser,
  getNotifications,
  markAllNotificationsAsRead,
  getUsers,
} from '../../lib/store';
import { User as UserType } from '../../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  onOpenChat,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [currentUser, setLocalCurrentUser] = useState<UserType | null>(getCurrentUser());
  const [notifications, setLocalNotifications] = useState(getNotifications());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleStorageUpdate = () => {
      setLocalCurrentUser(getCurrentUser());
      setLocalNotifications(getNotifications());
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('nexora-storage-update', handleStorageUpdate);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('nexora-storage-update', handleStorageUpdate);
    };
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Fleet & Equipment', path: '/equipment' },
    { name: 'Ship', path: '/ship' },
    { name: 'Track', path: '/track' },
    { name: 'Services', path: '/services' },
    { name: 'Locations', path: '/locations' },
    { name: 'Enterprise', path: '/business' },
    { name: 'Google Chat', path: '/chat' },
    { name: 'Google Drive', path: '/drive' },
    { name: 'Resources', path: '/resources' },
    { name: 'Support', path: '/support' },
  ];

  const handleSwitchUser = (role: 'customer' | 'admin') => {
    const allUsers = getUsers();
    const target = allUsers.find(u => u.role === role) || allUsers[0];
    setCurrentUser(target);
    setUserDropdownOpen(false);
    if (role === 'admin') {
      onNavigate('/admin');
    } else {
      onNavigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserDropdownOpen(false);
    onNavigate('/login');
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 text-white backdrop-blur-md shadow-lg shadow-black/10 border-b border-slate-800'
          : 'bg-slate-950 text-white border-b border-slate-800/80'
      }`}
    >
      {/* Top micro banner for Real-Time Fleet Network Status & Portal Switcher */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF6600]/15 text-[#FF6600] font-semibold border border-[#FF6600]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] animate-pulse" />
            GLOBAL FLEET ACTIVE
          </span>
          <span className="hidden sm:inline text-slate-300 font-medium">
            FedEx Global Air & Intermodal Operations Network
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick role test switcher */}
          <span className="hidden md:inline text-slate-400">Live Portal:</span>
          <button
            onClick={() => handleSwitchUser('customer')}
            className={`hover:text-[#FF6600] font-medium transition-colors ${
              currentUser?.role === 'customer' ? 'text-[#FF6600] font-bold underline' : ''
            }`}
          >
            Customer View
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => handleSwitchUser('admin')}
            className={`hover:text-amber-300 font-medium transition-colors flex items-center gap-1 ${
              currentUser?.role === 'admin' ? 'text-amber-400 font-bold underline' : ''
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-[#FF6600]" />
            Dispatch Command Center
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => onNavigate('/')}
            className="cursor-pointer transition-transform hover:opacity-95"
          >
            <Logo light size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map(link => {
              const isActive =
                currentPath === link.path ||
                (link.path !== '/' && currentPath.startsWith(link.path));

              return (
                <button
                  key={link.name}
                  onClick={() => onNavigate(link.path)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-cyan-400 bg-white/5 shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button (Cmd+K) */}
            <button
              onClick={onOpenSearch}
              title="Search tracking, services, locations (Cmd+K)"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 border border-slate-800"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline text-xs text-slate-400">Search...</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-800 rounded">
                ⌘K
              </kbd>
            </button>

            {/* AI Assistant Chat Trigger */}
            <button
              onClick={onOpenChat}
              title="FedEx Virtual Dispatch Assistant"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-cyan-300 hover:bg-cyan-500/10 transition-colors flex items-center gap-1.5 border border-cyan-500/30"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline text-xs font-medium">Assistant</span>
            </button>

            {/* Google Chat Workspace Dispatch Button */}
            <button
              onClick={() => onNavigate('/chat')}
              title="Google Chat Logistics Dispatch"
              className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-colors flex items-center gap-1.5 border ${
                currentPath.startsWith('/chat')
                  ? 'bg-[#4D148C] text-white border-purple-400/60 shadow-lg shadow-purple-950/50'
                  : 'text-white bg-[#FF6600]/15 hover:bg-[#FF6600]/25 border-[#FF6600]/40'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#FF6600]" />
              <span className="hidden md:inline text-xs font-bold">Chat</span>
            </button>

            {/* Google Drive Logistics Cloud Archive Button */}
            <button
              onClick={() => onNavigate('/drive')}
              title="Google Drive Shipping Documents & Air Waybills"
              className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-colors flex items-center gap-1.5 border ${
                currentPath.startsWith('/drive')
                  ? 'bg-[#4D148C] text-white border-purple-400/60 shadow-lg shadow-purple-950/50'
                  : 'text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border-slate-700'
              }`}
            >
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline text-xs font-bold">Drive</span>
            </button>

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-cyan-400" />
                      Live Shipment Alerts
                    </span>
                    <button
                      onClick={() => {
                        markAllNotificationsAsRead();
                        setLocalNotifications(getNotifications());
                      }}
                      className="text-[10px] text-cyan-300 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1">
                    {notifications.slice(0, 5).map(notif => (
                      <div
                        key={notif.id}
                        className={`p-3 text-xs hover:bg-slate-50 transition-colors rounded-xl cursor-pointer ${
                          !notif.read ? 'bg-cyan-50/50 font-medium' : ''
                        }`}
                        onClick={() => {
                          if (notif.trackingNumber) {
                            onNavigate(`/track?q=${notif.trackingNumber}`);
                            setNotifDropdownOpen(false);
                          }
                        }}
                      >
                        <div className="font-semibold text-slate-900 flex items-center justify-between">
                          <span>{notif.title}</span>
                          <span className="text-[9px] text-slate-400">{notif.timestamp.split('—')[0]}</span>
                        </div>
                        <p className="text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        onNavigate('/dashboard/notifications');
                      }}
                      className="text-xs font-semibold text-cyan-700 hover:text-cyan-800"
                    >
                      View All in Dashboard →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Sign In / Dashboard */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.firstName[0]}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-slate-200">
                    {currentUser.firstName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                      <div className="font-semibold text-sm">
                        {currentUser.firstName} {currentUser.lastName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <span className="mt-1 inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-semibold uppercase">
                        {currentUser.role}
                      </span>
                    </div>

                    <div className="p-1 text-xs">
                      {currentUser.role === 'admin' ? (
                        <>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onNavigate('/admin');
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 font-medium text-slate-800 flex items-center gap-2"
                          >
                            <ShieldCheck className="w-4 h-4 text-cyan-600" />
                            Admin Console
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onNavigate('/admin/shipments');
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700"
                          >
                            Manage Shipments
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onNavigate('/dashboard');
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 font-medium text-slate-800 flex items-center gap-2"
                          >
                            <User className="w-4 h-4 text-cyan-600" />
                            Customer Dashboard
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onNavigate('/dashboard/shipments');
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700"
                          >
                            My Shipments
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onNavigate('/dashboard/addresses');
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700"
                          >
                            Address Book
                          </button>
                        </>
                      )}
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('/login')}
                  className="text-xs font-semibold px-3 py-2 rounded-xl text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('/ship')}
                  className="text-xs font-bold px-4 py-2 rounded-xl bg-[#FF6600] hover:bg-[#E55C00] text-white transition-all shadow-md shadow-[#FF6600]/25 font-display"
                >
                  Ship Now
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => (
              <button
                key={link.name}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(link.path);
                }}
                className={`text-left p-3 rounded-xl text-sm font-medium transition-all ${
                  currentPath === link.path
                    ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/quote');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700"
            >
              Get a Shipping Quote
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(currentUser ? (currentUser.role === 'admin' ? '/admin' : '/dashboard') : '/login');
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-bold hover:bg-cyan-500"
            >
              {currentUser ? 'Access Portal' : 'Customer Portal'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

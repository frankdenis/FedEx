import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Plus,
  RefreshCw,
  LogOut,
  Sparkles,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Users,
  Shield,
  Plane,
  Truck,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  listChatSpaces,
  listChatMessages,
  sendChatMessage,
  createChatSpace,
  getAccessToken,
} from '../lib/googleChat';
import { GoogleChatMessage, GoogleChatSpace } from '../types';

interface GoogleChatPageProps {
  onNavigate: (path: string) => void;
}

export const GoogleChatPage: React.FC<GoogleChatPageProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Spaces & Messages state
  const [spaces, setSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<GoogleChatSpace | null>(null);
  const [messages, setMessages] = useState<GoogleChatMessage[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);

  // Message composer
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Confirmation modal state (MANDATORY for Workspace destructive/mutating ops)
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    type: 'send_message' | 'create_space';
    payload: any;
    title: string;
    description: string;
  } | null>(null);

  // Create Space Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDesc, setNewSpaceDesc] = useState('');
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser, accessToken) => {
        setUser(authenticatedUser);
        setToken(accessToken);
        setIsAuthLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch spaces once authenticated
  useEffect(() => {
    if (token) {
      loadSpaces();
    }
  }, [token]);

  // Load messages when selected space changes
  useEffect(() => {
    if (selectedSpace && token) {
      loadMessages(selectedSpace.name);
    } else {
      setMessages([]);
    }
  }, [selectedSpace, token]);

  const loadSpaces = async () => {
    setIsLoadingSpaces(true);
    setMessageError(null);
    try {
      const fetchedSpaces = await listChatSpaces();
      setSpaces(fetchedSpaces);
      if (fetchedSpaces.length > 0 && !selectedSpace) {
        setSelectedSpace(fetchedSpaces[0]);
      }
    } catch (err: any) {
      console.error('Failed to list spaces:', err);
      setMessageError(err.message || 'Unable to retrieve Google Chat spaces.');
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const loadMessages = async (spaceName: string) => {
    setIsLoadingMessages(true);
    setMessageError(null);
    try {
      const fetchedMessages = await listChatMessages(spaceName);
      setMessages(fetchedMessages);
    } catch (err: any) {
      console.error('Failed to list messages:', err);
      setMessageError(err.message || 'Unable to load messages from this space.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setAuthError(err.message || 'Failed to authenticate with Google Chat.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    setSpaces([]);
    setSelectedSpace(null);
    setMessages([]);
  };

  // Trigger confirmation dialog for sending a message
  const requestSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? messageText).trim();
    if (!text) return;
    if (!selectedSpace) {
      setMessageError('Please select a Google Chat space to send this message to.');
      return;
    }

    setPendingConfirmation({
      type: 'send_message',
      payload: {
        spaceName: selectedSpace.name,
        spaceDisplayName: selectedSpace.displayName || selectedSpace.name,
        text,
      },
      title: `Send Message to ${selectedSpace.displayName || 'Google Chat Space'}`,
      description: `You are about to post this dispatch communication to your organization's Google Chat channel on behalf of ${(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email) || user?.email || 'your account'}.`,
    });
  };

  // Trigger confirmation dialog for creating a space
  const requestCreateSpace = () => {
    const trimmed = newSpaceName.trim();
    if (!trimmed) return;

    setPendingConfirmation({
      type: 'create_space',
      payload: {
        displayName: trimmed,
        description: newSpaceDesc.trim(),
      },
      title: `Create New Google Chat Space: "${trimmed}"`,
      description:
        'This will create a new shared Google Chat Space in your Google Workspace domain. Space members will be able to join and read real-time logistics dispatches.',
    });
  };

  // Execute confirmed operation
  const handleConfirmAction = async () => {
    if (!pendingConfirmation) return;

    if (pendingConfirmation.type === 'send_message') {
      const { spaceName, text } = pendingConfirmation.payload;
      setIsSending(true);
      setPendingConfirmation(null);
      try {
        await sendChatMessage(spaceName, text);
        setMessageText('');
        // Reload messages to show the newly posted message
        await loadMessages(spaceName);
      } catch (err: any) {
        setMessageError(`Failed to deliver message: ${err.message}`);
      } finally {
        setIsSending(false);
      }
    } else if (pendingConfirmation.type === 'create_space') {
      const { displayName, description } = pendingConfirmation.payload;
      setIsCreatingSpace(true);
      setPendingConfirmation(null);
      try {
        const created = await createChatSpace(displayName, description);
        setIsCreateModalOpen(false);
        setNewSpaceName('');
        setNewSpaceDesc('');
        // Reload spaces and select the new one
        await loadSpaces();
        setSelectedSpace(created);
      } catch (err: any) {
        setMessageError(`Failed to create space: ${err.message}`);
      } finally {
        setIsCreatingSpace(false);
      }
    }
  };

  // Quick dispatch templates
  const applyTemplate = (templateType: 'airway_bill' | 'flight_ops' | 'customs_hold' | 'ramp_ops') => {
    let content = '';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    switch (templateType) {
      case 'airway_bill':
        content = `📦 [FEDEX DISPATCH ALERT] Airway Bill #NX-839204715 departed Memphis World SuperHub (MEM) on Flight FX-777. Estimated arrival Paris Charles de Gaulle (CDG) at 14:30 CET. Temperature-monitored cold chain integrity intact.`;
        break;
      case 'flight_ops':
        content = `✈️ [AIR FLEET DISPATCH] Heavy Cargo Boeing 777F (Tail: N884FD) cleared for pushback at Memphis SuperHub Gate 42. Cargo load: 102,400 kg. Next waypoint: Gander Oceanic.`;
        break;
      case 'customs_hold':
        content = `🚨 [CUSTOMS CLEARANCE UPDATE] Consignment #NX-948201736 cleared German Federal Customs Inspection (Zollamt Frankfurt). Cleared for immediate line-haul express dispatch.`;
        break;
      case 'ramp_ops':
        content = `🚜 [SUPERHUB RAMP TELEMETRY] FMC Commander 30i Main-Deck loader assigned to Ramp 14. Turnaround cycle: 38 minutes. Ground handling priority level: Alpha.`;
        break;
    }
    setMessageText(content);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Breadcrumb & Status Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4D148C] flex items-center justify-center text-[#FF6600] font-black shadow-md shadow-purple-950/50">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-white">Google Chat Logistics Dispatch</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/40">
                Workspace v1
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Enterprise messaging bridge with live FedEx SuperHub and Air Fleet channels
            </p>
          </div>
        </div>

        {/* Auth Status / Button */}
        <div className="flex items-center gap-3">
          {token && user ? (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  className="w-6 h-6 rounded-full ring-1 ring-[#FF6600]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#4D148C] text-white flex items-center justify-center font-bold text-[10px]">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="font-semibold text-white leading-tight">{user.displayName || 'Google User'}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                title="Disconnect Google Chat"
                className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Back to Portal
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {!token ? (
        /* Sign In State */
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#4D148C]/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#FF6600]/20 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#4D148C] flex items-center justify-center text-white shadow-xl shadow-purple-950/60 border border-purple-500/30">
                <MessageSquare className="w-8 h-8 text-[#FF6600]" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Connect Google Chat</h2>
                <p className="text-sm text-slate-400 mt-2">
                  Link your corporate Google Workspace account to review dispatch channels, broadcast urgent flight telemetry, and collaborate with station managers.
                </p>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-4 text-left border border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-slate-200 font-semibold">
                  <Shield className="w-4 h-4 text-[#FF6600]" />
                  <span>Authorized Capabilities:</span>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-slate-400">
                  <li>Browse and access your company's Google Chat spaces</li>
                  <li>Broadcast airway bill & cargo dispatch alerts with user confirmation</li>
                  <li>Create new fleet operation rooms for rapid response teams</li>
                </ul>
              </div>

              {authError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs text-left flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Official Google Sign In Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleSignIn}
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  <span>{isLoggingIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Workspace Chat Interface */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: Spaces list */}
          <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#FF6600] animate-pulse" />
                <h2 className="font-bold text-sm text-white">Dispatch Spaces</h2>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={loadSpaces}
                  disabled={isLoadingSpaces}
                  title="Refresh Spaces"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSpaces ? 'animate-spin text-[#FF6600]' : ''}`} />
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  title="Create New Dispatch Space"
                  className="p-1.5 rounded-lg bg-[#4D148C] hover:bg-purple-800 text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Spaces list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {isLoadingSpaces && spaces.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin text-[#FF6600]" />
                  Loading Google Chat spaces...
                </div>
              ) : spaces.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 space-y-3">
                  <p>No active Google Chat spaces found in your account.</p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#4D148C] hover:bg-purple-800 text-white text-xs font-bold transition-colors"
                  >
                    + Create First Space
                  </button>
                </div>
              ) : (
                spaces.map((space) => {
                  const isSelected = selectedSpace?.name === space.name;
                  return (
                    <button
                      key={space.name}
                      onClick={() => setSelectedSpace(space)}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#4D148C]/40 border border-[#FF6600]/40 text-white'
                          : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                          isSelected ? 'bg-[#FF6600] text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs truncate">
                            {space.displayName || 'Direct Message'}
                          </p>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                            {space.spaceType || 'Space'}
                          </span>
                        </div>
                        {space.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {space.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Quick Presets Drawer at bottom of sidebar */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/60">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#FF6600]" />
                Logistics Dispatch Presets
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => applyTemplate('airway_bill')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-left text-slate-300 hover:text-white transition-colors"
                >
                  📦 Airway Bill
                </button>
                <button
                  onClick={() => applyTemplate('flight_ops')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-left text-slate-300 hover:text-white transition-colors"
                >
                  ✈️ Air Fleet
                </button>
                <button
                  onClick={() => applyTemplate('customs_hold')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-left text-slate-300 hover:text-white transition-colors"
                >
                  🚨 Customs
                </button>
                <button
                  onClick={() => applyTemplate('ramp_ops')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-left text-slate-300 hover:text-white transition-colors"
                >
                  🚜 Ramp GSE
                </button>
              </div>
            </div>
          </div>

          {/* Right Main Panel: Active Space Conversation */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {selectedSpace ? (
              <>
                {/* Space Header */}
                <div className="p-4 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4D148C] to-purple-900 flex items-center justify-center text-white font-black shadow-md">
                      <Users className="w-5 h-5 text-[#FF6600]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-extrabold text-sm sm:text-base text-white">
                          {selectedSpace.displayName || 'Unnamed Space'}
                        </h2>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active Channel
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400">
                        {selectedSpace.name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => loadMessages(selectedSpace.name)}
                    disabled={isLoadingMessages}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin text-[#FF6600]' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>

                {/* Messages stream */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {messageError && (
                    <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{messageError}</span>
                    </div>
                  )}

                  {isLoadingMessages && messages.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-[#FF6600]" />
                      Synchronizing Google Chat stream...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 space-y-2">
                      <MessageSquare className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                      <p className="font-semibold text-sm text-slate-300">No messages in this space yet.</p>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Be the first to transmit a freight update or ground crew status report into this space.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isCurrentUser =
                        user?.email &&
                        msg.sender?.displayName &&
                        (msg.sender.displayName === user.displayName ||
                          msg.sender.displayName === user.email);

                      return (
                        <div
                          key={msg.name}
                          className={`flex items-start gap-3 ${
                            isCurrentUser ? 'flex-row-reverse' : ''
                          }`}
                        >
                          {msg.sender?.avatarUrl ? (
                            <img
                              src={msg.sender.avatarUrl}
                              alt={msg.sender.displayName || 'Sender'}
                              className="w-8 h-8 rounded-xl object-cover shrink-0 ring-1 ring-slate-700"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                              {msg.sender?.displayName?.charAt(0) || 'U'}
                            </div>
                          )}

                          <div
                            className={`max-w-xl space-y-1 ${
                              isCurrentUser ? 'items-end text-right' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span className="font-semibold text-slate-200">
                                {msg.sender?.displayName || 'User'}
                              </span>
                              {msg.createTime && (
                                <span className="text-[10px] text-slate-500">
                                  {new Date(msg.createTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              )}
                            </div>

                            <div
                              className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                isCurrentUser
                                  ? 'bg-[#4D148C] text-white rounded-tr-none'
                                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.text || '(Attachment or empty message)'}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input with confirmation action */}
                <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
                  <div className="flex items-end gap-2 bg-slate-950 rounded-2xl border border-slate-800 p-2 focus-within:border-[#FF6600]/60 transition-colors">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          requestSendMessage();
                        }
                      }}
                      placeholder={`Transmit update to ${selectedSpace.displayName || 'Google Chat space'}... (Enter to review & send)`}
                      className="flex-1 bg-transparent resize-none border-0 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none p-2 min-h-[52px] max-h-32"
                    />
                    <button
                      onClick={() => requestSendMessage()}
                      disabled={isSending || !messageText.trim()}
                      className="px-4 py-2.5 rounded-xl bg-[#FF6600] hover:bg-[#e05a00] text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 text-center sm:text-left flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-[#FF6600]" />
                    All outbound communications require explicit user verification prior to broadcast.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500">
                <div>
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-700" />
                  <p className="font-semibold text-slate-400">Select a Google Chat Space to begin</p>
                  <p className="text-xs mt-1">Choose a channel from the left sidebar or create a new room.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MANDATORY Confirmation Modal for Destructive/Mutating Workspace Operations */}
      {pendingConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6600]/20 text-[#FF6600] flex items-center justify-center border border-[#FF6600]/40 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {pendingConfirmation.title}
                </h3>
                <p className="text-xs text-slate-400">Explicit User Verification Required</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {pendingConfirmation.description}
            </p>

            {pendingConfirmation.type === 'send_message' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {pendingConfirmation.payload.text}
              </div>
            )}

            {pendingConfirmation.type === 'create_space' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-1">
                <p className="text-slate-400">Channel Name: <span className="text-white font-bold">{pendingConfirmation.payload.displayName}</span></p>
                {pendingConfirmation.payload.description && (
                  <p className="text-slate-400">Description: <span className="text-slate-200">{pendingConfirmation.payload.description}</span></p>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPendingConfirmation(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isSending || isCreatingSpace}
                className="px-5 py-2 rounded-xl bg-[#4D148C] hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-950/50"
              >
                <CheckCircle2 className="w-4 h-4 text-[#FF6600]" />
                <span>Confirm & Proceed</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Space Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#4D148C] text-white flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4 text-[#FF6600]" />
                </div>
                <h3 className="text-base font-bold text-white">Create Dispatch Space</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Space Display Name *
                </label>
                <input
                  type="text"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="e.g. FedEx MEM SuperHub Ramp Ops"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newSpaceDesc}
                  onChange={(e) => setNewSpaceDesc(e.target.value)}
                  placeholder="e.g. Real-time ramp team coordination for widebody freighter arrivals."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6600] h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={requestCreateSpace}
                disabled={!newSpaceName.trim()}
                className="px-5 py-2 rounded-xl bg-[#FF6600] hover:bg-[#e05a00] text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                Continue to Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

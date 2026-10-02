import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  Search,
  Plus,
  RefreshCw,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  HardDrive,
  Shield,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
} from '../lib/googleChat';
import {
  listDriveFiles,
  createDriveFolder,
  uploadFileToDrive,
  deleteDriveFile,
  generateFedExAWBText,
} from '../lib/googleDrive';
import { getShipments } from '../lib/store';
import { GoogleDriveFile, Shipment } from '../types';

interface GoogleDrivePageProps {
  onNavigate: (path: string) => void;
}

export const GoogleDrivePage: React.FC<GoogleDrivePageProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive state
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [folderPath, setFolderPath] = useState<{ id?: string; name: string }[]>([
    { name: 'My Drive' },
  ]);

  // Active shipments for quick AWB export
  const [shipments] = useState<Shipment[]>(getShipments());
  const [selectedShipmentForAWB, setSelectedShipmentForAWB] = useState<string>(
    shipments[0]?.trackingNumber || ''
  );

  // Mandatory confirmation modal state
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    type: 'delete_file' | 'create_awb' | 'create_folder';
    payload: any;
    title: string;
    description: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  // New folder modal
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Upload local custom file modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileContent, setUploadFileContent] = useState('');

  // Initialize Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser, accessToken) => {
        setUser(authenticatedUser);
        setToken(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files when authenticated or folder changes
  useEffect(() => {
    if (token) {
      loadFiles();
    }
  }, [token, currentFolderId]);

  const loadFiles = async () => {
    setIsLoadingFiles(true);
    setDriveError(null);
    try {
      const fetchedFiles = await listDriveFiles({
        folderId: currentFolderId,
        query: searchQuery,
      });
      setFiles(fetchedFiles);
    } catch (err: any) {
      console.error('Drive fetch error:', err);
      setDriveError(err.message || 'Failed to load files from Google Drive.');
    } finally {
      setIsLoadingFiles(false);
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
      setAuthError(err.message || 'Failed to sign in with Google Drive.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    setFiles([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFiles();
  };

  // Trigger export of official FedEx Air Waybill to Drive
  const requestExportAWB = () => {
    const shipment = shipments.find((s) => s.trackingNumber === selectedShipmentForAWB);
    if (!shipment) return;

    const fileName = `FedEx_AWB_${shipment.trackingNumber}.txt`;
    const content = generateFedExAWBText(shipment);

    setPendingConfirmation({
      type: 'create_awb',
      payload: { fileName, content, parentFolderId: currentFolderId },
      title: `Export Air Waybill ${shipment.trackingNumber} to Google Drive`,
      description: `This will generate an official FedEx Commercial Cargo Manifest & Air Waybill document and upload it to your Google Drive (${folderPath[folderPath.length - 1].name}).`,
    });
  };

  // Trigger creation of folder
  const requestCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;

    setPendingConfirmation({
      type: 'create_folder',
      payload: { folderName: trimmed, parentFolderId: currentFolderId },
      title: `Create Google Drive Folder: "${trimmed}"`,
      description: `A new directory will be created inside "${folderPath[folderPath.length - 1].name}" on your Google Drive.`,
    });
  };

  // Trigger file deletion with mandatory confirmation
  const requestDeleteFile = (file: GoogleDriveFile) => {
    setPendingConfirmation({
      type: 'delete_file',
      payload: { fileId: file.id, fileName: file.name },
      title: `Delete "${file.name}" from Google Drive?`,
      description: `Are you sure you want to permanently delete this document from Google Drive? This action cannot be undone.`,
    });
  };

  // Execute confirmed operation
  const handleConfirmAction = async () => {
    if (!pendingConfirmation) return;
    setIsProcessing(true);

    try {
      if (pendingConfirmation.type === 'create_awb') {
        const { fileName, content, parentFolderId } = pendingConfirmation.payload;
        await uploadFileToDrive({
          fileName,
          content,
          mimeType: 'text/plain',
          parentFolderId,
        });
        setPendingConfirmation(null);
        await loadFiles();
      } else if (pendingConfirmation.type === 'create_folder') {
        const { folderName, parentFolderId } = pendingConfirmation.payload;
        await createDriveFolder(folderName, parentFolderId);
        setIsFolderModalOpen(false);
        setNewFolderName('');
        setPendingConfirmation(null);
        await loadFiles();
      } else if (pendingConfirmation.type === 'delete_file') {
        const { fileId } = pendingConfirmation.payload;
        await deleteDriveFile(fileId);
        setPendingConfirmation(null);
        await loadFiles();
      }
    } catch (err: any) {
      setDriveError(err.message || 'Operation failed.');
      setPendingConfirmation(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Open folder
  const handleOpenFolder = (folder: GoogleDriveFile) => {
    setCurrentFolderId(folder.id);
    setFolderPath([...folderPath, { id: folder.id, name: folder.name }]);
  };

  // Navigate breadcrumb
  const handleNavigateBreadcrumb = (index: number) => {
    const target = folderPath[index];
    setFolderPath(folderPath.slice(0, index + 1));
    setCurrentFolderId(target.id);
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '—';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '—';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-amber-400" />;
    }
    if (mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-rose-500" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv') || mimeType.includes('excel')) {
      return <FileCheck className="w-5 h-5 text-emerald-500" />;
    }
    if (mimeType.includes('document') || mimeType.includes('word')) {
      return <FileText className="w-5 h-5 text-blue-500" />;
    }
    return <FileCode className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4D148C] flex items-center justify-center text-[#FF6600] font-black shadow-md">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-white">
                FedEx Cargo Documents & Google Drive
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/40">
                Workspace Drive v3
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cloud storage repository for Air Waybills, customs declarations, and commercial manifests
            </p>
          </div>
        </div>

        {/* User Auth Section */}
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
                title="Disconnect Google Drive"
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

      {/* Main Content */}
      {!token ? (
        /* Sign-in required view */
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#4D148C]/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#FF6600]/20 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#4D148C] flex items-center justify-center text-white shadow-xl shadow-purple-950/60 border border-purple-500/30">
                <HardDrive className="w-8 h-8 text-[#FF6600]" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Connect Google Drive</h2>
                <p className="text-sm text-slate-400 mt-2">
                  Link your Google Drive account to archive international Air Waybills, export customs clearance documents, and manage shipment documentation securely.
                </p>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-4 text-left border border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-slate-200 font-semibold">
                  <Shield className="w-4 h-4 text-[#FF6600]" />
                  <span>Authorized Capabilities:</span>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-slate-400">
                  <li>Browse and organize your logistics shipping folders in Google Drive</li>
                  <li>Export and upload official FedEx Air Waybill manifests with 1-click</li>
                  <li>Manage and preview customs forms with user verification checks</li>
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
                  <span>{isLoggingIn ? 'Connecting to Google Drive...' : 'Sign in with Google'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Drive Explorer */
        <div className="flex-1 flex flex-col p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Top Action Card: Quick Air Waybill Export & Folder Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Quick AWB Exporter */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF6600] uppercase tracking-wider">
                  <FileCheck className="w-4 h-4" />
                  <span>Instant FedEx Air Waybill Cloud Archive</span>
                </div>
                <p className="text-xs text-slate-400">
                  Select an active consignment to generate its official International Air Waybill manifest and save it directly to Google Drive.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <select
                    value={selectedShipmentForAWB}
                    onChange={(e) => setSelectedShipmentForAWB(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6600]"
                  >
                    {shipments.map((s) => (
                      <option key={s.id} value={s.trackingNumber || ""}>
                        {s.trackingNumber || "Tracking pending"} — {s.recipient.city}, {s.recipient.country} ({s.status})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={requestExportAWB}
                    className="px-4 py-2 rounded-xl bg-[#4D148C] hover:bg-purple-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-purple-950/50"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#FF6600]" />
                    Export AWB to Drive
                  </button>
                </div>
              </div>

              {/* Action Buttons: New Folder, Upload */}
              <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                <button
                  onClick={() => setIsFolderModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF6600]" />
                  New Folder
                </button>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  Upload Document
                </button>
                <button
                  onClick={loadFiles}
                  disabled={isLoadingFiles}
                  title="Refresh Files"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin text-[#FF6600]' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Search and Breadcrumbs Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            {/* Breadcrumb Path */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300 overflow-x-auto py-1">
              <HardDrive className="w-4 h-4 text-[#FF6600] shrink-0" />
              {folderPath.map((folder, index) => (
                <React.Fragment key={folder.id || 'root'}>
                  {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                  <button
                    onClick={() => handleNavigateBreadcrumb(index)}
                    className={`hover:text-white transition-colors truncate max-w-[150px] ${
                      index === folderPath.length - 1 ? 'font-bold text-white' : 'text-slate-400'
                    }`}
                  >
                    {folder.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Search within Drive */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search file name..."
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6600] w-48 sm:w-60"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold"
              >
                Search
              </button>
            </form>
          </div>

          {/* Error notification */}
          {driveError && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{driveError}</span>
            </div>
          )}

          {/* Files List Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Documents & Files</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {files.length} items
                </span>
              </h3>
            </div>

            {isLoadingFiles ? (
              <div className="p-12 text-center text-xs text-slate-500">
                <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-[#FF6600]" />
                Accessing Google Drive storage...
              </div>
            ) : files.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <Folder className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p className="font-semibold text-sm text-slate-300">No documents in this folder</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Export a consignment Air Waybill or upload shipping records to get started.
                </p>
                <button
                  onClick={requestExportAWB}
                  className="px-4 py-2 rounded-xl bg-[#4D148C] hover:bg-purple-900 text-white font-bold text-xs transition-colors"
                >
                  Export Sample AWB Now
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 pl-6">Name</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Size</th>
                      <th className="p-3.5">Modified</th>
                      <th className="p-3.5 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {files.map((file) => {
                      const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                      return (
                        <tr
                          key={file.id}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          <td className="p-3.5 pl-6">
                            <div className="flex items-center gap-3">
                              {getFileIcon(file.mimeType)}
                              {isFolder ? (
                                <button
                                  onClick={() => handleOpenFolder(file)}
                                  className="font-bold text-white hover:text-[#FF6600] text-left transition-colors truncate max-w-xs sm:max-w-md"
                                >
                                  {file.name}
                                </button>
                              ) : (
                                <span className="font-medium text-slate-200 truncate max-w-xs sm:max-w-md">
                                  {file.name}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 text-slate-400">
                            {isFolder ? 'Folder' : file.mimeType.split('/').pop() || 'File'}
                          </td>
                          <td className="p-3.5 font-mono text-slate-400">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="p-3.5 text-slate-400">
                            {file.modifiedTime
                              ? new Date(file.modifiedTime).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : '—'}
                          </td>
                          <td className="p-3.5 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {file.webViewLink && (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open in Google Drive"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {file.webContentLink && (
                                <a
                                  href={file.webContentLink}
                                  download
                                  title="Direct Download"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => requestDeleteFile(file)}
                                title="Delete from Drive"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MANDATORY Confirmation Modal for Workspace Deletion & Mutating Operations */}
      {pendingConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6600]/20 text-[#FF6600] flex items-center justify-center border border-[#FF6600]/40 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{pendingConfirmation.title}</h3>
                <p className="text-xs text-slate-400">Explicit User Verification Required</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {pendingConfirmation.description}
            </p>

            {pendingConfirmation.type === 'create_awb' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
                {pendingConfirmation.payload.content.slice(0, 300)}...
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPendingConfirmation(null)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isProcessing}
                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg ${
                  pendingConfirmation.type === 'delete_file'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-950/50'
                    : 'bg-[#4D148C] hover:bg-purple-900 text-white shadow-purple-950/50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#FF6600]" />
                <span>{isProcessing ? 'Processing...' : 'Confirm & Proceed'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Folder className="w-5 h-5 text-amber-400" />
                <span>New Google Drive Folder</span>
              </h3>
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">
                Folder Name *
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. FedEx Shipping Documents 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6600]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={requestCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-5 py-2 rounded-xl bg-[#4D148C] hover:bg-purple-900 text-white text-xs font-bold disabled:opacity-50"
              >
                Review & Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Custom Text/Manifest Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                <span>Upload Document to Drive</span>
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">File Name *</label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g. Customs_Declaration_NX839.txt"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Document Content / Manifest Data *
                </label>
                <textarea
                  value={uploadFileContent}
                  onChange={(e) => setUploadFileContent(e.target.value)}
                  placeholder="Paste shipping manifest or document text..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6600] h-32 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!uploadFileName.trim() || !uploadFileContent.trim()) return;
                  setIsUploadModalOpen(false);
                  setPendingConfirmation({
                    type: 'create_awb',
                    payload: {
                      fileName: uploadFileName.trim(),
                      content: uploadFileContent.trim(),
                      parentFolderId: currentFolderId,
                    },
                    title: `Upload "${uploadFileName.trim()}" to Google Drive`,
                    description: `Upload this document directly to "${folderPath[folderPath.length - 1].name}".`,
                  });
                }}
                disabled={!uploadFileName.trim() || !uploadFileContent.trim()}
                className="px-5 py-2 rounded-xl bg-[#FF6600] hover:bg-[#e05a00] text-white text-xs font-bold disabled:opacity-50"
              >
                Review & Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

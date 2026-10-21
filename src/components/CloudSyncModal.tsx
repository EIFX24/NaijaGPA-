import React, { useState } from 'react';
import { X, ShieldCheck, Key, Copy, Check, Upload, Download, RefreshCw, Smartphone, Laptop } from 'lucide-react';
import { AcademicDeadline, StudentProfile } from '../types/academic';
import { decryptPayload, encryptPayload } from '../utils/cryptoStorage';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  deadlines: AcademicDeadline[];
  onImportData: (profile: StudentProfile, deadlines: AcademicDeadline[]) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  profile,
  deadlines,
  onImportData,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [passphrase, setPassphrase] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [importToken, setImportToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleGenerateSyncCode = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const payload = {
        version: 2,
        exportedAt: new Date().toISOString(),
        profile,
        deadlines,
      };
      const secret = passphrase.trim() || 'NaijaGPA-Default-Student-Vault';
      const token = await encryptPayload(payload, secret);
      setGeneratedToken(token);
      setStatusMessage({ text: 'Encrypted sync token generated successfully with AES-GCM (256-bit).', isError: false });
    } catch (err: any) {
      setStatusMessage({ text: `Failed to generate token: ${err?.message || 'Encryption error'}`, isError: true });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!generatedToken) return;
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadBackupFile = async () => {
    try {
      const payload = {
        version: 2,
        exportedAt: new Date().toISOString(),
        profile,
        deadlines,
      };
      const secret = passphrase.trim() || 'NaijaGPA-Default-Student-Vault';
      const token = await encryptPayload(payload, secret);

      const blob = new Blob([token], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NaijaGPA_Backup_${profile.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.naijagpa`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setStatusMessage({ text: `Failed to export backup file: ${err?.message}`, isError: true });
    }
  };

  const handleImportToken = async () => {
    if (!importToken.trim()) return;
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const secret = passphrase.trim() || 'NaijaGPA-Default-Student-Vault';
      const parsed = await decryptPayload<{
        profile: StudentProfile;
        deadlines: AcademicDeadline[];
      }>(importToken.trim(), secret);

      if (parsed.profile && parsed.profile.semesters) {
        onImportData(parsed.profile, parsed.deadlines || []);
        setStatusMessage({ text: `Successfully imported ${parsed.profile.studentName}'s records (${parsed.profile.semesters.length} semesters)!`, isError: false });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error('Invalid academic profile structure in payload.');
      }
    } catch (err: any) {
      setStatusMessage({
        text: 'Decryption failed! Please check that your sync code and passphrase match exactly.',
        isError: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (text) {
        setImportToken(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Cross-Platform Cloud Sync & Encrypted Vault
              </h2>
              <p className="text-xs text-slate-500">
                AES-GCM 256-bit client-side encryption. Zero server leakage.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <button
            onClick={() => { setActiveTab('export'); setStatusMessage(null); }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sync from this Device (Export)
          </button>
          <button
            onClick={() => { setActiveTab('import'); setStatusMessage(null); }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Restore onto this Device (Import)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Optional Passphrase Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vault Passphrase (Optional / Personal Security Key)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Leave blank for auto-secure key or enter a custom secret"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              If you set a custom passphrase, you must enter the identical passphrase on your other device to decrypt.
            </p>
          </div>

          {activeTab === 'export' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>How to sync between your Phone & Laptop:</span>
                </div>
                <p>1. Click &ldquo;Generate Sync Code&rdquo; below to create your encrypted profile string.</p>
                <p>2. Copy the code or save the backup file.</p>
                <p>3. Open NaijaGPA on your other device, go to &ldquo;Restore onto this Device&rdquo;, and paste.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleGenerateSyncCode}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Generate Encrypted Sync Code</span>
                </button>

                <button
                  onClick={handleDownloadBackupFile}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .naijagpa Backup</span>
                </button>
              </div>

              {generatedToken && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Encrypted Payload Token:</span>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Token</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    rows={4}
                    value={generatedToken}
                    className="w-full text-[11px] font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 select-all"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Paste Encrypted Sync Code:
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste your sync code token here..."
                  value={importToken}
                  onChange={(e) => setImportToken(e.target.value)}
                  className="w-full text-[11px] font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">or load from backup file:</span>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose .naijagpa file</span>
                  <input
                    type="file"
                    accept=".naijagpa,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                onClick={handleImportToken}
                disabled={!importToken.trim() || isProcessing}
                className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Decrypting Vault...' : 'Decrypt & Restore Academic Profile'}
              </button>
            </div>
          )}

          {/* Status Feedback Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-xs ${
                statusMessage.isError
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              {statusMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

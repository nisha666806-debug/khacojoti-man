import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isRunningStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (isStandalone || dismissed) return null;

  return (
    <>
      {/* Android / Chrome One-Click Install Banner */}
      {deferredPrompt && (
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-2.5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/20">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">{t.installTitle}</p>
              <p className="text-[11px] text-sky-100">{t.installSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1 bg-white text-sky-700 hover:bg-sky-50 text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95"
            >
              {t.installBtn}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Help banner */}
      {isIOS && !deferredPrompt && (
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 text-slate-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              {t.installIosHelp}{' '}
              <PlusSquare className="w-3.5 h-3.5 inline text-sky-400" />
            </span>
          </div>
          <button onClick={() => setDismissed(true)} className="p-1 text-slate-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
};

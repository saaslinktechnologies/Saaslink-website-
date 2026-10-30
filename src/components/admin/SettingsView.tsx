import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, Save, Building, CreditCard, 
  FileText, ShieldCheck, CheckCircle2, AlertCircle,
  Upload, Image as ImageIcon, RefreshCw, Trash2, 
  Layers, Check, ExternalLink, HelpCircle, Globe, Compass, Monitor
} from 'lucide-react';
import { GlobalSettings } from '../../types.ts';

interface SettingsViewProps {
  settings?: GlobalSettings;
  onSaveSettings: (settings: Partial<GlobalSettings>) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<GlobalSettings>({ 
    ...settings,
    companyName: settings?.companyName || 'SaaSLink Technologies Ltd',
    companyAddress: settings?.companyAddress || settings?.address || '',
    companyEmail: settings?.companyEmail || settings?.email || '',
    companyPhone: settings?.companyPhone || settings?.phone || '',
    companyWebsite: settings?.companyWebsite || settings?.website || '',
    companyTagline: settings?.companyTagline || settings?.tagline || '',
    logoUrl: settings?.logoUrl || '/assets/saaslink-logo.svg',
    faviconUrl: settings?.faviconUrl || settings?.logoUrl || '/assets/saaslink-logo.svg',
    taxId: settings?.taxId || 'P051982341Z',
  });

  // Sync if settings prop updates externally
  useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        ...settings,
        logoUrl: settings.logoUrl || prev.logoUrl || '/assets/saaslink-logo.svg',
        faviconUrl: settings.faviconUrl || prev.faviconUrl || settings.logoUrl || '/assets/saaslink-logo.svg',
      }));
    }
  }, [settings]);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Logo specific states
  const [savingLogo, setSavingLogo] = useState(false);
  const [logoSuccess, setLogoSuccess] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setLogoError('Invalid file type. Please select an image (PNG, SVG, JPG, WebP, GIF).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setLogoError('File size exceeds 8MB limit. Please compress or select a smaller image.');
      return;
    }

    setLogoError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, logoUrl: result }));
      setUploadedFileName(file.name);
      setUploadedFileSize((file.size / 1024).toFixed(1) + ' KB');
    };
    reader.onerror = () => {
      setLogoError('Failed to read file from disk. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleApplyLogoNow = async () => {
    if (!formData.logoUrl) return;
    setSavingLogo(true);
    setLogoSuccess(false);
    setLogoError(null);
    try {
      await onSaveSettings({ logoUrl: formData.logoUrl });
      setLogoSuccess(true);
      setTimeout(() => setLogoSuccess(false), 3500);
    } catch (err: any) {
      setLogoError(err?.message || 'Failed to update logo');
    } finally {
      setSavingLogo(false);
    }
  };

  const handleResetToDefault = () => {
    setFormData(prev => ({ ...prev, logoUrl: '/assets/saaslink-logo.svg' }));
    setUploadedFileName('');
    setUploadedFileSize('');
    setLogoError(null);
  };

  // Favicon specific states
  const [savingFavicon, setSavingFavicon] = useState(false);
  const [faviconSuccess, setFaviconSuccess] = useState(false);
  const [faviconError, setFaviconError] = useState<string | null>(null);
  const [uploadedFaviconName, setUploadedFaviconName] = useState('');
  const [uploadedFaviconSize, setUploadedFaviconSize] = useState('');
  const [isFaviconDragging, setIsFaviconDragging] = useState(false);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const processFaviconFile = (file: File) => {
    if (!file.type.startsWith('image/') && !file.name.endsWith('.ico')) {
      setFaviconError('Invalid file type. Please select an icon or image (ICO, PNG, SVG, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFaviconError('File size exceeds 2MB limit. Favicons should typically be small (16x16, 32x32, or 48x48).');
      return;
    }

    setFaviconError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, faviconUrl: result }));
      setUploadedFaviconName(file.name);
      setUploadedFaviconSize((file.size / 1024).toFixed(1) + ' KB');
      
      // Dynamic live tab preview in head
      const link = document.getElementById('app-favicon') || document.querySelector("link[rel*='icon']");
      if (link) (link as HTMLLinkElement).href = result;
    };
    reader.onerror = () => {
      setFaviconError('Failed to read file from disk. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFaviconFile(file);
    }
  };

  const handleFaviconDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFaviconDragging(true);
  };

  const handleFaviconDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFaviconDragging(false);
  };

  const handleFaviconDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFaviconDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFaviconFile(file);
    }
  };

  const handleApplyFaviconNow = async () => {
    if (!formData.faviconUrl) return;
    setSavingFavicon(true);
    setFaviconSuccess(false);
    try {
      await onSaveSettings({ faviconUrl: formData.faviconUrl });
      const link = document.getElementById('app-favicon') || document.querySelector("link[rel*='icon']");
      if (link) (link as HTMLLinkElement).href = formData.faviconUrl;
      setFaviconSuccess(true);
      setTimeout(() => setFaviconSuccess(false), 3500);
    } catch (err: any) {
      setFaviconError(err?.message || 'Failed to update favicon');
    } finally {
      setSavingFavicon(false);
    }
  };

  const handleUseLogoAsFavicon = () => {
    if (formData.logoUrl) {
      setFormData(prev => ({ ...prev, faviconUrl: prev.logoUrl }));
      setUploadedFaviconName('Synced from company logo');
      setUploadedFaviconSize('');
      setFaviconError(null);
      const link = document.getElementById('app-favicon') || document.querySelector("link[rel*='icon']");
      if (link) (link as HTMLLinkElement).href = formData.logoUrl;
    }
  };

  const handleResetFaviconDefault = () => {
    setFormData(prev => ({ ...prev, faviconUrl: '/assets/saaslink-logo.svg' }));
    setUploadedFaviconName('');
    setUploadedFaviconSize('');
    setFaviconError(null);
    const link = document.getElementById('app-favicon') || document.querySelector("link[rel*='icon']");
    if (link) (link as HTMLLinkElement).href = '/assets/saaslink-logo.svg';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const payload: GlobalSettings = {
        ...formData,
        logoUrl: formData.logoUrl,
        faviconUrl: formData.faviconUrl || formData.logoUrl,
        address: formData.companyAddress || formData.address,
        email: formData.companyEmail || formData.email,
        phone: formData.companyPhone || formData.phone,
        website: formData.companyWebsite || formData.website,
        tagline: formData.companyTagline || formData.tagline,
      };
      await onSaveSettings(payload);
      const link = document.getElementById('app-favicon') || document.querySelector("link[rel*='icon']");
      if (link && payload.faviconUrl) (link as HTMLLinkElement).href = payload.faviconUrl;
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Enterprise & Platform Configuration
          </h2>
          <p className="text-xs text-slate-400">
            Define corporate branding, logo assets, tax identifiers, billing prefixes, and settlement coordinates.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* SECTION: Brand & Logo Management */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <ImageIcon className="w-4 h-4" />
              <span>Corporate Brand & Logo Emblem</span>
            </div>
            {logoSuccess && (
              <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold animate-pulse">
                <Check className="w-3.5 h-3.5" /> Logo updated across platform!
              </span>
            )}
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            Upload or change your official company logo. This logo immediately reflects across the public website navigation bar, footer lockup, admin console header, and generated client quotations and invoices.
          </p>

          {/* Logo Previews (Dark & Light) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dark Website Header Preview */}
            <div className="p-4 rounded-xl bg-[oklch(0.24_0.035_165)] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.85_0.14_85)] via-[oklch(0.78_0.12_78)] to-[oklch(0.68_0.13_65)] p-0.5 shadow-gold shrink-0">
                  <div className="w-full h-full bg-[oklch(0.22_0.03_165)] rounded-[10px] flex items-center justify-center overflow-hidden">
                    {formData.logoUrl ? (
                      <img 
                        src={formData.logoUrl} 
                        alt="Logo Preview" 
                        className="w-full h-full object-contain p-1" 
                      />
                    ) : (
                      <Layers className="w-6 h-6 text-[oklch(0.85_0.14_85)]" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-bold text-sm">
                      {formData.companyName || 'SaaSLink'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Website Header (Dark Preview)</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[oklch(0.85_0.12_80)] border border-white/10">
                Navbar Preview
              </span>
            </div>

            {/* Light / Print Invoice Preview */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-slate-900 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-1">
                  {formData.logoUrl ? (
                    <img 
                      src={formData.logoUrl} 
                      alt="Logo Print Preview" 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <Layers className="w-6 h-6 text-slate-700" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 block">
                    {formData.companyName || 'SaaSLink Technologies'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Invoice / Print (Light Preview)</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Print Preview
              </span>
            </div>
          </div>

          {/* Interactive Upload Box */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
              isDragging 
                ? 'border-cyan-400 bg-cyan-950/30' 
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif"
              className="hidden" 
            />

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Upload className="w-5 h-5" />
              </div>

              <div>
                <span className="text-white font-semibold">Click to browse file</span> or drag & drop your logo here
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports SVG, PNG, WebP, JPG (Recommended: transparent background, min 256x256px, max 8MB)
                </p>
              </div>

              {uploadedFileName && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Selected: {uploadedFileName} ({uploadedFileSize})</span>
                </div>
              )}
            </div>
          </div>

          {logoError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{logoError}</span>
            </div>
          )}

          {/* Direct URL Input & Quick Actions */}
          <div className="space-y-2 pt-1">
            <label className="block text-slate-300 font-semibold">
              Or specify direct Logo URL / Asset Path:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. /assets/saaslink-logo.svg or https://example.com/logo.png"
                value={formData.logoUrl?.startsWith('data:') ? 'Custom uploaded image (Base64 Data URL)' : formData.logoUrl || ''}
                onChange={(e) => {
                  setFormData({ ...formData, logoUrl: e.target.value });
                  setUploadedFileName('');
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400 text-xs"
              />

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleApplyLogoNow}
                  disabled={savingLogo || !formData.logoUrl}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {savingLogo ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{savingLogo ? 'Applying...' : 'Apply Logo Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset to default SVG emblem"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* SECTION: Browser Favicon Management (Superadmin) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Browser Favicon & Shortcut Icon (Superadmin)</span>
            </div>
            {faviconSuccess && (
              <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold animate-pulse">
                <Check className="w-3.5 h-3.5" /> Favicon updated & live in browser tabs!
              </span>
            )}
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            Customize or replace the icon that appears in browser tabs, address bars, bookmarks, and mobile home screen shortcuts. Changes update the live application <code className="text-cyan-300 font-mono text-[11px]">&lt;link rel=&quot;icon&quot;&gt;</code> immediately.
          </p>

          {/* Browser Tab Live Mockup Preview */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                Live Browser Tab Mockup
              </span>
              <span className="text-slate-500">Real-time Rendering</span>
            </div>

            {/* Mock Browser Header */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-2 space-y-2">
              <div className="flex items-center gap-1.5 pb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />

                {/* Simulated Tab */}
                <div className="ml-3 px-3 py-1.5 rounded-t-lg bg-slate-950 border-t border-x border-slate-700/80 flex items-center gap-2 max-w-xs shadow-sm">
                  <div className="w-4 h-4 rounded shrink-0 overflow-hidden flex items-center justify-center bg-slate-900">
                    {formData.faviconUrl ? (
                      <img 
                        src={formData.faviconUrl} 
                        alt="Favicon" 
                        className="w-full h-full object-contain" 
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Globe className="w-3 h-3 text-cyan-400" />
                    )}
                  </div>
                  <span className="text-xs text-white truncate font-medium">
                    {formData.companyName || 'SaaSLink Technologies'}
                  </span>
                  <span className="text-slate-500 text-[10px] ml-auto hover:text-slate-300">✕</span>
                </div>
              </div>

              {/* Simulated Address Bar */}
              <div className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800/60 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span className="text-emerald-400 text-xs">🔒</span>
                <span className="text-slate-300">{formData.companyWebsite?.replace(/^https?:\/\//, '') || 'saaslink.tech'}</span>
                <span className="text-slate-600">/admin/settings</span>
              </div>
            </div>

            {/* Resolutions Preview */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
                <div className="w-5 h-5 rounded bg-slate-950 border border-slate-700 flex items-center justify-center p-0.5 shrink-0">
                  <img src={formData.faviconUrl || '/assets/saaslink-logo.svg'} alt="16px" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white">16 × 16 px</div>
                  <div className="text-[10px] text-slate-500 font-mono">Standard Tab</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-slate-950 border border-slate-700 flex items-center justify-center p-0.5 shrink-0">
                  <img src={formData.faviconUrl || '/assets/saaslink-logo.svg'} alt="32px" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white">32 × 32 px</div>
                  <div className="text-[10px] text-slate-500 font-mono">Retina / HiDPI</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-slate-950 border border-slate-700 flex items-center justify-center p-1 shrink-0">
                  <img src={formData.faviconUrl || '/assets/saaslink-logo.svg'} alt="48px" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white">48 × 48 px</div>
                  <div className="text-[10px] text-slate-500 font-mono">Bookmark / PWA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Favicon Upload Dropzone */}
          <div
            onDragOver={handleFaviconDragOver}
            onDragLeave={handleFaviconDragLeave}
            onDrop={handleFaviconDrop}
            onClick={() => faviconInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isFaviconDragging 
                ? 'border-cyan-400 bg-cyan-950/30' 
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60'
            }`}
          >
            <input 
              ref={faviconInputRef}
              type="file" 
              accept=".ico,image/png,image/svg+xml,image/webp,image/x-icon" 
              onChange={handleFaviconFileChange}
              className="hidden" 
            />

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Compass className="w-5 h-5" />
              </div>

              <div>
                <span className="text-white font-semibold">Click to upload favicon icon</span> or drag & drop file here
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports .ICO, .PNG, .SVG, .WebP (Recommended: 32x32, 64x64 square ratio, max 2MB)
                </p>
              </div>

              {uploadedFaviconName && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Selected: {uploadedFaviconName} {uploadedFaviconSize ? `(${uploadedFaviconSize})` : ''}</span>
                </div>
              )}
            </div>
          </div>

          {faviconError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{faviconError}</span>
            </div>
          )}

          {/* Favicon URL Input & Action Buttons */}
          <div className="space-y-2 pt-1">
            <label className="block text-slate-300 font-semibold">
              Or specify direct Favicon URL / Asset Path:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. /assets/saaslink-logo.svg or /favicon.ico"
                value={formData.faviconUrl?.startsWith('data:') ? 'Custom uploaded icon (Base64 Data URL)' : formData.faviconUrl || ''}
                onChange={(e) => {
                  setFormData({ ...formData, faviconUrl: e.target.value });
                  setUploadedFaviconName('');
                  const link = document.getElementById('app-favicon') || document.querySelector("link[rel*='icon']");
                  if (link && e.target.value) (link as HTMLLinkElement).href = e.target.value;
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400 text-xs"
              />

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleApplyFaviconNow}
                  disabled={savingFavicon || !formData.faviconUrl}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {savingFavicon ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{savingFavicon ? 'Applying...' : 'Apply Favicon Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleUseLogoAsFavicon}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Use current company logo as favicon"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sync with Logo</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetFaviconDefault}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset to default favicon"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 1: Corporate Entity */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Building className="w-4 h-4" />
            <span>Corporate Identity & Registration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company Legal Name *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tax / KRA PIN Number *</label>
              <input
                type="text"
                required
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Email</label>
              <input
                type="email"
                required
                value={formData.companyEmail}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Telephone</label>
              <input
                type="tel"
                required
                value={formData.companyPhone}
                onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Domain / Website</label>
              <input
                type="text"
                value={formData.companyWebsite}
                onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Company Tagline / Subtitle</label>
            <input
              type="text"
              value={formData.companyTagline}
              onChange={(e) => setFormData({ ...formData, companyTagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
              placeholder="Software & Cloud Systems"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Registered Physical Address</label>
            <input
              type="text"
              value={formData.companyAddress}
              onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Section 2: Financial & Document Prefixes */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <CreditCard className="w-4 h-4" />
            <span>Financial Parameters & Document Numbering</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Platform Currency Code</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="KES">KES (KSh) - Kenya Shillings</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Default Tax / VAT Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.defaultTaxRate}
                onChange={(e) => setFormData({ ...formData, defaultTaxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Quotation Prefix</label>
              <input
                type="text"
                value={formData.quotationPrefix}
                onChange={(e) => setFormData({ ...formData, quotationPrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Receipt Prefix</label>
              <input
                type="text"
                value={formData.receiptPrefix}
                onChange={(e) => setFormData({ ...formData, receiptPrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Settlement Instructions & Terms */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Bank Coordinates & Legal Terms</span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Official Bank & M-Pesa Payment Instructions</label>
            <textarea
              rows={4}
              value={formData.paymentInstructions}
              onChange={(e) => setFormData({ ...formData, paymentInstructions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Default Terms & Intellectual Property Conditions</label>
            <textarea
              rows={3}
              value={formData.termsAndConditions}
              onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Platform Config...' : 'Save Enterprise Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, Plus, Trash2, Copy, 
  Check, ExternalLink, Search, Upload, Star, CheckCircle2 
} from 'lucide-react';
import { MediaItem } from '../../types.ts';

interface MediaViewProps {
  media?: MediaItem[];
  currentLogoUrl?: string;
  onAddMedia: (item: Partial<MediaItem>) => Promise<void>;
  onDeleteMedia: (id: string) => Promise<void>;
  onSetAsLogo?: (url: string) => Promise<void>;
}

export const MediaView: React.FC<MediaViewProps> = ({
  media = [],
  currentLogoUrl,
  onAddMedia,
  onDeleteMedia,
  onSetAsLogo,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [settingLogoId, setSettingLogoId] = useState<string | null>(null);
  const [logoSuccessId, setLogoSuccessId] = useState<string | null>(null);

  const [filename, setFilename] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<'general' | 'service' | 'product' | 'case_study' | 'team'>('general');
  const [fileSize, setFileSize] = useState(450000);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeMedia = media || [];

  const filtered = safeMedia.filter(m => 
    (m.filename || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (m: MediaItem) => {
    navigator.clipboard.writeText(m.url);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!filename) {
      setFilename(file.name);
    }
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      setUrl(dataUrl);
      setIsUploadingFile(false);
    };
    setIsUploadingFile(true);
    reader.readAsDataURL(file);
  };

  const handleSetLogo = async (item: MediaItem) => {
    if (!onSetAsLogo) return;
    setSettingLogoId(item.id);
    try {
      await onSetAsLogo(item.url);
      setLogoSuccessId(item.id);
      setTimeout(() => setLogoSuccessId(null), 3000);
    } finally {
      setSettingLogoId(null);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    await onAddMedia({
      filename: filename || 'media_asset',
      url,
      category,
      mimeType: url.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/jpeg',
      fileSize: fileSize || 450000,
    });
    setFilename('');
    setUrl('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Media Library & Visual Assets
          </h2>
          <p className="text-xs text-slate-400">
            Digital asset store for platform graphics, corporate logos, project screenshots, and executive profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 w-44"
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Asset / Logo</span>
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const isCurrentLogo = currentLogoUrl === item.url;
          return (
            <div
              key={item.id}
              className={`rounded-2xl bg-slate-900 border transition-all flex flex-col justify-between overflow-hidden group ${
                isCurrentLogo ? 'border-cyan-500 shadow-md shadow-cyan-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={item.url}
                  alt={item.filename}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[10px] font-mono text-cyan-400 border border-slate-800">
                    {item.category}
                  </span>
                  {isCurrentLogo && (
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-slate-950" />
                      Active Logo
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 space-y-2">
                <div className="font-medium text-white text-xs truncate" title={item.filename}>
                  {item.filename}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
                  <span>{(item.fileSize / 1024).toFixed(0)} KB</span>

                  <div className="flex items-center gap-1.5">
                    {onSetAsLogo && !isCurrentLogo && (
                      <button
                        onClick={() => handleSetLogo(item)}
                        disabled={settingLogoId === item.id}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-[10px] font-semibold flex items-center gap-1 border border-slate-700/60 transition-colors"
                        title="Set this asset as official corporate logo"
                      >
                        {logoSuccessId === item.id ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Set!</span>
                          </>
                        ) : (
                          <>
                            <Star className="w-3 h-3 text-cyan-400" />
                            <span>Set as Logo</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Copy Image URL"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteMedia(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Media Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-left">
            <h3 className="text-base font-display font-bold text-white mb-4">
              Register New Visual Asset
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              
              {/* File upload prompt */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Upload File from Device</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 border border-dashed border-slate-700 hover:border-cyan-400 rounded-xl bg-slate-950 cursor-pointer text-center text-slate-400 hover:text-white transition-colors"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFilePicked}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>{isUploadingFile ? 'Reading file...' : 'Choose image file (PNG, JPG, SVG, WebP)'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Asset Filename / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. corporate-logo.png"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL or Data URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://... or upload file above"
                  value={url.startsWith('data:') ? 'Loaded from local file (Data URL)' : url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Asset Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="general">General / Branding</option>
                  <option value="service">Services Showcase</option>
                  <option value="product">Product Platform</option>
                  <option value="case_study">Case Study Architecture</option>
                  <option value="team">Team Member</option>
                </select>
              </div>

              {url && (
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={url} alt="Preview" className="w-full h-full object-contain p-1" />
                  </div>
                  <span className="text-[11px] text-slate-400 truncate">Asset preview ready</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!url}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

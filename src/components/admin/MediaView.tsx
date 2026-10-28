import React, { useState } from 'react';
import { 
  Image as ImageIcon, Plus, Trash2, Copy, 
  Check, ExternalLink, Search 
} from 'lucide-react';
import { MediaItem } from '../../types.ts';

interface MediaViewProps {
  media?: MediaItem[];
  onAddMedia: (item: Partial<MediaItem>) => Promise<void>;
  onDeleteMedia: (id: string) => Promise<void>;
}

export const MediaView: React.FC<MediaViewProps> = ({
  media = [],
  onAddMedia,
  onDeleteMedia,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [filename, setFilename] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<'general' | 'service' | 'product' | 'case_study' | 'team'>('general');

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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddMedia({
      filename,
      url,
      category,
      mimeType: 'image/jpeg',
      fileSize: 450000,
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
            Digital asset store for platform graphics, project screenshots, and executive profiles.
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
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden group hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-slate-950 overflow-hidden">
              <img
                src={item.url}
                alt={item.filename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[10px] font-mono text-cyan-400 border border-slate-800">
                {item.category}
              </span>
            </div>

            <div className="p-3.5 space-y-2">
              <div className="font-medium text-white text-xs truncate" title={item.filename}>
                {item.filename}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
                <span>{(item.fileSize / 1024).toFixed(0)} KB</span>

                <div className="flex items-center gap-1.5">
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
        ))}
      </div>

      {/* Add Media Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-left">
            <h3 className="text-base font-display font-bold text-white mb-4">
              Register New Visual Asset
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Asset Filename / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. enterprise-architecture-flow.jpg"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={url}
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
                  <option value="general">General Asset</option>
                  <option value="service">Service Illustration</option>
                  <option value="product">Product Screenshot</option>
                  <option value="case_study">Case Study Graphic</option>
                  <option value="team">Team Executive Photo</option>
                </select>
              </div>

              {url && (
                <div className="aspect-video rounded-xl overflow-hidden border border-slate-800">
                  <img src={url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold"
                >
                  Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

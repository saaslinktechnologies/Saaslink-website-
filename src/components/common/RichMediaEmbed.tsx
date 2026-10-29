import React, { useState, useEffect } from 'react';
import { Play, Maximize2, X, ChevronLeft, ChevronRight, Video, Image as ImageIcon, ExternalLink } from 'lucide-react';

export interface VideoInfo {
  type: 'youtube' | 'vimeo' | 'loom' | 'direct' | 'unknown';
  embedUrl?: string;
  directUrl?: string;
}

export function parseVideoUrl(rawUrl?: string): VideoInfo | null {
  if (!rawUrl || !rawUrl.trim()) return null;
  const url = rawUrl.trim();

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1&title=0&byline=0`,
    };
  }

  // Loom
  const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
  if (loomMatch && loomMatch[1]) {
    return {
      type: 'loom',
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
    };
  }

  // Direct MP4 / WebM or standard video url
  if (url.match(/\.(mp4|webm|ogg|mov)($|\?)/i) || url.startsWith('data:video') || url.includes('blob:')) {
    return {
      type: 'direct',
      directUrl: url,
    };
  }

  // If http/https URL, try as direct video embed fallback
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return {
      type: 'direct',
      directUrl: url,
    };
  }

  return { type: 'unknown' };
}

interface VideoPlayerProps {
  url?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title = 'Product Video Demonstration',
  className = '',
}) => {
  const videoInfo = parseVideoUrl(url);

  if (!videoInfo || videoInfo.type === 'unknown') {
    return null;
  }

  return (
    <div className={`overflow-hidden rounded-2xl bg-black/90 border border-white/15 shadow-xl ${className}`}>
      {/* Player Top Banner */}
      <div className="px-4 py-2 bg-slate-900/80 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-[oklch(0.85_0.12_80)] font-semibold flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" />
            <span>{title}</span>
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {videoInfo.type === 'youtube' && 'YouTube HD'}
          {videoInfo.type === 'vimeo' && 'Vimeo Video'}
          {videoInfo.type === 'loom' && 'Loom Walkthrough'}
          {videoInfo.type === 'direct' && 'Direct Video Stream'}
        </span>
      </div>

      {/* Video Content */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
        {videoInfo.embedUrl ? (
          <iframe
            src={videoInfo.embedUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : videoInfo.directUrl ? (
          <video
            src={videoInfo.directUrl}
            controls
            playsInline
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        ) : null}
      </div>
    </div>
  );
};

interface PhotoGalleryProps {
  images?: string[];
  title?: string;
  columns?: 2 | 3 | 4;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  images = [],
  title = 'System Screenshots & Photographic Evidence',
  columns = 3,
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Filter valid image strings
  const validImages = (images || []).filter(img => typeof img === 'string' && img.trim().length > 0);

  if (validImages.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    setActiveIdx((activeIdx - 1 + validImages.length) % validImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    setActiveIdx((activeIdx + 1) % validImages.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (activeIdx === null) return;
    if (e.key === 'Escape') setActiveIdx(null);
    if (e.key === 'ArrowLeft') setActiveIdx((activeIdx - 1 + validImages.length) % validImages.length);
    if (e.key === 'ArrowRight') setActiveIdx((activeIdx + 1) % validImages.length);
  };

  useEffect(() => {
    if (activeIdx !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeIdx, validImages.length]);

  const gridColsClass = 
    columns === 2 ? 'grid-cols-1 sm:grid-cols-2' :
    columns === 4 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' :
    'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase text-[oklch(0.85_0.12_80)] font-bold tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{title}</span>
        </h4>
        <span className="text-[11px] font-mono text-slate-400">
          {validImages.length} {validImages.length === 1 ? 'photo' : 'photos'}
        </span>
      </div>

      <div className={`grid ${gridColsClass} gap-3`}>
        {validImages.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className="group relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 hover:border-[oklch(0.85_0.12_80)] cursor-pointer transition-all duration-200"
          >
            <img
              src={img}
              alt={`Gallery preview ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white font-mono text-[11px] flex items-center gap-1.5 backdrop-blur-sm border border-white/20">
                <Maximize2 className="w-3 h-3 text-[oklch(0.85_0.12_80)]" />
                <span>View Fullscreen</span>
              </span>
            </div>
            <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300">
              #{idx + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeIdx !== null && (
        <div
          onClick={() => setActiveIdx(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <span className="text-xs font-mono text-slate-300">
                Image {activeIdx + 1} of {validImages.length}
              </span>
              <button
                onClick={() => setActiveIdx(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close image viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black max-h-[75vh] flex items-center justify-center">
              <img
                src={validImages[activeIdx]}
                alt={`Full preview ${activeIdx + 1}`}
                className="max-h-[75vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Prev Button */}
              {validImages.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-transform active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Next Button */}
              {validImages.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-transform active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Thumbnail Strip */}
            {validImages.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full pb-1">
                {validImages.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      idx === activeIdx ? 'border-[oklch(0.85_0.12_80)] scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

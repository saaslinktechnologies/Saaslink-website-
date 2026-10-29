import React from 'react';
import { 
  X, Check, ArrowRight, TrendingUp, Cpu, 
  ShieldCheck, ExternalLink, Sparkles, Video, Image as ImageIcon 
} from 'lucide-react';
import { Service, Product, PortfolioProject, Article } from '../../types.ts';
import { VideoPlayer, PhotoGallery } from '../common/RichMediaEmbed.tsx';

interface PublicDetailModalProps {
  type: 'service' | 'product' | 'case_study' | 'article' | null;
  item: Service | Product | PortfolioProject | Article | null;
  onClose: () => void;
  onRequestAction: (itemTitle: string) => void;
}

export const PublicDetailModal: React.FC<PublicDetailModalProps> = ({
  type,
  item,
  onClose,
  onRequestAction,
}) => {
  if (!type || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-[oklch(0.24_0.035_165)] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-left my-4 sm:my-8">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-black/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[oklch(0.78_0.12_78/0.15)] text-[oklch(0.85_0.12_80)] border border-[oklch(0.78_0.12_78/0.3)] text-[11px] font-mono font-semibold uppercase tracking-wider">
              {type === 'service' && 'Service Specification'}
              {type === 'product' && 'Enterprise Platform'}
              {type === 'case_study' && 'Case Study Analysis'}
              {type === 'article' && 'Technical Insight'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-5 sm:p-8 space-y-6 max-h-[78vh] overflow-y-auto">
          
          {/* SERVICE DETAIL */}
          {type === 'service' && (() => {
            const service = item as Service;
            return (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-[oklch(0.85_0.12_80)] uppercase font-bold">{service.category}</span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                    {service.title}
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed font-normal">
                    {service.fullDescription || service.shortDescription}
                  </p>
                </div>

                {/* Video Demo / Walkthrough (if attached) */}
                {service.videoUrl && (
                  <VideoPlayer url={service.videoUrl} title={`${service.title} - Technical Architecture Walkthrough`} />
                )}

                {/* Features & Deliverables */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono uppercase text-[oklch(0.85_0.12_80)] font-bold tracking-wider">
                    Core Technical Deliverables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(service.features || []).map((feat, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-start gap-2.5 text-xs text-slate-200">
                        <Check className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategic Benefits */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono uppercase text-[oklch(0.85_0.12_80)] font-bold tracking-wider">
                    Strategic Business Benefits
                  </h4>
                  <div className="space-y-2">
                    {(service.benefits || []).map((ben, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.85_0.12_80)] shrink-0" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gallery Images (if attached) */}
                {service.galleryImages && service.galleryImages.length > 0 && (
                  <PhotoGallery images={service.galleryImages} title="System Blueprints & Delivery Evidence" />
                )}

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-300">Ready to build? Request an itemized proposal.</span>
                  <button
                    onClick={() => {
                      onClose();
                      onRequestAction(service.title);
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold text-xs shadow-gold min-h-[44px] flex items-center justify-center cursor-pointer"
                  >
                    Request Quotation for this Service
                  </button>
                </div>
              </div>
            );
          })()}

          {/* PRODUCT DETAIL */}
          {type === 'product' && (() => {
            const product = item as Product;
            const isPijo = product.slug === 'pijo-shop' || product.demoUrl?.includes('pijo.shop');
            const galleryPhotos = Array.from(new Set([
              ...(product.galleryImages || []),
              ...(product.screenshots || [])
            ])).filter(Boolean);

            return (
              <div className="space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[oklch(0.78_0.12_78/0.2)] text-[oklch(0.85_0.12_80)] border border-[oklch(0.78_0.12_78/0.4)] text-xs font-semibold font-mono">
                      {product.pricingModel || 'Enterprise Licensed'}
                    </span>
                    <span className="text-xs text-slate-300">Industries: {(product.industries || []).join(', ')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white flex flex-wrap items-center gap-2">
                    <span>{product.name}</span>
                    {isPijo && (
                      <span className="px-2.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono text-xs font-bold">
                        app.pijo.shop
                      </span>
                    )}
                  </h2>
                  <p className="text-[oklch(0.78_0.12_78)] text-sm font-semibold mt-1">{product.tagline}</p>
                  <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed font-normal">
                    {product.fullDescription || product.shortDescription}
                  </p>
                </div>

                {/* Attached Video Walkthrough */}
                {product.videoUrl && (
                  <VideoPlayer url={product.videoUrl} title={`${product.name} - Official Video Walkthrough`} />
                )}

                {/* Hero Cover Image (if no video or as primary banner) */}
                {product.heroImage && !product.videoUrl && (
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img src={product.heroImage} alt={product.name} className="w-full h-56 sm:h-72 object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase text-[oklch(0.85_0.12_80)] font-bold tracking-wider">
                    Feature Capabilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(product.features || []).map((feat, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-start gap-2.5 text-xs text-slate-200">
                        <Check className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attached Photo Gallery */}
                {galleryPhotos.length > 0 && (
                  <PhotoGallery images={galleryPhotos} title="User Interfaces, Dashboards & Product Photos" />
                )}

                {/* Tech Stack */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase text-[oklch(0.85_0.12_80)] font-bold tracking-wider">
                    Architecture & Technology
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(product.techStack || []).map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-slate-300 font-mono text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-300">Includes complete database licensing & source rights.</span>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                    {isPijo && (
                      <a
                        href="https://app.pijo.shop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs inline-flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        <span>Launch app.pijo.shop</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        onClose();
                        onRequestAction(product.name);
                      }}
                      className="px-5 py-3 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold text-xs shadow-gold min-h-[44px] flex items-center justify-center cursor-pointer"
                    >
                      Schedule Platform Demo
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* CASE STUDY DETAIL */}
          {type === 'case_study' && (() => {
            const project = item as PortfolioProject;
            const galleryPhotos = Array.from(new Set([
              ...(project.galleryImages || []),
              ...(project.gallery || [])
            ])).filter(Boolean);

            return (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[oklch(0.78_0.12_78/0.2)] text-[oklch(0.85_0.12_80)] border border-[oklch(0.78_0.12_78/0.4)] text-xs font-semibold font-mono">
                      {project.industry}
                    </span>
                    <span className="text-xs text-slate-300">Client: <strong className="text-white">{project.client}</strong></span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    {project.title}
                  </h2>
                </div>

                {/* Attached Video Walkthrough */}
                {project.videoUrl && (
                  <VideoPlayer url={project.videoUrl} title={`${project.client} - Case Study Video Overview`} />
                )}

                {/* Hero Image */}
                {project.featuredImage && !project.videoUrl && (
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img src={project.featuredImage} alt={project.title} className="w-full h-56 sm:h-72 object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                {/* Challenge & Solution */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                    <h4 className="text-xs font-mono uppercase text-rose-300 font-bold mb-1">
                      The Operational Challenge
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {project.challenge}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                    <h4 className="text-xs font-mono uppercase text-[oklch(0.85_0.12_80)] font-bold mb-1">
                      SaaSLink Engineering Solution
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {project.solution}
                    </p>
                  </div>
                </div>

                {/* Quantifiable Results */}
                {project.results && project.results.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-[oklch(0.85_0.12_80)] font-bold tracking-wider">
                      Quantified Business Outcomes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(project.results || []).map((res, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center gap-2 text-xs text-slate-100 font-medium">
                          <TrendingUp className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0" />
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attached Photo Gallery */}
                {galleryPhotos.length > 0 && (
                  <PhotoGallery images={galleryPhotos} title="Field System Proof & Application Screenshots" />
                )}

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-300">Want similar efficiency for your operations?</span>
                  <button
                    onClick={() => {
                      onClose();
                      onRequestAction(`Consultation inspired by ${project.client} case study`);
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold text-xs shadow-gold min-h-[44px] flex items-center justify-center cursor-pointer"
                  >
                    Request Architectural Consultation
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ARTICLE DETAIL */}
          {type === 'article' && (() => {
            const article = item as Article;
            return (
              <div className="space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[oklch(0.78_0.12_78/0.2)] text-[oklch(0.85_0.12_80)] border border-[oklch(0.78_0.12_78/0.4)] text-xs font-semibold font-mono">
                      {article.category}
                    </span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.publishedAt}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    {article.title}
                  </h2>
                </div>

                {/* Video Lecture / Walkthrough (if attached) */}
                {article.videoUrl && (
                  <VideoPlayer url={article.videoUrl} title={`${article.title} - Video Lecture`} />
                )}

                {/* Cover Image */}
                {article.coverImage && !article.videoUrl && (
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img src={article.coverImage} alt={article.title} className="w-full h-56 sm:h-72 object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                <div className="prose prose-invert prose-slate max-w-none text-sm text-slate-300 leading-relaxed space-y-4">
                  <p className="text-base text-slate-200 font-medium leading-relaxed">
                    {article.summary}
                  </p>
                  <div className="whitespace-pre-line text-slate-300 text-sm">
                    {article.content}
                  </div>
                </div>

                {/* Attached Photo Gallery */}
                {article.galleryImages && article.galleryImages.length > 0 && (
                  <PhotoGallery images={article.galleryImages} title="Architecture Diagrams & System Schematics" />
                )}

                <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex items-center gap-3">
                  {article.authorAvatar && (
                    <img src={article.authorAvatar} alt={article.author} className="w-10 h-10 rounded-full object-cover border border-white/20" referrerPolicy="no-referrer" />
                  )}
                  <div>
                    <h5 className="text-xs font-bold text-white">{article.author}</h5>
                    <p className="text-[11px] text-slate-400">{article.authorRole} at SaaSLink Technologies Ltd</p>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>

      </div>
    </div>
  );
};

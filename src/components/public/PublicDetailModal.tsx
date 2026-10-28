import React from 'react';
import { 
  X, Check, ArrowRight, TrendingUp, Cpu, 
  ShieldCheck, ExternalLink, Sparkles 
} from 'lucide-react';
import { Service, Product, PortfolioProject, Article } from '../../types.ts';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-left my-8">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[11px] font-mono font-semibold uppercase tracking-wider">
              {type === 'service' && 'Service Specification'}
              {type === 'product' && 'Enterprise Platform'}
              {type === 'case_study' && 'Case Study Analysis'}
              {type === 'article' && 'Technical Insight'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* SERVICE DETAIL */}
          {type === 'service' && (() => {
            const service = item as Service;
            return (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase font-bold">{service.category}</span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                    {service.title}
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                    {service.fullDescription || service.shortDescription}
                  </p>
                </div>

                {/* Features & Deliverables */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                    Core Technical Deliverables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(service.features || []).map((feat, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                    Strategic Business Benefits
                  </h4>
                  <div className="space-y-2">
                    {(service.benefits || []).map((ben, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Ready to build? Request an itemized proposal.</span>
                  <button
                    onClick={() => {
                      onClose();
                      onRequestAction(service.title);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
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
            return (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-semibold font-mono">
                      {product.pricingModel || 'Enterprise Licensed'}
                    </span>
                    <span className="text-xs text-slate-400">Industries: {product.industries.join(', ')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    {product.name}
                  </h2>
                  <p className="text-cyan-400 text-sm font-medium mt-1">{product.tagline}</p>
                  <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                    {product.fullDescription || product.shortDescription}
                  </p>
                </div>

                {product.heroImage && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800">
                    <img src={product.heroImage} alt={product.name} className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                    Feature Capabilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(product.features || []).map((feat, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                    Architecture & Technology
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(product.techStack || []).map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Includes complete database licensing & source rights.</span>
                  <button
                    onClick={() => {
                      onClose();
                      onRequestAction(product.name);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                  >
                    Schedule Platform Demo
                  </button>
                </div>
              </div>
            );
          })()}

          {/* CASE STUDY DETAIL */}
          {type === 'case_study' && (() => {
            const project = item as PortfolioProject;
            return (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-semibold font-mono">
                      {project.industry}
                    </span>
                    <span className="text-xs text-slate-400">Client: <strong className="text-slate-200">{project.client}</strong></span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    {project.title}
                  </h2>
                </div>

                {project.featuredImage && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800">
                    <img src={project.featuredImage} alt={project.title} className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                {/* Challenge & Solution */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <h4 className="text-xs font-mono uppercase text-rose-400 font-bold mb-1">
                      The Operational Challenge
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">
                      SaaSLink Engineering Solution
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                </div>

                {/* Quantifiable Results */}
                {project.results && project.results.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
                      Quantified Business Outcomes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(project.results || []).map((res, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-center gap-2 text-xs text-emerald-300 font-medium">
                          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Want similar efficiency for your operations?</span>
                  <button
                    onClick={() => {
                      onClose();
                      onRequestAction(`Consultation inspired by ${project.client} case study`);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
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
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-semibold font-mono">
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

                {article.coverImage && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800">
                    <img src={article.coverImage} alt={article.title} className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
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

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  {article.authorAvatar && (
                    <img src={article.authorAvatar} alt={article.author} className="w-10 h-10 rounded-full object-cover border border-slate-700" referrerPolicy="no-referrer" />
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

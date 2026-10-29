import React, { useState, useRef } from 'react';
import { 
  Globe, Plus, Edit, Trash2, CheckCircle2, 
  Eye, EyeOff, Layers, Sparkles, BookOpen, 
  Briefcase, Star, Users, Video, Image as ImageIcon, 
  Upload, X, Play, Code, List, Heading, Bold, AlertCircle
} from 'lucide-react';
import { 
  Service, Product, PortfolioProject, 
  Article, TeamMember, Testimonial 
} from '../../types.ts';
import { VideoPlayer } from '../common/RichMediaEmbed.tsx';

interface CmsViewProps {
  services?: Service[];
  products?: Product[];
  portfolio?: PortfolioProject[];
  articles?: Article[];
  team?: TeamMember[];
  testimonials?: Testimonial[];
  onSaveEntity: (entityType: string, id: string | null, data: any) => Promise<void>;
  onDeleteEntity: (entityType: string, id: string) => Promise<void>;
}

type CmsTab = 'services' | 'products' | 'portfolio' | 'articles' | 'team' | 'testimonials';

export const CmsView: React.FC<CmsViewProps> = ({
  services = [],
  products = [],
  portfolio = [],
  articles = [],
  team = [],
  testimonials = [],
  onSaveEntity,
  onDeleteEntity,
}) => {
  const [activeTab, setActiveTab] = useState<CmsTab>('services');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const safeServices = services || [];
  const safeProducts = products || [];
  const safePortfolio = portfolio || [];
  const safeArticles = articles || [];
  const safeTeam = team || [];
  const safeTestimonials = testimonials || [];

  // Form State for editor
  const [formData, setFormData] = useState<any>({});
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'services', label: 'Services', count: safeServices.length, icon: Layers },
    { id: 'products', label: 'Products', count: safeProducts.length, icon: Briefcase },
    { id: 'portfolio', label: 'Case Studies', count: safePortfolio.length, icon: Globe },
    { id: 'articles', label: 'Articles', count: safeArticles.length, icon: BookOpen },
    { id: 'team', label: 'Team', count: safeTeam.length, icon: Users },
    { id: 'testimonials', label: 'Testimonials', count: safeTestimonials.length, icon: Star },
  ];

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setNewGalleryUrl('');

    if (activeTab === 'services') {
      setFormData({
        title: '',
        category: 'Custom Software & Systems',
        shortDescription: '',
        fullDescription: '',
        features: 'High-Availability Deployment, Clustered Relational Database, Security Auditing',
        benefits: '100% IP Sovereignty, Zero Vendor Lock-in',
        videoUrl: '',
        galleryImages: [],
        displayOrder: safeServices.length + 1,
        isPublished: true,
      });
    } else if (activeTab === 'products') {
      setFormData({
        name: '',
        tagline: '',
        shortDescription: '',
        fullDescription: '',
        heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
        videoUrl: '',
        galleryImages: [],
        screenshots: [],
        features: 'Multi-Tenant Architecture, Role-Based Access, MySQL Clustered Storage',
        techStack: 'Node.js, Express, React, MySQL 8, Docker',
        pricingModel: 'Perpetual Enterprise License',
        industries: 'Commercial, Financial, Public Sector',
        demoUrl: '',
        isPublished: true,
        isFeatured: true,
      });
    } else if (activeTab === 'portfolio') {
      setFormData({
        title: '',
        client: '',
        industry: 'Fintech & Banking',
        featuredImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
        videoUrl: '',
        galleryImages: [],
        challenge: '',
        solution: '',
        results: '68% faster processing, 99.99% uptime',
        technologies: 'Node.js, MySQL 8, M-Pesa Daraja, Vite',
        isPublished: true,
        isFeatured: true,
      });
    } else if (activeTab === 'articles') {
      setFormData({
        title: '',
        slug: `tech-${Date.now()}`,
        category: 'Database Architecture',
        readTime: '6 min read',
        author: 'Lead Software Architect',
        authorRole: 'Chief Systems Architect',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
        videoUrl: '',
        galleryImages: [],
        summary: '',
        content: '### Architectural Overview\n\nExplain the system architecture, performance benchmarks, and core database design decisions here.\n\n#### Key Findings\n- Sub-second transaction settlement\n- Zero-trust RBAC authentication\n- Automated point-in-time disaster recovery',
        isPublished: true,
        publishedAt: new Date().toISOString().substring(0, 10),
      });
    } else if (activeTab === 'team') {
      setFormData({
        name: '',
        position: 'Senior Software Engineer',
        bio: '',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        skills: 'TypeScript, MySQL, Docker, System Architecture',
        displayOrder: safeTeam.length + 1,
        isActive: true,
      });
    } else if (activeTab === 'testimonials') {
      setFormData({
        clientName: '',
        position: 'Chief Technology Officer',
        organization: '',
        content: '',
        rating: 5,
        displayPriority: safeTestimonials.length + 1,
        isPublished: true,
      });
    }
  };

  const handleOpenEdit = (item: any) => {
    setIsCreating(false);
    setEditingItem(item);
    setNewGalleryUrl('');

    const copy = { ...item };
    if (Array.isArray(copy.features)) copy.features = copy.features.join(', ');
    if (Array.isArray(copy.benefits)) copy.benefits = copy.benefits.join(', ');
    if (Array.isArray(copy.techStack)) copy.techStack = copy.techStack.join(', ');
    if (Array.isArray(copy.industries)) copy.industries = copy.industries.join(', ');
    if (Array.isArray(copy.results)) copy.results = copy.results.join(', ');
    if (Array.isArray(copy.technologies)) copy.technologies = copy.technologies.join(', ');
    if (Array.isArray(copy.skills)) copy.skills = copy.skills.join(', ');
    
    // Normalize gallery images
    if (!copy.galleryImages) {
      copy.galleryImages = copy.screenshots || copy.gallery || [];
    }
    
    // Normalize published
    if (copy.isPublished === undefined && copy.published !== undefined) {
      copy.isPublished = copy.published;
    }

    setFormData(copy);
  };

  // Local file upload for cover / hero image
  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (activeTab === 'products') {
        setFormData((prev: any) => ({ ...prev, heroImage: dataUrl }));
      } else if (activeTab === 'portfolio') {
        setFormData((prev: any) => ({ ...prev, featuredImage: dataUrl }));
      } else if (activeTab === 'articles') {
        setFormData((prev: any) => ({ ...prev, coverImage: dataUrl }));
      } else if (activeTab === 'services') {
        setFormData((prev: any) => ({ ...prev, featuredImage: dataUrl }));
      } else if (activeTab === 'team') {
        setFormData((prev: any) => ({ ...prev, avatarUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Local file upload to add into gallery
  const handleGalleryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      const current = formData.galleryImages || [];
      setFormData((prev: any) => ({
        ...prev,
        galleryImages: [...current, dataUrl],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    const current = formData.galleryImages || [];
    setFormData((prev: any) => ({
      ...prev,
      galleryImages: [...current, newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev: any) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_: any, idx: number) => idx !== indexToRemove),
    }));
  };

  // Insert markdown snippet into content
  const handleInsertMarkdown = (prefix: string, suffix: string = '') => {
    const current = formData.content || '';
    setFormData((prev: any) => ({
      ...prev,
      content: `${current}\n${prefix}Content${suffix}`,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { ...formData };

    // Format array fields back to arrays
    ['features', 'benefits', 'techStack', 'industries', 'results', 'technologies', 'skills'].forEach(field => {
      if (typeof payload[field] === 'string') {
        payload[field] = payload[field].split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    });

    // Sync gallery and screenshots
    if (Array.isArray(payload.galleryImages)) {
      if (activeTab === 'products') {
        payload.screenshots = payload.galleryImages;
      } else if (activeTab === 'portfolio') {
        payload.gallery = payload.galleryImages;
      }
    }

    const id = editingItem ? editingItem.id : null;
    try {
      await onSaveEntity(activeTab, id, payload);
      setSaveSuccess(`Successfully saved ${payload.title || payload.name || activeTab}!`);
      setTimeout(() => setSaveSuccess(null), 3500);
      setEditingItem(null);
      setIsCreating(false);
    } catch (err: any) {
      alert(`Save error: ${err.message || 'Could not update'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <span>Content Management Hub (CMS)</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono border border-cyan-500/30">
              Live Two-Way Sync
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage public website copy, proprietary products, case studies, videos, photo galleries, and engineering insights. Updates reflect immediately on the public front end.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New {activeTab.slice(0, -1)}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{saveSuccess} The live public site has been refreshed.</span>
        </div>
      )}

      {/* Module Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as CmsTab);
                setEditingItem(null);
                setIsCreating(false);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* SERVICES */}
        {activeTab === 'services' && safeServices.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{item.category}</span>
                <div className="flex items-center gap-1.5">
                  {item.videoUrl && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${item.isPublished !== false ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {item.isPublished !== false ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.shortDescription || item.fullDescription}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-500">ID: {item.id}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDeleteEntity('services', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* PRODUCTS */}
        {activeTab === 'products' && safeProducts.map((item) => {
          const photoCount = ((item.screenshots || []).length) + ((item.galleryImages || []).length);
          return (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                {item.heroImage && (
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                    <img src={item.heroImage} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {item.videoUrl && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-amber-300 font-mono text-[10px] flex items-center gap-1 border border-amber-500/30">
                        <Video className="w-3 h-3 text-amber-400" />
                        <span>Video Walkthrough</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{item.pricingModel || 'Enterprise'}</span>
                  <div className="flex items-center gap-1.5">
                    {photoCount > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {photoCount} photos
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${item.isPublished !== false ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {item.isPublished !== false ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                <p className="text-xs text-cyan-300 mb-2 font-medium">{item.tagline}</p>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.shortDescription || item.fullDescription}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500">{item.slug}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDeleteEntity('products', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* PORTFOLIO / CASE STUDIES */}
        {activeTab === 'portfolio' && safePortfolio.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              {item.featuredImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                  <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {item.videoUrl && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-amber-300 font-mono text-[10px] flex items-center gap-1 border border-amber-500/30">
                      <Video className="w-3 h-3 text-amber-400" />
                      <span>Video</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{item.industry}</span>
                <span className="text-[10px] text-slate-400">{item.client}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.solution || item.shortSummary}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-500">{item.status || 'Completed'}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDeleteEntity('portfolio', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* ARTICLES */}
        {activeTab === 'articles' && safeArticles.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              {item.coverImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {item.videoUrl && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-amber-300 font-mono text-[10px] flex items-center gap-1 border border-amber-500/30">
                      <Video className="w-3 h-3 text-amber-400" />
                      <span>Video Lecture</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{item.category}</span>
                <span className="text-[10px] text-slate-400">{item.readTime}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.summary}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-500">{item.author}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDeleteEntity('articles', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* TEAM */}
        {activeTab === 'team' && safeTeam.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={item.avatarUrl || item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0" referrerPolicy="no-referrer" />
              <div>
                <h4 className="text-xs font-bold text-white">{item.name}</h4>
                <p className="text-[11px] text-cyan-400">{item.position || item.role}</p>
                <p className="text-[10px] text-slate-400">{item.department || 'Executive'}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 cursor-pointer">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDeleteEntity('team', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* TESTIMONIALS */}
        {activeTab === 'testimonials' && safeTestimonials.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {Array.from({ length: Math.max(1, item.rating || 5) }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic mb-3">&quot;{item.content || item.feedback}&quot;</p>
              <div className="text-xs font-bold text-white">{item.clientName}</div>
              <div className="text-[10px] text-slate-400">{item.position || item.clientTitle}, {item.organization || item.company}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
              <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDeleteEntity('testimonials', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* Editor Modal */}
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl text-left my-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Title */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                  <span>{isCreating ? `Add New ${activeTab.slice(0, -1)}` : `Edit ${activeTab.slice(0, -1)}`}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-400 text-slate-950 font-bold uppercase">
                    {activeTab}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Rich multimedia publishing: attach photos, video walkthroughs, and technical copy.</p>
              </div>

              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* Publication Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-white block">Publishing Status</span>
                  <span className="text-[11px] text-slate-400">Control visibility on the public website front end</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished !== false}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* SERVICES FORM */}
              {activeTab === 'services' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Service Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={formData.shortDescription || ''}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Technical Description</label>
                    <textarea
                      rows={4}
                      value={formData.fullDescription || ''}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Deliverables & Features (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.features || ''}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Strategic Benefits (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.benefits || ''}
                      onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Video Walkthrough / Architecture URL (YouTube, Vimeo, MP4)</label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or direct MP4 link"
                      value={formData.videoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                  </div>
                </>
              )}

              {/* PRODUCTS FORM */}
              {activeTab === 'products' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Platform / Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  
                  {/* Hero Cover Image with File Upload */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-semibold">Hero Cover Image URL</label>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo File</span>
                      </button>
                      <input
                        type="file"
                        ref={photoInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverPhotoUpload}
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.heroImage || ''}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                    {formData.heroImage && (
                      <div className="mt-2 relative aspect-video w-48 rounded-xl overflow-hidden border border-slate-800 bg-black">
                        <img src={formData.heroImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>

                  {/* Video URL with Live Preview */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Product Video Walkthrough / Demo URL (YouTube, Vimeo, Loom, MP4)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or MP4 link"
                      value={formData.videoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                    {formData.videoUrl && (
                      <div className="mt-2">
                        <VideoPlayer url={formData.videoUrl} title="Video Preview" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Short Summary</label>
                    <textarea
                      rows={2}
                      value={formData.shortDescription || ''}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Technical Description</label>
                    <textarea
                      rows={3}
                      value={formData.fullDescription || ''}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Features (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.features || ''}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Technology Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.techStack || ''}
                      onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Attached Photo Gallery */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-semibold">Attached Screenshots & Gallery Photos</label>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo to Gallery</span>
                      </button>
                      <input
                        type="file"
                        ref={galleryInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleGalleryPhotoUpload}
                      />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Add image URL..."
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryUrl}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>

                    {formData.galleryImages && formData.galleryImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {formData.galleryImages.map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-black group">
                            <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="absolute top-1 right-1 p-1 rounded bg-rose-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* PORTFOLIO / CASE STUDIES FORM */}
              {activeTab === 'portfolio' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Client Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.client || ''}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Industry</label>
                      <input
                        type="text"
                        value={formData.industry || ''}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Featured Cover Photo */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-semibold">Featured Image URL</label>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                      </button>
                      <input
                        type="file"
                        ref={photoInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverPhotoUpload}
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.featuredImage || ''}
                      onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                  </div>

                  {/* Video Case Study Link */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Video Case Study URL (YouTube, Vimeo, MP4)</label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or direct MP4 link"
                      value={formData.videoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                    {formData.videoUrl && (
                      <div className="mt-2">
                        <VideoPlayer url={formData.videoUrl} title="Video Case Study Preview" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Challenge</label>
                    <textarea
                      rows={2}
                      value={formData.challenge || ''}
                      onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Engineering Solution</label>
                    <textarea
                      rows={2}
                      value={formData.solution || ''}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Quantified Results (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.results || ''}
                      onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Technologies Used (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.technologies || ''}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Attached Gallery Images */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-semibold">Attached Field Proof & System Screenshots</label>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                      </button>
                      <input
                        type="file"
                        ref={galleryInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleGalleryPhotoUpload}
                      />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Add image URL..."
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryUrl}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>

                    {formData.galleryImages && formData.galleryImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {formData.galleryImages.map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-black group">
                            <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="absolute top-1 right-1 p-1 rounded bg-rose-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ARTICLES FORM */}
              {activeTab === 'articles' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Category</label>
                      <input
                        type="text"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Estimated Read Time</label>
                      <input
                        type="text"
                        value={formData.readTime || ''}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Cover Photo */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-semibold">Cover Image URL</label>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                      </button>
                      <input
                        type="file"
                        ref={photoInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverPhotoUpload}
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.coverImage || ''}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                  </div>

                  {/* Video Walkthrough / Lecture */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Video Lecture / Walkthrough URL (YouTube, Vimeo, MP4)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or direct MP4 link"
                      value={formData.videoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                    {formData.videoUrl && (
                      <div className="mt-2">
                        <VideoPlayer url={formData.videoUrl} title="Article Video Preview" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Summary Abstract</label>
                    <textarea
                      rows={2}
                      value={formData.summary || ''}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  {/* Rich Content Editor with Formatting Helpers */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-semibold">Article Content (Markdown)</label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('### ')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white font-mono text-[10px]"
                        >
                          Heading
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('**', '**')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white font-mono text-[10px]"
                        >
                          Bold
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('- ')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white font-mono text-[10px]"
                        >
                          Bullet
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('```\n', '\n```')}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white font-mono text-[10px]"
                        >
                          Code
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={7}
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none font-mono"
                    />
                  </div>

                  {/* Attached Gallery Diagrams */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-semibold">Architecture Diagrams & Schematics</label>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Diagram</span>
                      </button>
                      <input
                        type="file"
                        ref={galleryInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleGalleryPhotoUpload}
                      />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Add schematic URL..."
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryUrl}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>

                    {formData.galleryImages && formData.galleryImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {formData.galleryImages.map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-black group">
                            <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="absolute top-1 right-1 p-1 rounded bg-rose-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* TEAM FORM */}
              {activeTab === 'team' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Role / Position *</label>
                      <input
                        type="text"
                        required
                        value={formData.position || formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-semibold">Avatar Image URL</label>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                      </button>
                      <input
                        type="file"
                        ref={photoInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverPhotoUpload}
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.avatarUrl || formData.avatar || ''}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value, avatar: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Professional Bio</label>
                    <textarea
                      rows={3}
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </>
              )}

              {/* TESTIMONIALS FORM */}
              {activeTab === 'testimonials' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Client Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.clientName || ''}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Company / Organization *</label>
                      <input
                        type="text"
                        required
                        value={formData.organization || formData.company || ''}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Executive Feedback Quote *</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.content || formData.feedback || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value, feedback: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save & Publish to Front End'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Globe, Plus, Edit, Trash2, CheckCircle2, 
  Eye, EyeOff, Layers, Sparkles, BookOpen, 
  Briefcase, Star, Users 
} from 'lucide-react';
import { 
  Service, Product, PortfolioProject, 
  Article, TeamMember, Testimonial 
} from '../../types.ts';

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

  const safeServices = services || [];
  const safeProducts = products || [];
  const safePortfolio = portfolio || [];
  const safeArticles = articles || [];
  const safeTeam = team || [];
  const safeTestimonials = testimonials || [];

  // Form State for generic editor
  const [formData, setFormData] = useState<any>({});

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
    if (activeTab === 'services') {
      setFormData({
        title: '',
        category: 'Custom Software & Systems',
        shortDescription: '',
        fullDescription: '',
        features: 'MySQL Architecture, High-Availability Deployment, Security Audit',
        benefits: '100% IP Sovereignty, Zero Vendor Lock-in',
        orderIndex: services.length + 1,
        published: true,
      });
    } else if (activeTab === 'products') {
      setFormData({
        name: '',
        tagline: '',
        shortDescription: '',
        fullDescription: '',
        features: 'Multi-Tenant Architecture, Role-Based Access, MySQL Clustered Storage',
        techStack: 'Node.js, Express, React, MySQL, Docker',
        pricingModel: 'Perpetual Enterprise License',
        industries: 'Property, Education, Enterprise',
        published: true,
      });
    } else if (activeTab === 'portfolio') {
      setFormData({
        title: '',
        client: '',
        industry: 'Fintech & Banking',
        challenge: '',
        solution: '',
        results: '68% faster processing, 99.99% uptime',
        technologies: 'Node.js, MySQL 8, M-Pesa Daraja, Vite',
        published: true,
      });
    } else if (activeTab === 'articles') {
      setFormData({
        title: '',
        slug: `tech-${Date.now()}`,
        summary: '',
        content: '',
        author: 'Lead Software Architect',
        category: 'Database Architecture',
        readTime: '6 min read',
        published: true,
      });
    } else if (activeTab === 'team') {
      setFormData({
        name: '',
        role: 'Senior Software Engineer',
        department: 'Engineering',
        bio: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        orderIndex: team.length + 1,
      });
    } else if (activeTab === 'testimonials') {
      setFormData({
        clientName: '',
        clientTitle: 'Chief Technology Officer',
        company: '',
        feedback: '',
        rating: 5,
        serviceDelivered: 'Custom Software Platform',
        featured: true,
      });
    }
  };

  const handleOpenEdit = (item: any) => {
    setIsCreating(false);
    setEditingItem(item);
    // Convert arrays to comma-separated strings for easy editing
    const copy = { ...item };
    if (Array.isArray(copy.features)) copy.features = copy.features.join(', ');
    if (Array.isArray(copy.benefits)) copy.benefits = copy.benefits.join(', ');
    if (Array.isArray(copy.techStack)) copy.techStack = copy.techStack.join(', ');
    if (Array.isArray(copy.industries)) copy.industries = copy.industries.join(', ');
    if (Array.isArray(copy.results)) copy.results = copy.results.join(', ');
    if (Array.isArray(copy.technologies)) copy.technologies = copy.technologies.join(', ');
    setFormData(copy);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };

    // Format array fields back to arrays
    ['features', 'benefits', 'techStack', 'industries', 'results', 'technologies'].forEach(field => {
      if (typeof payload[field] === 'string') {
        payload[field] = payload[field].split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    });

    const id = editingItem ? editingItem.id : null;
    await onSaveEntity(activeTab, id, payload);
    setEditingItem(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Content Management Hub (CMS)
          </h2>
          <p className="text-xs text-slate-400">
            Manage public website copy, capabilities, proprietary products, case studies, and engineering insights.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New {activeTab.slice(0, -1)}</span>
        </button>
      </div>

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
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{item.category}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] ${item.published ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  {item.published ? 'Live' : 'Draft'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.shortDescription}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
              <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDeleteEntity('services', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* PRODUCTS */}
        {activeTab === 'products' && safeProducts.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{item.pricingModel}</span>
                <span className="text-[10px] text-slate-400">{(item.industries || []).join(', ')}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
              <p className="text-xs text-cyan-300 mb-2">{item.tagline}</p>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.shortDescription}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
              <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDeleteEntity('products', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* PORTFOLIO */}
        {activeTab === 'portfolio' && safePortfolio.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{item.industry}</span>
                <span className="text-[10px] text-slate-400">{item.client}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.solution}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
              <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDeleteEntity('portfolio', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* ARTICLES */}
        {activeTab === 'articles' && safeArticles.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{item.category}</span>
                <span className="text-[10px] text-slate-400">{item.readTime}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.summary}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
              <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDeleteEntity('articles', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* TEAM */}
        {activeTab === 'team' && safeTeam.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0" referrerPolicy="no-referrer" />
              <div>
                <h4 className="text-xs font-bold text-white">{item.name}</h4>
                <p className="text-[11px] text-cyan-400">{item.role}</p>
                <p className="text-[10px] text-slate-400">{item.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDeleteEntity('team', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400">
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
              <p className="text-xs text-slate-300 italic mb-3">"{item.feedback}"</p>
              <div className="text-xs font-bold text-white">{item.clientName}</div>
              <div className="text-[10px] text-slate-400">{item.clientTitle}, {item.company}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
              <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDeleteEntity('testimonials', item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* Editor Modal */}
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl text-left my-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h3 className="text-base font-display font-bold text-white">
                {isCreating ? `Add New ${activeTab.slice(0, -1)}` : `Edit ${activeTab.slice(0, -1)}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* Dynamic inputs based on activeTab */}
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
                </>
              )}

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
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Summary</label>
                    <textarea
                      rows={2}
                      value={formData.shortDescription || ''}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
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
                </>
              )}

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
                </>
              )}

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
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Summary</label>
                    <textarea
                      rows={2}
                      value={formData.summary || ''}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Article Content (Markdown / Text)</label>
                    <textarea
                      rows={6}
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none font-mono"
                    />
                  </div>
                </>
              )}

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
                      <label className="block text-slate-300 font-semibold mb-1">Role *</label>
                      <input
                        type="text"
                        required
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Bio</label>
                    <textarea
                      rows={3}
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </>
              )}

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
                      <label className="block text-slate-300 font-semibold mb-1">Company *</label>
                      <input
                        type="text"
                        required
                        value={formData.company || ''}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Executive Feedback Quote</label>
                    <textarea
                      rows={3}
                      value={formData.feedback || ''}
                      onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
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
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

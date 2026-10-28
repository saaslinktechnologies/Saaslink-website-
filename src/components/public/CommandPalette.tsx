import React, { useState, useEffect } from 'react';
import { 
  Search, Terminal, ArrowRight, ShieldCheck, 
  Layers, Code, Cpu, Database, Cloud, 
  Sparkles, ExternalLink, X, Check, Copy 
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onOpenQuote: () => void;
  onOpenApiSandbox: () => void;
  accentTheme: 'gold' | 'cyber';
  onToggleTheme: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenQuote,
  onOpenApiSandbox,
  accentTheme,
  onToggleTheme,
}) => {
  const [query, setQuery] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or shortcut
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'quote',
      category: 'Actions',
      title: 'Schedule an Architecture Scoping Session',
      subtitle: '30-minute discovery call with Senior Systems Architect',
      icon: ArrowRight,
      run: () => { onClose(); onOpenQuote(); },
    },
    {
      id: 'api-sandbox',
      category: 'Developer Tools',
      title: 'Open Interactive API Documentation & Sandbox',
      subtitle: 'Live endpoint tester, cURL copy, and JSON latency response',
      icon: Terminal,
      run: () => { onClose(); onOpenApiSandbox(); },
    },
    {
      id: 'theme-toggle',
      category: 'Appearance',
      title: `Switch Accent Glow (Current: ${accentTheme === 'gold' ? 'Spruce & Radiant Gold' : 'Cyber Neon Blue/Violet'})`,
      subtitle: 'Toggle between enterprise gold and cyber-minimalist neon aesthetic',
      icon: Sparkles,
      run: () => { onToggleTheme(); },
    },
    {
      id: 'copy-curl',
      category: 'Developer Tools',
      title: 'Copy Health Probe cURL',
      subtitle: 'curl -X GET https://api.saaslink.tech/health',
      icon: Code,
      run: () => {
        navigator.clipboard.writeText('curl -s https://api.saaslink.tech/api/health');
        setCopiedSnippet(true);
        setTimeout(() => setCopiedSnippet(false), 2000);
      },
    },
    {
      id: 'nav-industries',
      category: 'Navigation',
      title: 'Explore Industries We Serve',
      subtitle: 'Financial Services, Healthcare, Real Estate, Logistics & NGOs',
      icon: ShieldCheck,
      run: () => { onClose(); onNavigate('industries'); },
    },
    {
      id: 'nav-solutions',
      category: 'Navigation',
      title: 'Explore Enterprise Solutions',
      subtitle: 'ERP Suite, CRM, EMIS, PropCloud360 & Applied AI',
      icon: Layers,
      run: () => { onClose(); onNavigate('solutions'); },
    },
    {
      id: 'nav-stack',
      category: 'Navigation',
      title: 'Inspect Technology Matrix & Stack',
      subtitle: 'React, Node.js, Go, Python, AWS, Kubernetes & MySQL/Postgres',
      icon: Cpu,
      run: () => { onClose(); onNavigate('services'); },
    },
    {
      id: 'nav-careers',
      category: 'Navigation',
      title: 'View Engineering Careers & Open Roles',
      subtitle: '6 open positions in Nairobi HQ and remote-friendly squads',
      icon: ExternalLink,
      run: () => { onClose(); onNavigate('careers'); },
    },
    {
      id: 'nav-faqs',
      category: 'Navigation',
      title: 'View Engineering FAQs',
      subtitle: '100% IP Ownership, delivery timelines & DPA compliance',
      icon: ShieldCheck,
      run: () => { onClose(); onNavigate('faqs'); },
    },
  ];

  const filteredActions = actions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-fade-up">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-[oklch(0.24_0.035_165)] shadow-2xl overflow-hidden text-slate-100">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-black/25">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search (e.g. 'API', 'scoping', 'stack', 'careers')..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/10 rounded border border-white/10">
            ESC
          </kbd>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-white/5 p-2">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching commands or routes found for &quot;{query}&quot;
            </div>
          ) : (
            filteredActions.map((action) => {
              const IconComp = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.run}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-[oklch(0.78_0.12_78)] group-hover:bg-[oklch(0.78_0.12_78)] group-hover:text-[oklch(0.22_0.03_165)] transition-colors">
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-[oklch(0.85_0.12_80)]">
                        {action.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {action.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                    {action.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>SaaSLink Command Terminal v3.10</span>
            {copiedSnippet && (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="h-3 w-3" /> Copied cURL
              </span>
            )}
          </div>
          <span>Press ↵ to run</span>
        </div>

      </div>
    </div>
  );
};

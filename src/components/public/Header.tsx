import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, ArrowRight, Building2, HeartPulse, Droplets, 
  Home, GraduationCap, Church, Scale, Code2, Cpu, CloudCog, 
  Gauge, Globe2, CheckCircle2, Menu, X, Layers, ShoppingBag
} from 'lucide-react';
import { GlobalSettings, NavigationItem, Product, Service } from '../../types.ts';

interface HeaderProps {
  settings?: GlobalSettings;
  navigation?: NavigationItem[];
  currentPage?: string;
  services?: Service[];
  products?: Product[];
  onOpenQuoteModal: (preselectedService?: string) => void;
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
  onSelectProduct?: (product: Product) => void;
  onSelectService?: (service: Service) => void;
}

// 8 core sector software platforms - Started with PropCloud360 and Pijo Shop as requested
const PLATFORMS = [
  {
    id: 'prd_propcloud',
    name: 'PropCloud360',
    slug: 'propcloud360',
    category: 'Commercial & Property',
    sector: 'Real Estate & Properties',
    desc: 'Property operating system, automated tenant lease agreements, and automated M-Pesa rent reconciliation.',
    icon: Home,
  },
  {
    id: 'prd_pijoshop',
    name: 'Pijo Shop (app.pijo.shop)',
    slug: 'pijo-shop',
    category: 'Fashion & Retail Commerce',
    sector: 'Footwear & Fashion SMEs',
    desc: 'Automated shoe & fashion matrix inventory, barcode POS, and multi-channel marketplace at app.pijo.shop.',
    icon: ShoppingBag,
  },
  {
    id: 'prd_masuma',
    name: 'MASUMA ERP System',
    slug: 'masuma-erp',
    category: 'Commercial & Trade',
    sector: 'Wholesale & Automotive',
    desc: 'Multi-branch ERP with multi-warehouse inventory, chassis/VIN search, and native KRA eTIMS QR tax invoicing.',
    icon: Building2,
  },
  {
    id: 'prd_raphamis',
    name: 'RaphaMIS Hospital Core',
    slug: 'raphamis-hmis',
    category: 'Healthcare & Public',
    sector: 'Hospitals & Medical Centers',
    desc: 'Inpatient/outpatient EHR, digital clinical triage, SHA / NHIF insurance reconciliation, and pharmacy POS dispenser.',
    icon: HeartPulse,
  },
  {
    id: 'prd_aura',
    name: 'Aura Utility Management',
    slug: 'aura-utilities',
    category: 'Healthcare & Public',
    sector: 'Water & Power Utilities',
    desc: 'STS smart water meter billing, automated M-Pesa token vending, automated valve cutoffs, and NRW containment.',
    icon: Droplets,
  },
  {
    id: 'prd_emis',
    name: 'EMIS Education System',
    slug: 'emis-education',
    category: 'Healthcare & Public',
    sector: 'Schools & Colleges',
    desc: 'CBC competency report cards, instant M-Pesa fee receipts, biometric gate attendance, and parent SMS alerts.',
    icon: GraduationCap,
  },
  {
    id: 'prd_ecclesiah',
    name: 'Ecclesiah Church System',
    slug: 'ecclesiah-church',
    category: 'Institutions & Faith',
    sector: 'Churches & Dioceses',
    desc: 'Parish & diocese administration, tithes & sadaka automated M-Pesa matching, and building pledge (harambee) tracking.',
    icon: Church,
  },
  {
    id: 'prd_hakihali',
    name: 'Haki Hali Civic Platform',
    slug: 'haki-hali-civic',
    category: 'Institutions & Faith',
    sector: 'Non-Profits & Civic Bodies',
    desc: 'County budget transparency tracking, anonymous whistleblowing, citizen surveys, and donor M&E metrics.',
    icon: Scale,
  },
];

// 5 core engineering services
const SERVICES_LIST = [
  {
    id: 'srv_01',
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    desc: 'Purpose-built web, mobile, and backend platforms engineered for Kenyan corporates, non-profits, healthcare, and faith institutions.',
    icon: Code2,
  },
  {
    id: 'srv_02',
    title: 'Process Automation & Paperless Operations',
    slug: 'process-automation-digital',
    desc: 'Eliminate manual vouchers, physical receipt books, and Excel chaos with automated approval workflows and M-Pesa reconciliation.',
    icon: Cpu,
  },
  {
    id: 'srv_03',
    title: 'Corporate, NGO & Institutional Portals',
    slug: 'corporate-ngo-institutional-portals',
    desc: 'High-converting, accessible, CMS-driven web platforms built for investor relations, donor reporting, and institutional authority.',
    icon: Globe2,
  },
  {
    id: 'srv_04',
    title: 'Cloud Architecture & Deployment',
    slug: 'cloud-architecting-deployment',
    desc: 'High-availability infrastructure on AWS, Google Cloud, and African regional data centers with automated failover and CI/CD pipelines.',
    icon: CloudCog,
  },
  {
    id: 'srv_05',
    title: 'Systems Optimization & Performance',
    slug: 'systems-optimization-performance',
    desc: 'Sub-second database query tuning, high-concurrency throughput scaling, and legacy software codebase refactoring.',
    icon: Gauge,
  },
];

const SECTORS_LIST = [
  {
    id: 'sec_corporate',
    name: 'Corporates & Commercial Trade',
    desc: 'Wholesale distributors, automotive supply chains, and multi-location retail with KRA eTIMS and warehouse sync.',
    icon: Building2,
  },
  {
    id: 'sec_healthcare',
    name: 'Hospitals & Healthcare Facilities',
    desc: 'Level 4 & 5 hospitals, clinics, and health networks with SHA / NHIF insurance reconciliation and inpatient EHR.',
    icon: HeartPulse,
  },
  {
    id: 'sec_utilities',
    name: 'Water Companies & Public Utilities',
    desc: 'Prepaid smart water meters, automated M-Pesa token vending, and non-revenue water telemetry.',
    icon: Droplets,
  },
  {
    id: 'sec_ngos',
    name: 'Non-Profits, NGOs & Civic Bodies',
    desc: 'Humanitarian aid, civic governance, donor accountability tracking, M&E analytics, and public oversight.',
    icon: Scale,
  },
  {
    id: 'sec_churches',
    name: 'Religious Entities & Dioceses',
    desc: 'Multi-service congregation records, automated tithes & sadaka reconciliation, and building funds.',
    icon: Church,
  },
  {
    id: 'sec_education',
    name: 'Educational Institutions & Colleges',
    desc: 'K-12 academies and tertiary colleges managing CBC grading, instant M-Pesa fee receipts, and parent portals.',
    icon: GraduationCap,
  },
];

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentPage = 'home',
  services = [],
  products = [],
  onOpenQuoteModal,
  onOpenAdmin,
  onNavigateSection,
  onSelectProduct,
  onSelectService,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'platforms' | 'services' | 'sectors' | 'company' | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (menu: 'platforms' | 'services' | 'sectors' | 'company') => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleNavClick = (target: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    onNavigateSection(target);
  };

  const handleProductSelect = (slug: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    const found = products.find(p => p.slug === slug || p.id === slug) ||
      PLATFORMS.find(p => p.slug === slug || p.id === slug);
    if (found && onSelectProduct) {
      onSelectProduct(found as any);
    } else {
      onNavigateSection('solutions');
    }
  };

  const handleServiceSelect = (slug: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    const found = services.find(s => s.slug === slug || s.id === slug) ||
      SERVICES_LIST.find(s => s.slug === slug || s.id === slug);
    if (found && onSelectService) {
      onSelectService(found as any);
    } else {
      onNavigateSection('services');
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header 
      className="sticky top-0 z-50 bg-[oklch(0.24_0.035_165/0.92)] backdrop-blur-xl border-b border-white/10 transition-colors"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Identity with Original Spruce & Champagne Gold Kit - Fluid Mobile Auto-Resizing */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0 flex-1 mr-2"
          >
            {/* Signature Gold Monogram Emblem with Dynamic Logo Support */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-[oklch(0.85_0.14_85)] via-[oklch(0.78_0.12_78)] to-[oklch(0.68_0.13_65)] p-0.5 shadow-gold shrink-0">
              <div className="w-full h-full bg-[oklch(0.22_0.03_165)] rounded-[7px] sm:rounded-[9px] flex items-center justify-center transition-colors group-hover:bg-[oklch(0.26_0.035_165)] overflow-hidden">
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.companyName || 'SaaSLink Technologies'}
                    className="w-full h-full object-contain p-0.5 sm:p-1 rounded-[6px] sm:rounded-[8px]"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                      const fallback = e.currentTarget.parentElement?.querySelector('.header-logo-fallback');
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`header-logo-fallback items-center justify-center ${settings?.logoUrl ? 'hidden' : 'flex'}`}>
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[oklch(0.85_0.14_85)]" />
                </div>
              </div>
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-baseline gap-1 sm:gap-1.5 leading-tight flex-wrap sm:flex-nowrap">
                <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white font-sans whitespace-nowrap">
                  SaaS<span className="text-gradient-gold">Link</span>
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-[oklch(0.85_0.12_80)] font-sans tracking-wide whitespace-nowrap">
                  Technologies
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden md:block truncate">
                {settings?.companyTagline || settings?.tagline || 'Software & Cloud Systems'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            
            {/* 1. Platforms Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('platforms')}
            >
              <button
                onClick={() => setActiveDropdown(prev => prev === 'platforms' ? null : 'platforms')}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  activeDropdown === 'platforms'
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Platforms</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                  activeDropdown === 'platforms' ? 'rotate-180 text-white' : ''
                }`} />
              </button>

              {activeDropdown === 'platforms' && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[840px] bg-[oklch(0.22_0.035_165/0.98)] border border-white/12 rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter('platforms')}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
                        Production Sector Softwares
                      </h4>
                      <p className="text-sm text-slate-200 mt-0.5">
                        Hardened software suites built for real-world Kenyan operations.
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavClick('solutions')}
                      className="text-xs font-semibold text-[oklch(0.85_0.12_80)] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>View All Platform Specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-5">
                    
                    {/* Commercial */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Commercial & Trade
                      </p>
                      {PLATFORMS.filter(p => p.category === 'Commercial & Trade').map(p => {
                        const Icon = p.icon;
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleProductSelect(p.slug)}
                            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[oklch(0.78_0.12_78/0.4)] transition-all cursor-pointer group/item"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center shrink-0 mt-0.5">
                                <Icon className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)]" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-xs font-semibold text-white group-hover/item:text-[oklch(0.85_0.12_80)] transition-colors">
                                  {p.name}
                                </h5>
                                <p className="text-[11px] text-slate-400 leading-snug mt-1 line-clamp-2">
                                  {p.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Healthcare & Utilities */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Health, Education & Utilities
                      </p>
                      {PLATFORMS.filter(p => p.category === 'Healthcare & Public').map(p => {
                        const Icon = p.icon;
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleProductSelect(p.slug)}
                            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[oklch(0.78_0.12_78/0.4)] transition-all cursor-pointer group/item"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center shrink-0 mt-0.5">
                                <Icon className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)]" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-xs font-semibold text-white group-hover/item:text-[oklch(0.85_0.12_80)] transition-colors">
                                  {p.name}
                                </h5>
                                <p className="text-[11px] text-slate-400 leading-snug mt-1 line-clamp-2">
                                  {p.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Non-Profits & Faith */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Churches & Civic Bodies
                      </p>
                      {PLATFORMS.filter(p => p.category === 'Institutions & Faith').map(p => {
                        const Icon = p.icon;
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleProductSelect(p.slug)}
                            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[oklch(0.78_0.12_78/0.4)] transition-all cursor-pointer group/item"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center shrink-0 mt-0.5">
                                <Icon className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)]" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-xs font-semibold text-white group-hover/item:text-[oklch(0.85_0.12_80)] transition-colors">
                                  {p.name}
                                </h5>
                                <p className="text-[11px] text-slate-400 leading-snug mt-1 line-clamp-2">
                                  {p.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Custom request callout */}
                      <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 mt-2">
                        <p className="text-xs font-semibold text-white">Need a bespoke platform?</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">We engineer custom software systems for unique operational requirements.</p>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            onOpenQuoteModal('Custom Enterprise System');
                          }}
                          className="mt-2 text-xs font-semibold text-[oklch(0.85_0.12_80)] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Request Scoping Session</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                    </div>

                  </div>

                  <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-4 text-slate-300">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)]" />
                        KRA eTIMS Validated
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)]" />
                        M-Pesa Daraja 2.0 Native
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)]" />
                        100% IP & Source Code Ownership
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavClick('solutions')}
                      className="font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Compare All Features →
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* 2. Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('services')}
            >
              <button
                onClick={() => setActiveDropdown(prev => prev === 'services' ? null : 'services')}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  activeDropdown === 'services'
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                  activeDropdown === 'services' ? 'rotate-180 text-white' : ''
                }`} />
              </button>

              {activeDropdown === 'services' && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[740px] bg-[oklch(0.22_0.035_165/0.98)] border border-white/12 rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter('services')}
                >
                  <div className="grid grid-cols-12 gap-6">
                    
                    {/* Services list */}
                    <div className="col-span-7 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)] mb-2">
                        Engineering Practices
                      </p>
                      {SERVICES_LIST.map((srv) => {
                        const Icon = srv.icon;
                        return (
                          <div
                            key={srv.id}
                            onClick={() => handleServiceSelect(srv.slug)}
                            className="p-2.5 rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer group/srv"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-lg bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center shrink-0 mt-0.5">
                                <Icon className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)]" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-xs font-semibold text-white group-hover/srv:text-[oklch(0.85_0.12_80)] transition-colors">
                                  {srv.title}
                                </h5>
                                <p className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-1">
                                  {srv.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Engineering Standards */}
                    <div className="col-span-5 flex flex-col justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-[oklch(0.85_0.12_80)] tracking-wider">
                          Engineering Assurances
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">
                          Enterprise Commitments
                        </h4>
                        
                        <div className="mt-3.5 space-y-2.5 text-xs text-slate-300">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5" />
                            <span>100% Client Source Code & IP Handover</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5" />
                            <span>Data Protection Act 2019 & ISO 27001 Standards</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5" />
                            <span>90-Day Post-Launch Warranty & Kenyan SLAs</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5" />
                            <span>Strict Automated CI/CD & Unit Test Coverage</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 mt-4">
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            onOpenQuoteModal('Custom Software Engineering');
                          }}
                          className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-gold hover:brightness-105 cursor-pointer"
                        >
                          <span>Request Engineering Scope</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 3. Sectors Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('sectors')}
            >
              <button
                onClick={() => setActiveDropdown(prev => prev === 'sectors' ? null : 'sectors')}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  activeDropdown === 'sectors'
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Sectors</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                  activeDropdown === 'sectors' ? 'rotate-180 text-white' : ''
                }`} />
              </button>

              {activeDropdown === 'sectors' && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[640px] bg-[oklch(0.22_0.035_165/0.98)] border border-white/12 rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter('sectors')}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
                        Operational Sectors
                      </h4>
                      <p className="text-sm text-slate-200 mt-0.5">
                        Deep domain architecture for Kenya and East Africa.
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavClick('industries')}
                      className="text-xs font-semibold text-[oklch(0.85_0.12_80)] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Explore Sector Blueprints</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {SECTORS_LIST.map((sec) => {
                      const Icon = sec.icon;
                      return (
                        <div
                          key={sec.id}
                          onClick={() => handleNavClick('industries')}
                          className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[oklch(0.78_0.12_78/0.4)] transition-all cursor-pointer group/sec"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)]" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-xs font-semibold text-white group-hover/sec:text-[oklch(0.85_0.12_80)] transition-colors">
                                {sec.name}
                              </h5>
                              <p className="text-[11px] text-slate-400 leading-snug mt-1 line-clamp-2">
                                {sec.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <button
              onClick={() => handleNavClick('portfolio')}
              className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === 'portfolio'
                  ? 'text-white bg-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Case Studies
            </button>

            {/* Company Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('company')}
            >
              <button
                onClick={() => setActiveDropdown(prev => prev === 'company' ? null : 'company')}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  activeDropdown === 'company'
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Company</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                  activeDropdown === 'company' ? 'rotate-180 text-white' : ''
                }`} />
              </button>

              {activeDropdown === 'company' && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[440px] bg-[oklch(0.22_0.035_165/0.98)] border border-white/12 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter('company')}
                >
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavClick('about')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-white/[0.08] transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">About SaaSLink</p>
                        <p className="text-[11px] text-slate-400">Our engineering ethos, track record, and Nairobi team.</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                    <button
                      onClick={() => handleNavClick('insights')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-white/[0.08] transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">Engineering Insights</p>
                        <p className="text-[11px] text-slate-400">Architecture articles, KRA eTIMS guides & tech radar.</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                    <button
                      onClick={() => handleNavClick('careers')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-white/[0.08] transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-white">Careers</p>
                          <span className="text-[9px] font-mono uppercase text-[oklch(0.85_0.12_80)]">We're Hiring</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Join our senior software squads in Nairobi.</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                    <button
                      onClick={() => handleNavClick('faqs')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-white/[0.08] transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">Technical FAQs</p>
                        <p className="text-[11px] text-slate-400">Source code ownership, delivery timelines & security.</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10 px-2.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Westlands, Nairobi, Kenya</span>
                    <span className="text-slate-300 font-mono">+254 700 000 000</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === 'contact'
                  ? 'text-white bg-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Contact
            </button>

          </nav>

          {/* Desktop Right Action Buttons (1024px+) */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Subtle Client Portal Link */}
            <button
              onClick={onOpenAdmin}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Client Portal
            </button>

            {/* Primary CTA in Signature Champagne Gold */}
            <button
              onClick={() => onOpenQuoteModal()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-semibold px-3.5 py-1.5 text-xs transition-all shadow-gold hover:brightness-105 cursor-pointer"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tablet & Mobile Action Controls (<1024px) */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] shadow-gold flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="sm:hidden">Consult</span>
              <span className="hidden sm:inline">Schedule Consultation</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors flex items-center justify-center shrink-0"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[oklch(0.85_0.12_80)]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[oklch(0.24_0.035_165)] p-4 sm:p-5 space-y-2.5 max-h-[85vh] overflow-y-auto">
          
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/5 active:bg-white/10 transition-colors flex items-center"
          >
            Home
          </button>

          {/* Platforms Accordion */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setMobileExpandedSection(prev => prev === 'platforms' ? null : 'platforms')}
              className="w-full min-h-[44px] px-4 py-3 text-left font-semibold text-sm text-white flex items-center justify-between bg-white/[0.04] active:bg-white/[0.08]"
            >
              <span>Platforms & Sector Software</span>
              <ChevronDown className={`w-4 h-4 text-[oklch(0.85_0.12_80)] transition-transform duration-200 ${
                mobileExpandedSection === 'platforms' ? 'rotate-180' : ''
              }`} />
            </button>
            {mobileExpandedSection === 'platforms' && (
              <div className="p-2.5 space-y-1.5 bg-black/25">
                {PLATFORMS.map(p => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleProductSelect(p.slug)}
                      className="p-3 rounded-xl hover:bg-white/10 active:bg-white/15 text-left cursor-pointer transition-colors flex items-start gap-3 border border-transparent hover:border-white/10"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-semibold text-white">{p.name}</p>
                          {p.slug === 'pijo-shop' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                              app.pijo.shop
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{p.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Services Accordion */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setMobileExpandedSection(prev => prev === 'services' ? null : 'services')}
              className="w-full min-h-[44px] px-4 py-3 text-left font-semibold text-sm text-white flex items-center justify-between bg-white/[0.04] active:bg-white/[0.08]"
            >
              <span>Services</span>
              <ChevronDown className={`w-4 h-4 text-[oklch(0.85_0.12_80)] transition-transform duration-200 ${
                mobileExpandedSection === 'services' ? 'rotate-180' : ''
              }`} />
            </button>
            {mobileExpandedSection === 'services' && (
              <div className="p-2.5 space-y-1.5 bg-black/25">
                {SERVICES_LIST.map(s => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleServiceSelect(s.slug)}
                      className="p-3 rounded-xl hover:bg-white/10 active:bg-white/15 text-left cursor-pointer transition-colors flex items-start gap-3 border border-transparent hover:border-white/10"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white">{s.title}</p>
                        <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('industries')}
            className="w-full text-left min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors flex items-center"
          >
            Sectors & Solutions
          </button>

          <button
            onClick={() => handleNavClick('portfolio')}
            className="w-full text-left min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors flex items-center"
          >
            Case Studies
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors flex items-center"
          >
            About & Team
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-left min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors flex items-center"
          >
            Contact
          </button>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-2.5 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-gold"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-lg border border-white/10 text-slate-400 text-xs text-center hover:text-white"
            >
              Client & Staff Portal Login
            </button>
          </div>

        </div>
      )}
    </header>
  );
};

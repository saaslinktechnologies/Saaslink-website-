import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/public/Header.tsx';
import { Hero } from './components/public/Hero.tsx';
import { ValueOutcomes } from './components/public/ValueOutcomes.tsx';
import { ServicesShowcase } from './components/public/ServicesShowcase.tsx';
import { ProductsShowcase } from './components/public/ProductsShowcase.tsx';
import { PortfolioShowcase } from './components/public/PortfolioShowcase.tsx';
import { ProcessSection } from './components/public/ProcessSection.tsx';
import { TechnologyMatrix } from './components/public/TechnologyMatrix.tsx';
import { TestimonialsSection } from './components/public/TestimonialsSection.tsx';
import { InsightsSection } from './components/public/InsightsSection.tsx';
import { AboutSection } from './components/public/AboutSection.tsx';
import { ContactSection } from './components/public/ContactSection.tsx';
import { Footer } from './components/public/Footer.tsx';
import { QuotationPlannerModal } from './components/public/QuotationPlannerModal.tsx';
import { PublicDetailModal } from './components/public/PublicDetailModal.tsx';
import { IndustriesPage } from './components/public/IndustriesPage.tsx';
import { SolutionsPage } from './components/public/SolutionsPage.tsx';
import { CareersPage } from './components/public/CareersPage.tsx';
import { FaqsPage } from './components/public/FaqsPage.tsx';
import { LegalPage } from './components/public/LegalPages.tsx';
import { CommandPalette } from './components/public/CommandPalette.tsx';
import { ApiSandboxModal } from './components/public/ApiSandboxModal.tsx';

// Admin components
import { AdminLayout, AdminSection } from './components/admin/AdminLayout.tsx';
import { DashboardView } from './components/admin/DashboardView.tsx';
import { LeadsView } from './components/admin/LeadsView.tsx';
import { ClientsView } from './components/admin/ClientsView.tsx';
import { QuotationsView } from './components/admin/QuotationsView.tsx';
import { InvoicesView } from './components/admin/InvoicesView.tsx';
import { ReceiptsView } from './components/admin/ReceiptsView.tsx';
import { ProjectsView } from './components/admin/ProjectsView.tsx';
import { CmsView } from './components/admin/CmsView.tsx';
import { MediaView } from './components/admin/MediaView.tsx';
import { SettingsView } from './components/admin/SettingsView.tsx';
import { DatabaseView } from './components/admin/DatabaseView.tsx';
import { AuditLogsView } from './components/admin/AuditLogsView.tsx';
import { LoginModal } from './components/admin/LoginModal.tsx';

import { 
  User, RoleName, GlobalSettings, Service, Product, 
  PortfolioProject, Article, TeamMember, Testimonial, 
  Client, Lead, Quotation, Invoice, Payment, Project, 
  DashboardMetrics, MediaItem, AuditLog, PublicPage 
} from './types.ts';

export default function App() {
  // Mode: 'public' or 'admin'
  const [currentMode, setCurrentMode] = useState<'public' | 'admin'>('public');
  const [currentPublicPage, setCurrentPublicPage] = useState<PublicPage>('home');
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Public Interaction Modals
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quotePreselectedService, setQuotePreselectedService] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isApiSandboxOpen, setIsApiSandboxOpen] = useState(false);
  const [accentTheme, setAccentTheme] = useState<'gold' | 'cyber'>('gold');

  const [detailModalType, setDetailModalType] = useState<'service' | 'product' | 'case_study' | 'article' | null>(null);
  const [detailModalItem, setDetailModalItem] = useState<any | null>(null);

  // Global Keyboard Shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Public & Operational Data
  const [settings, setSettings] = useState<GlobalSettings>({
    companyName: 'SaaSLink Technologies Ltd',
    tagline: 'Software & Cloud Systems',
    companyTagline: 'Software & Cloud Systems',
    description: 'SaaSLink Technologies Ltd is a premier enterprise digital engineering partner architecting modern software platforms, cloud ecosystems, and intelligent business workflows.',
    email: 'contact@saaslink.tech',
    companyEmail: 'contact@saaslink.tech',
    phone: '+254 720 000 000 / +254 733 000 000',
    companyPhone: '+254 720 000 000 / +254 733 000 000',
    address: 'Delta Corner Tower, Westlands, Nairobi, Kenya',
    companyAddress: 'Delta Corner Tower, Westlands, Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    website: 'https://saaslink.tech',
    companyWebsite: 'https://saaslink.tech',
    logoUrl: '/assets/saaslink-logo.svg',
    taxId: 'P051982341Z',
    currency: 'USD',
    currencySymbol: '$',
    defaultTaxRate: 16,
    quotationPrefix: 'QUO-2026-',
    quotationNextSeq: 1004,
    invoicePrefix: 'INV-2026-',
    invoiceNextSeq: 1003,
    receiptPrefix: 'RCT-2026-',
    receiptNextSeq: 1003,
    paymentInstructions: 'Bank: Equity Bank Kenya Ltd\nAccount Name: SaaSLink Technologies Ltd\nAccount No: 0180293847561\nBranch: Westlands Supreme Centre\nSwift: EQBLKENA\n\nM-Pesa Business Paybill: 889900\nAccount: [Your Invoice Number]',
    termsAndConditions: 'All custom source code and architectural assets become 100% intellectual property of client upon final settlement. SaaSLink provides 90 days guaranteed bug-fix warranty on all production deployments.',
    privacyPolicy: 'SaaSLink Technologies Ltd enforces rigorous data confidentiality, ISO 27001-aligned information security, and GDPR-compliant record processing.',
    socials: {
      linkedin: 'https://linkedin.com/company/saaslink-technologies',
      twitter: 'https://x.com/saaslinktech',
      github: 'https://github.com/saaslink-technologies',
    },
    emailNotifications: {
      leadAlerts: true,
      quoteAlerts: true,
      paymentAlerts: true,
      alertEmail: 'operations@saaslink.tech',
    },
    defaultSeo: {
      metaTitle: 'SaaSLink Technologies | Enterprise Software & Cloud Platforms',
      metaDescription: 'Enterprise software engineering, cloud platforms, and intelligent business workflows.',
      ogImage: '/assets/og-cover.png',
      keywords: 'software, enterprise, cloud, engineering',
    },
    heroSection: {
      badge: 'Enterprise Engineering & Cloud Systems',
      headline: 'We engineer digital platforms that',
      highlightWord: 'accelerate business.',
      subheadline: 'SaaSLink Technologies builds robust software systems, mission-critical cloud infrastructure, and custom business platforms engineered for high reliability, scale, and commercial value.',
      ctaPrimaryText: 'Request a Quotation',
      ctaSecondaryText: 'Explore Our Work',
    },
  });

  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Admin Data State
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Pre-selected client when creating quote or invoice from CRM
  const [actionClient, setActionClient] = useState<Client | null>(null);

  // Load Public Content on Mount
  const fetchPublicContent = async () => {
    try {
      const res = await fetch('/api/public/content');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(prev => ({
            ...prev,
            ...data.settings,
            companyAddress: data.settings.companyAddress || data.settings.address || prev.companyAddress,
            companyEmail: data.settings.companyEmail || data.settings.email || prev.companyEmail,
            companyPhone: data.settings.companyPhone || data.settings.phone || prev.companyPhone,
            companyWebsite: data.settings.companyWebsite || data.settings.website || prev.companyWebsite,
            companyTagline: data.settings.companyTagline || data.settings.tagline || prev.companyTagline,
            address: data.settings.address || data.settings.companyAddress || prev.address,
            email: data.settings.email || data.settings.companyEmail || prev.email,
            phone: data.settings.phone || data.settings.companyPhone || prev.phone,
            website: data.settings.website || data.settings.companyWebsite || prev.website,
            tagline: data.settings.tagline || data.settings.companyTagline || prev.tagline,
            taxId: data.settings.taxId || prev.taxId,
          }));
        }
        setServices(data.services || []);
        setProducts(data.products || []);
        setPortfolio(data.portfolio || []);
        setArticles(data.articles || []);
        setTeam(data.team || []);
        setTestimonials(data.testimonials || []);
      }
    } catch (err) {
      console.error('Error fetching public content:', err);
    }
  };

  // Load Admin Data
  const fetchAdminData = async () => {
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
      
      const [
        metricsRes, leadsRes, clientsRes, quotesRes, 
        invoicesRes, paymentsRes, projectsRes, mediaRes, logsRes
      ] = await Promise.all([
        fetch('/api/admin/metrics', { headers }),
        fetch('/api/admin/leads', { headers }),
        fetch('/api/admin/clients', { headers }),
        fetch('/api/admin/quotations', { headers }),
        fetch('/api/admin/invoices', { headers }),
        fetch('/api/admin/payments', { headers }),
        fetch('/api/admin/projects', { headers }),
        fetch('/api/admin/media', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
      ]);

      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (clientsRes.ok) setClients(await clientsRes.json());
      if (quotesRes.ok) setQuotations(await quotesRes.json());
      if (invoicesRes.ok) setInvoices(await invoicesRes.json());
      if (paymentsRes.ok) setPayments(await paymentsRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (mediaRes.ok) setMedia(await mediaRes.json());
      if (logsRes.ok) setAuditLogs(await logsRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchPublicContent();
    // Default demo user for seamless evaluation
    setCurrentUser({
      id: 'usr-1',
      name: 'Dr. Arthur Omwamba',
      email: 'admin@saaslink.tech',
      role: 'Super Administrator',
      status: 'Active',
      createdAt: '2026-01-01',
    });

    // Hash and URL router sync
    const handleUrlRoute = () => {
      const raw = window.location.hash.replace('#', '') || window.location.pathname.replace(/^\//, '');
      const validPages = ['industries', 'solutions', 'careers', 'faqs', 'privacy', 'terms', 'cookies'];
      if (validPages.includes(raw)) {
        setCurrentPublicPage(raw as PublicPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (['services', 'products', 'portfolio', 'about', 'insights', 'contact'].includes(raw)) {
        setCurrentPublicPage('home');
        setTimeout(() => {
          const el = document.getElementById(raw);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setCurrentPublicPage('home');
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, []);

  useEffect(() => {
    if (currentMode === 'admin') {
      fetchAdminData();
    }
  }, [currentMode, authToken]);

  // Auth Handler
  const handleLoginSuccess = (token: string, user: User) => {
    setAuthToken(token);
    setCurrentUser(user);
    setCurrentMode('admin');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentMode('public');
  };

  const handleSwitchRole = (newRole: RoleName) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role: newRole });
    }
  };

  // Lead Handlers
  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => l.id === id ? updated : l));
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      setLeads(prev => prev.filter(l => l.id !== id));
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvertToClient = async (lead: Lead) => {
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/convert-to-client`, {
        method: 'POST',
      });
      if (res.ok) {
        const newClient = await res.json();
        setClients(prev => [newClient, ...prev]);
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Won' } : l));
        setAdminSection('clients');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Client Handlers
  const handleCreateClient = async (clientData: Partial<Client>) => {
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      if (res.ok) {
        const created = await res.json();
        setClients(prev => [created, ...prev]);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const res = await fetch(`/api/admin/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      if (res.ok) {
        const updated = await res.json();
        setClients(prev => prev.map(c => c.id === id ? updated : c));
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
      setClients(prev => prev.filter(c => c.id !== id));
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Quotation Handlers
  const handleCreateQuotation = async (data: any) => {
    try {
      const res = await fetch('/api/admin/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        setQuotations(prev => [created, ...prev]);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuotation = async (id: string, data: any) => {
    try {
      const res = await fetch(`/api/admin/quotations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setQuotations(prev => prev.map(q => q.id === id ? updated : q));
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvertToInvoice = async (quoteId: string) => {
    try {
      const res = await fetch(`/api/admin/quotations/${quoteId}/convert-to-invoice`, {
        method: 'POST',
      });
      if (res.ok) {
        const newInvoice = await res.json();
        setInvoices(prev => [newInvoice, ...prev]);
        setQuotations(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'Converted to Invoice' } : q));
        setAdminSection('invoices');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Invoice & Payment Handlers
  const handleCreateInvoice = async (data: any) => {
    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        setInvoices(prev => [created, ...prev]);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordPayment = async (data: any) => {
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { payment, invoice } = await res.json();
        setPayments(prev => [payment, ...prev]);
        setInvoices(prev => prev.map(i => i.id === invoice.id ? invoice : i));
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Project Handlers
  const handleCreateProject = async (data: any) => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        setProjects(prev => [created, ...prev]);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProject = async (id: string, data: any) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects(prev => prev.map(p => p.id === id ? updated : p));
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== id));
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (projectId: string, task: any) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (res.ok) {
        const updatedProj = await res.json();
        setProjects(prev => prev.map(p => p.id === projectId ? updatedProj : p));
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (projectId: string, taskId: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updatedProj = await res.json();
        setProjects(prev => prev.map(p => p.id === projectId ? updatedProj : p));
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CMS Handlers
  const handleSaveCmsEntity = async (entityType: string, id: string | null, data: any) => {
    try {
      const url = id ? `/api/admin/cms/${entityType}/${id}` : `/api/admin/cms/${entityType}`;
      const method = id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchPublicContent();
        await fetchAdminData();
      }
    } catch (err) {
      console.error('Error saving CMS entity:', err);
    }
  };

  const handleDeleteCmsEntity = async (entityType: string, id: string) => {
    try {
      await fetch(`/api/admin/cms/${entityType}/${id}`, { 
        method: 'DELETE',
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        }
      });
      await fetchPublicContent();
      await fetchAdminData();
    } catch (err) {
      console.error('Error deleting CMS entity:', err);
    }
  };

  // Media Handlers
  const handleAddMedia = async (item: Partial<MediaItem>) => {
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const created = await res.json();
        setMedia(prev => [created, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Settings Handler
  const handleSaveSettings = async (newSettings: Partial<GlobalSettings>) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(prev => ({ ...prev, ...updated }));
        fetchPublicContent();
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  // Navigation helper for public site supporting both dedicated pages and anchors
  const handleNavigateSection = (sectionId: string) => {
    const validPages: PublicPage[] = ['industries', 'solutions', 'careers', 'faqs', 'privacy', 'terms', 'cookies'];
    if (validPages.includes(sectionId as PublicPage)) {
      setCurrentPublicPage(sectionId as PublicPage);
      window.location.hash = sectionId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'home') {
      setCurrentPublicPage('home');
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Anchor on home page
    if (currentPublicPage !== 'home') {
      setCurrentPublicPage('home');
    }
    window.location.hash = sectionId;
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  const handleOpenQuotePlanner = (preselectedService: string = '') => {
    setQuotePreselectedService(preselectedService);
    setQuoteModalOpen(true);
  };

  const handleOpenDetailModal = (type: 'service' | 'product' | 'case_study' | 'article', item: any) => {
    setDetailModalType(type);
    setDetailModalItem(item);
  };

  // ADMIN MODE RENDER
  if (currentMode === 'admin') {
    const activeUser = currentUser || {
      id: 'usr-1',
      name: 'Administrator',
      email: 'admin@saaslink.tech',
      role: 'Super Administrator',
      status: 'Active',
      createdAt: '2026-01-01',
    };

    return (
      <AdminLayout
        currentUser={activeUser}
        settings={settings}
        activeSection={adminSection}
        onSelectSection={setAdminSection}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onViewPublicSite={() => setCurrentMode('public')}
      >
        {adminSection === 'dashboard' && (
          <DashboardView
            metrics={metrics}
            settings={settings}
            onNavigate={setAdminSection}
            onOpenNewQuote={() => setAdminSection('quotations')}
            onOpenNewInvoice={() => setAdminSection('invoices')}
            onOpenNewLead={() => setAdminSection('leads')}
            onOpenNewClient={() => setAdminSection('clients')}
          />
        )}

        {adminSection === 'leads' && (
          <LeadsView
            leads={leads}
            onUpdateLead={handleUpdateLead}
            onDeleteLead={handleDeleteLead}
            onConvertToClient={handleConvertToClient}
          />
        )}

        {adminSection === 'clients' && (
          <ClientsView
            clients={clients}
            quotations={quotations}
            invoices={invoices}
            payments={payments}
            projects={projects}
            onCreateClient={handleCreateClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onOpenNewQuoteForClient={(c) => {
              setActionClient(c);
              setAdminSection('quotations');
            }}
            onOpenNewInvoiceForClient={(c) => {
              setActionClient(c);
              setAdminSection('invoices');
            }}
          />
        )}

        {adminSection === 'quotations' && (
          <QuotationsView
            quotations={quotations}
            clients={clients}
            settings={settings}
            onCreateQuotation={handleCreateQuotation}
            onUpdateQuotation={handleUpdateQuotation}
            onConvertToInvoice={handleConvertToInvoice}
            initialClient={actionClient}
          />
        )}

        {adminSection === 'invoices' && (
          <InvoicesView
            invoices={invoices}
            clients={clients}
            settings={settings}
            onCreateInvoice={handleCreateInvoice}
            onRecordPayment={handleRecordPayment}
            initialClient={actionClient}
          />
        )}

        {adminSection === 'receipts' && (
          <ReceiptsView
            payments={payments}
            settings={settings}
          />
        )}

        {adminSection === 'projects' && (
          <ProjectsView
            projects={projects}
            clients={clients}
            onCreateProject={handleCreateProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
          />
        )}

        {adminSection === 'cms' && (
          <CmsView
            services={services}
            products={products}
            portfolio={portfolio}
            articles={articles}
            team={team}
            testimonials={testimonials}
            onSaveEntity={handleSaveCmsEntity}
            onDeleteEntity={handleDeleteCmsEntity}
          />
        )}

        {adminSection === 'media' && (
          <MediaView
            media={media}
            currentLogoUrl={settings?.logoUrl}
            onAddMedia={handleAddMedia}
            onDeleteMedia={handleDeleteMedia}
            onSetAsLogo={(url) => handleSaveSettings({ logoUrl: url })}
          />
        )}

        {adminSection === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}

        {adminSection === 'database' && (
          <DatabaseView />
        )}

        {adminSection === 'logs' && (
          <AuditLogsView logs={auditLogs} />
        )}
      </AdminLayout>
    );
  }

  // PUBLIC EXPERIENCE RENDER
  return (
    <div className="min-h-screen bg-[oklch(0.28_0.038_165)] text-slate-100 selection:bg-[oklch(0.78_0.12_78/0.35)] selection:text-white">
      
      {/* Header */}
      <Header
        settings={settings}
        currentPage={currentPublicPage}
        services={services}
        products={products}
        onSelectProduct={(p) => handleOpenDetailModal('product', p)}
        onSelectService={(s) => handleOpenDetailModal('service', s)}
        onOpenAdmin={() => {
          if (currentUser) {
            setCurrentMode('admin');
          } else {
            setLoginModalOpen(true);
          }
        }}
        onOpenQuoteModal={(preselected?: string) => handleOpenQuotePlanner(preselected)}
        onNavigateSection={handleNavigateSection}
      />

      {/* DEDICATED PAGE VIEWS */}
      {currentPublicPage === 'industries' && (
        <IndustriesPage
          settings={settings}
          onRequestQuote={(indName) => handleOpenQuotePlanner(indName)}
          onNavigateSection={handleNavigateSection}
        />
      )}

      {currentPublicPage === 'solutions' && (
        <SolutionsPage
          settings={settings}
          onRequestQuote={(solName) => handleOpenQuotePlanner(solName)}
          onNavigateSection={handleNavigateSection}
        />
      )}

      {currentPublicPage === 'careers' && (
        <CareersPage
          onNavigateSection={handleNavigateSection}
        />
      )}

      {currentPublicPage === 'faqs' && (
        <FaqsPage
          onNavigateSection={handleNavigateSection}
          onRequestQuote={() => handleOpenQuotePlanner()}
        />
      )}

      {(currentPublicPage === 'privacy' || currentPublicPage === 'terms' || currentPublicPage === 'cookies') && (
        <LegalPage
          pageType={currentPublicPage}
          onNavigateSection={handleNavigateSection}
          onRequestQuote={() => handleOpenQuotePlanner()}
        />
      )}

      {/* DEFAULT HOME EXPERIENCE */}
      {currentPublicPage === 'home' && (
        <>
          {/* Hero Section */}
          <Hero
            settings={settings}
            onOpenQuoteModal={(svc?: string) => handleOpenQuotePlanner(svc)}
            onExploreWork={() => handleNavigateSection('portfolio')}
            onExploreServices={() => handleNavigateSection('services')}
            onNavigateSection={handleNavigateSection}
          />

          {/* Value & Outcomes */}
          <ValueOutcomes 
            onScheduleScoping={() => handleOpenQuotePlanner('Architecture Scoping Session')}
          />

          {/* Services Showcase */}
          <div id="services">
            <ServicesShowcase
              services={services}
              onSelectService={(s) => handleOpenDetailModal('service', s)}
              onRequestQuote={(serviceTitle) => handleOpenQuotePlanner(serviceTitle)}
            />
          </div>

          {/* Proprietary Products & Solutions */}
          <div id="solutions">
            <ProductsShowcase
              products={products}
              onSelectProduct={(p) => handleOpenDetailModal('product', p)}
              onScheduleDemo={(productName) => handleOpenQuotePlanner(`Demo of ${productName}`)}
            />
          </div>

          {/* Portfolio & Case Studies */}
          <div id="portfolio">
            <PortfolioShowcase
              portfolio={portfolio}
              onSelectProject={(p) => handleOpenDetailModal('case_study', p)}
            />
          </div>

          {/* Engineering Process */}
          <div id="process">
            <ProcessSection />
          </div>

          {/* Technology & Architecture Matrix */}
          <TechnologyMatrix />

          {/* Testimonials */}
          <TestimonialsSection testimonials={testimonials} />

          {/* Engineering Insights */}
          <div id="insights">
            <InsightsSection
              articles={articles}
              onSelectArticle={(a) => handleOpenDetailModal('article', a)}
            />
          </div>

          {/* About Section */}
          <div id="about">
            <AboutSection 
              settings={settings}
              team={team}
              onOpenQuoteModal={() => handleOpenQuotePlanner()}
            />
          </div>

          {/* Contact & RFP Submission */}
          <div id="contact">
            <ContactSection
              settings={settings}
              services={services}
              initialService={quotePreselectedService}
              onOpenQuotePlanner={() => handleOpenQuotePlanner()}
            />
          </div>
        </>
      )}

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => {
          if (currentUser) {
            setCurrentMode('admin');
          } else {
            setLoginModalOpen(true);
          }
        }}
        onNavigateSection={handleNavigateSection}
        onOpenQuoteModal={() => handleOpenQuotePlanner()}
      />

      {/* Interactive Quotation Planner Modal */}
      <QuotationPlannerModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        settings={settings}
        preselectedService={quotePreselectedService}
      />

      {/* Interactive Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(page) => {
          handleNavigateSection(page);
          setIsCommandPaletteOpen(false);
        }}
        onOpenQuote={() => {
          setIsCommandPaletteOpen(false);
          handleOpenQuotePlanner();
        }}
        onOpenApiSandbox={() => {
          setIsCommandPaletteOpen(false);
          setIsApiSandboxOpen(true);
        }}
        accentTheme={accentTheme}
        onToggleTheme={() => setAccentTheme((prev) => (prev === 'gold' ? 'cyber' : 'gold'))}
      />

      {/* Dynamic API Documentation & Sandbox Modal */}
      <ApiSandboxModal
        isOpen={isApiSandboxOpen}
        onClose={() => setIsApiSandboxOpen(false)}
        onRequestQuote={() => {
          setIsApiSandboxOpen(false);
          handleOpenQuotePlanner('API Integration Architecture');
        }}
      />

      {/* Public Content Detail Modal */}
      <PublicDetailModal
        type={detailModalType}
        item={detailModalItem}
        onClose={() => {
          setDetailModalType(null);
          setDetailModalItem(null);
        }}
        onRequestAction={(title) => handleOpenQuotePlanner(title)}
      />

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

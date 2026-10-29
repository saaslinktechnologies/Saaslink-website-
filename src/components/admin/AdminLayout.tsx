import React, { useState } from 'react';
import { 
  LayoutDashboard, UserCheck, Users, FileText, 
  Receipt, CreditCard, FolderKanban, Globe, 
  Image, Settings, Database, History, LogOut, 
  ChevronRight, Menu, X, Shield, ArrowLeft, 
  Layers, Bell, RefreshCw 
} from 'lucide-react';
import { User, RoleName, GlobalSettings } from '../../types.ts';

export type AdminSection = 
  | 'dashboard' 
  | 'leads' 
  | 'clients' 
  | 'quotations' 
  | 'invoices' 
  | 'receipts' 
  | 'projects' 
  | 'cms' 
  | 'media' 
  | 'settings' 
  | 'database' 
  | 'logs';

interface AdminLayoutProps {
  currentUser: User;
  settings: GlobalSettings;
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onLogout: () => void;
  onSwitchRole: (role: RoleName) => void;
  onViewPublicSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  settings,
  activeSection,
  onSelectSection,
  onLogout,
  onSwitchRole,
  onViewPublicSite,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads & Inquiries', icon: UserCheck },
    { id: 'clients', label: 'Clients (360° CRM)', icon: Users },
    { id: 'quotations', label: 'Quotations Studio', icon: FileText },
    { id: 'invoices', label: 'Invoices & Billing', icon: CreditCard },
    { id: 'receipts', label: 'Official Receipts', icon: Receipt },
    { id: 'projects', label: 'Projects & Tasks', icon: FolderKanban },
    { id: 'cms', label: 'CMS Content Hub', icon: Globe },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'settings', label: 'Global Settings', icon: Settings },
    { id: 'database', label: 'MySQL Database Hub', icon: Database },
    { id: 'logs', label: 'Audit Activity Logs', icon: History },
  ];

  const roleOptions: RoleName[] = [
    'Super Administrator',
    'Administrator',
    'Manager',
    'Finance',
    'Sales',
    'Project Manager',
    'Content Editor',
    'Staff',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 overflow-hidden shrink-0">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.companyName || 'Logo'}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.admin-mobile-logo-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`admin-mobile-logo-fallback items-center justify-center ${settings?.logoUrl ? 'hidden' : 'flex'}`}>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-sm text-white">
              {settings?.companyName ? settings.companyName.split(' ')[0] : 'SaaSLink'} OS
            </span>
            <span className="text-[10px] text-cyan-400 block font-mono">Enterprise Console</span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Toggle navigation menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-30 md:hidden backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 md:bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                  {settings?.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt={settings.companyName || 'Logo'}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.admin-sidebar-logo-fallback');
                        if (fallback) (fallback as HTMLElement).style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`admin-sidebar-logo-fallback items-center justify-center ${settings?.logoUrl ? 'hidden' : 'flex'}`}>
                    <Layers className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="font-display font-bold text-sm text-white flex items-center gap-1">
                  <span>{settings?.companyName ? settings.companyName.split(' ')[0] : 'SaaSLink'}</span>
                  <span className="text-cyan-400">OS</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Enterprise Suite</p>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id as AdminSection);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-3 text-left">
          
          {/* User Profile Card */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-cyan-400" />
                <p className="text-[10px] text-cyan-400 font-medium truncate">{currentUser.role}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onViewPublicSite}
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              title="Return to public-facing website"
            >
              <ArrowLeft className="w-3 h-3 text-cyan-400" />
              <span>Website</span>
            </button>

            <button
              onClick={onLogout}
              className="py-1.5 px-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-900/50 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              title="Sign out of administration platform"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Operational Bar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-display font-bold text-white capitalize">
              {activeSection.replace('-', ' ')}
            </h1>
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              SaaSLink Enterprise
            </span>
          </div>

          {/* Right Controls: Role Switcher & Public Website */}
          <div className="flex items-center gap-3">
            
            {/* Quick Demo Role Switcher */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-cyan-400" />
                Role:
              </span>
              <select
                value={currentUser.role}
                onChange={(e) => onSwitchRole(e.target.value as RoleName)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-cyan-300 text-xs focus:outline-none cursor-pointer"
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <button
              onClick={onViewPublicSite}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">View Public Website</span>
              <span className="sm:hidden">Site</span>
            </button>
          </div>
        </header>

        {/* Content Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
};

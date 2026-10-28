export type RoleName = 
  | 'Super Administrator'
  | 'Administrator'
  | 'Manager'
  | 'Finance'
  | 'Sales'
  | 'Project Manager'
  | 'Content Editor'
  | 'Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  avatarUrl?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface GlobalSettings {
  companyName: string;
  tagline: string;
  companyTagline?: string;
  description: string;
  email: string;
  companyEmail?: string;
  phone: string;
  companyPhone?: string;
  address: string;
  companyAddress?: string;
  city: string;
  country: string;
  website: string;
  companyWebsite?: string;
  logoUrl: string;
  currency: string;
  currencySymbol: string;
  taxId?: string;
  defaultTaxRate: number;
  quotationPrefix: string;
  quotationNextSeq: number;
  invoicePrefix: string;
  invoiceNextSeq: number;
  receiptPrefix: string;
  receiptNextSeq: number;
  paymentInstructions: string;
  termsAndConditions: string;
  privacyPolicy: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
  };
  emailNotifications: {
    leadAlerts: boolean;
    quoteAlerts: boolean;
    paymentAlerts: boolean;
    alertEmail: string;
  };
  defaultSeo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    keywords: string;
  };
  heroSection: {
    badge: string;
    headline: string;
    highlightWord: string;
    subheadline: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
  };
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  featuredImage?: string;
  features: string[];
  benefits: string[];
  faqs?: { question: string; answer: string }[];
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  logoUrl?: string;
  heroImage?: string;
  screenshots: string[];
  features: string[];
  benefits: string[];
  industries: string[];
  techStack: string[];
  pricingModel?: string;
  demoUrl?: string;
  ctaLabel?: string;
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  client: string;
  clientLogo?: string;
  industry: string;
  projectType: string;
  status: 'Completed' | 'Ongoing' | 'Deployed';
  completionDate: string;
  shortSummary: string;
  fullCaseStudy: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  servicesProvided: string[];
  projectUrl?: string;
  featuredImage: string;
  gallery?: string[];
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  avatarUrl: string;
  skills: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  displayOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  position: string;
  organization: string;
  avatarUrl?: string;
  content: string;
  rating: number;
  relatedProject?: string;
  displayPriority: number;
  isPublished: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  authorAvatar?: string;
  coverImage: string;
  summary: string;
  content: string;
  readTime: string;
  isPublished: boolean;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost' | 'Archived';
export type LeadType = 'contact' | 'quote' | 'demo' | 'consultation';

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceOfInterest?: string;
  budgetRange?: string;
  timeline?: string;
  message: string;
  type: LeadType;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  contactPerson?: string;
  notes?: string;
  status: 'Active' | 'Inactive' | 'Prospect';
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  clientCompany?: string;
  name: string;
  code: string;
  description: string;
  scope?: string;
  startDate: string;
  targetEndDate: string;
  endDate?: string;
  status: ProjectStatus;
  budget: number;
  spent?: number;
  currency: string;
  progress: number;
  assignedMembers: string[];
  tasks?: Task[];
  quotationId?: string;
  invoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  projectName?: string;
  title: string;
  description?: string;
  assignee?: string;
  assignedTo?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate?: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done' | 'Completed';
  createdAt?: string;
  updatedAt?: string;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted to Invoice';

export interface QuotationItem {
  id: string;
  type: 'service' | 'product' | 'custom';
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  issueDate: string;
  expiryDate: string;
  currency: string;
  items: QuotationItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  terms?: string;
  status: QuotationStatus;
  convertedInvoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Viewed' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quotationId?: string;
  quotationNumber?: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  notes?: string;
  paymentInstructions?: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'Bank Transfer' | 'Credit Card' | 'Mobile Money / M-Pesa' | 'PayPal' | 'Cash / Cheque';

export interface Payment {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  paymentDate: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  paymentId: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  paymentDate: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  notes?: string;
  createdAt: string;
}

export type ProjectTask = Task;
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done' | 'Completed';

export interface MediaItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  filename?: string;
  url?: string;
  category?: string;
  mimeType?: string;
  altText?: string;
  caption?: string;
  createdAt: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  location: 'header' | 'footer' | 'both';
  order: number;
  isExternal: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  entity?: string;
  entityId?: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

export type AuditLog = ActivityLog;

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  activeProjects: number;
  quotationsSent: number;
  totalQuotedValue: number;
  totalInvoicedValue: number;
  totalPaymentsReceived: number;
  outstandingBalance: number;
  overdueInvoicesCount: number;
  recentLeads: Lead[];
  recentActivity: ActivityLog[];
  recentInvoices: Invoice[];
  recentQuotations: Quotation[];
  monthlyRevenue: { month: string; amount: number }[];
}

export interface Industry {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  desc: string;
  iconName: string;
  subsectors: string[];
  challenges: string[];
  solutionsDelivered: string[];
  sampleClientsOrProjects: string[];
  metrics: { value: string; label: string }[];
}

export interface JobOpening {
  id: string;
  title: string;
  location: string;
  type: string;
  team: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

export interface FAQItem {
  id: string;
  q: string;
  a: string;
  category?: string;
}

export type PublicPage = 
  | 'home' 
  | 'industries' 
  | 'solutions' 
  | 'services' 
  | 'portfolio' 
  | 'about' 
  | 'blog' 
  | 'careers' 
  | 'testimonials' 
  | 'faqs' 
  | 'contact' 
  | 'privacy' 
  | 'terms' 
  | 'cookies';


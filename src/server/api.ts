import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { 
  getDb, saveDb, logActivity, isMysqlConnected, initMysqlIfAvailable 
} from './db.ts';
import { authenticate, generateToken, requireRole, AuthRequest } from './auth.ts';
import { 
  Lead, Client, Quotation, QuotationItem, Invoice, InvoiceItem, 
  Payment, Receipt, Project, Task, Service, Product, PortfolioProject, 
  Article, TeamMember, Testimonial, MediaItem, NavigationItem, 
  User, GlobalSettings, DashboardMetrics, RoleName 
} from '../types.ts';

export const apiRouter = express.Router();

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================

// Global public website bundle
const handlePublicSite = (req: Request, res: Response) => {
  try {
    const db = getDb();
    const publicServices = db.services.filter(s => s.isPublished).sort((a, b) => a.displayOrder - b.displayOrder);
    const publicProducts = db.products.filter(p => p.isPublished);
    const publicPortfolio = db.portfolio.filter(p => p.isPublished);
    const publicArticles = db.articles.filter(a => a.isPublished).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const publicTeam = db.team.filter(t => t.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
    const publicTestimonials = db.testimonials.filter(t => t.isPublished).sort((a, b) => a.displayPriority - b.displayPriority);
    const publicNav = db.navigation.sort((a, b) => a.order - b.order);

    res.json({
      settings: db.settings,
      services: publicServices,
      products: publicProducts,
      portfolio: publicPortfolio,
      articles: publicArticles,
      team: publicTeam,
      testimonials: publicTestimonials,
      navigation: publicNav,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve site content', details: err.message });
  }
};

apiRouter.get('/public/site', handlePublicSite);
apiRouter.get('/public/content', handlePublicSite);

// Public lead submission (Contact, Quote, Demo, Consultation)
apiRouter.post('/public/leads', (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, company, serviceOfInterest, budgetRange, timeline, message, type } = req.body;
    
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'Full name, email, and message are required.' });
    }

    const db = getDb();
    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      company: company ? String(company).trim() : undefined,
      serviceOfInterest: serviceOfInterest ? String(serviceOfInterest) : undefined,
      budgetRange: budgetRange ? String(budgetRange) : undefined,
      timeline: timeline ? String(timeline) : undefined,
      message: String(message).trim(),
      type: type || 'contact',
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.leads.unshift(newLead);
    saveDb(db);

    logActivity('public_guest', fullName, 'SUBMITTED_LEAD', 'leads', newLead.id, `New ${newLead.type} lead from ${company || fullName}`);

    res.status(201).json({ 
      success: true, 
      message: 'Thank you. Your request has been received by SaaSLink Technologies. Our technical team will review your requirements and respond within 24 hours.',
      leadId: newLead.id 
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process lead inquiry', details: err.message });
  }
});

// Public single service
apiRouter.get('/public/services/:slug', (req: Request, res: Response) => {
  const db = getDb();
  const service = db.services.find(s => s.slug === req.params.slug && s.isPublished);
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

// Public single product
apiRouter.get('/public/products/:slug', (req: Request, res: Response) => {
  const db = getDb();
  const product = db.products.find(p => p.slug === req.params.slug && p.isPublished);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Public single portfolio project
apiRouter.get('/public/portfolio/:slug', (req: Request, res: Response) => {
  const db = getDb();
  const project = db.portfolio.find(p => p.slug === req.params.slug && p.isPublished);
  if (!project) return res.status(404).json({ error: 'Case study not found' });
  res.json(project);
});

// Public single article
apiRouter.get('/public/articles/:slug', (req: Request, res: Response) => {
  const db = getDb();
  const article = db.articles.find(a => a.slug === req.params.slug && a.isPublished);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// ==========================================
// 2. AUTHENTICATION & SESSION
// ==========================================

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDb();
    const user = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials or inactive account' });
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    logActivity(user.id, user.name, 'USER_LOGIN', 'users', user.id, 'Successful login to administration platform');

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Login failure', details: err.message });
  }
});

// Request Password Reset Code
apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Corporate email is required.' });
    }

    const db = getDb();
    const user = db.users.find(u => u.email.toLowerCase() === String(email).trim().toLowerCase());
    
    if (!user || !user.isActive) {
      // Security standard: don't reveal user existence
      return res.json({ 
        success: true, 
        message: 'If an active account exists with this email, a verification code has been dispatched.' 
      });
    }

    // Generate secure 6-digit numeric verification OTP
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiry = Date.now() + 15 * 60 * 1000; // 15 mins expiry

    (user as any).resetCode = resetCode;
    (user as any).resetExpiry = resetExpiry;
    saveDb(db);

    logActivity(user.id, user.name, 'PASSWORD_RESET_REQUESTED', 'users', user.id, `Password reset code requested for ${user.email}`);

    res.json({
      success: true,
      message: 'A 6-digit verification code has been generated (valid for 15 minutes).',
      verificationCode: resetCode, // Returned for instant verification in self-hosted / preview setup
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process password reset request', details: err.message });
  }
});

// Verify Code & Set New Password
apiRouter.post('/auth/reset-password', (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, verification code, and new password are required.' });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const db = getDb();
    const user = db.users.find(u => u.email.toLowerCase() === String(email).trim().toLowerCase());

    if (!user || !user.isActive) {
      return res.status(400).json({ error: 'Invalid reset request or inactive account.' });
    }

    const storedCode = (user as any).resetCode;
    const storedExpiry = (user as any).resetExpiry;

    if (!storedCode || !storedExpiry || Date.now() > storedExpiry) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    if (String(storedCode).trim() !== String(code).trim()) {
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    delete (user as any).resetCode;
    delete (user as any).resetExpiry;
    saveDb(db);

    logActivity(user.id, user.name, 'PASSWORD_RESET_COMPLETED', 'users', user.id, `Password was successfully reset for ${user.email}`);

    res.json({
      success: true,
      message: 'Password updated successfully. You can now log in with your new password.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reset password', details: err.message });
  }
});

apiRouter.get('/auth/me', authenticate, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

apiRouter.post('/auth/change-password', authenticate, (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const db = getDb();
  const user = db.users.find(u => u.id === req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return res.status(400).json({ error: 'Current password does not match.' });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  saveDb(db);
  logActivity(user.id, user.name, 'CHANGED_PASSWORD', 'users', user.id, 'User changed account password');

  res.json({ success: true, message: 'Password updated successfully' });
});

// ==========================================
// 3. ADMIN DASHBOARD & ANALYTICS
// ==========================================

const handleDashboard = (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    
    const totalLeads = db.leads.length;
    const newLeads = db.leads.filter(l => l.status === 'New').length;
    const activeProjects = db.projects.filter(p => p.status === 'Active').length;
    const quotationsSent = db.quotations.filter(q => q.status !== 'Draft').length;
    const totalQuotedValue = db.quotations.reduce((sum, q) => sum + (q.total || 0), 0);
    const totalInvoicedValue = db.invoices.reduce((sum, i) => sum + (i.total || 0), 0);
    const totalPaymentsReceived = db.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const outstandingBalance = db.invoices.reduce((sum, i) => sum + (i.balanceDue || 0), 0);
    const overdueInvoicesCount = db.invoices.filter(i => {
      return i.status === 'Overdue' || (i.balanceDue > 0 && new Date(i.dueDate) < new Date());
    }).length;

    // Real monthly billing aggregation
    const monthlyRevenueMap: Record<string, number> = {};
    db.payments.forEach(p => {
      const month = p.paymentDate.substring(0, 7); // YYYY-MM
      monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + p.amount;
    });

    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, amount]) => ({
      month,
      amount,
    })).sort((a, b) => a.month.localeCompare(b.month));

    const metrics: DashboardMetrics = {
      totalLeads,
      newLeads,
      activeProjects,
      quotationsSent,
      totalQuotedValue,
      totalInvoicedValue,
      totalPaymentsReceived,
      outstandingBalance,
      overdueInvoicesCount,
      recentLeads: db.leads.slice(0, 5),
      recentActivity: db.activityLogs.slice(0, 8),
      recentInvoices: db.invoices.slice(0, 5),
      recentQuotations: db.quotations.slice(0, 5),
      monthlyRevenue,
    };

    res.json(metrics);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to compute dashboard metrics', details: err.message });
  }
};

apiRouter.get('/admin/dashboard', authenticate, handleDashboard);
apiRouter.get('/admin/metrics', authenticate, handleDashboard);

// ==========================================
// 4. LEADS MANAGEMENT
// ==========================================

apiRouter.get('/admin/leads', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  res.json(db.leads);
});

apiRouter.put('/admin/leads/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const index = db.leads.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Lead not found' });

  const oldLead = db.leads[index];
  const updated: Lead = {
    ...oldLead,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.leads[index] = updated;
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'UPDATED_LEAD', 'leads', updated.id, `Lead status: ${updated.status}`);

  res.json(updated);
});

apiRouter.delete('/admin/leads/:id', authenticate, requireRole(['Super Administrator', 'Administrator', 'Manager']), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const lead = db.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  db.leads = db.leads.filter(l => l.id !== req.params.id);
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'DELETED_LEAD', 'leads', req.params.id, `Deleted lead from ${lead.fullName}`);

  res.json({ success: true });
});

// Convert Lead into a registered Client
apiRouter.post('/admin/leads/:id/convert-to-client', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const lead = db.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  const newClient: Client = {
    id: `cli_${Date.now().toString(36)}`,
    name: lead.fullName,
    company: lead.company || `${lead.fullName}'s Organization`,
    email: lead.email,
    phone: lead.phone || '',
    contactPerson: lead.fullName,
    notes: `Converted from lead (${lead.type}). Initial message: "${lead.message}"`,
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  lead.status = 'Won';
  db.clients.unshift(newClient);
  saveDb(db);

  logActivity(req.user!.id, req.user!.name, 'CONVERTED_LEAD_TO_CLIENT', 'clients', newClient.id, `Converted lead ${lead.fullName} into client ${newClient.company}`);

  res.status(201).json({ success: true, client: newClient });
});

// ==========================================
// 5. CLIENTS MANAGEMENT (360-degree CRM)
// ==========================================

apiRouter.get('/admin/clients', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  res.json(db.clients);
});

apiRouter.get('/admin/clients/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const client = db.clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  // 360-degree aggregated client view
  const clientQuotations = db.quotations.filter(q => q.clientId === client.id);
  const clientInvoices = db.invoices.filter(i => i.clientId === client.id);
  const clientPayments = db.payments.filter(p => p.clientId === client.id);
  const clientReceipts = db.receipts.filter(r => r.clientId === client.id);
  const clientProjects = db.projects.filter(p => p.clientId === client.id);

  res.json({
    client,
    quotations: clientQuotations,
    invoices: clientInvoices,
    payments: clientPayments,
    receipts: clientReceipts,
    projects: clientProjects,
  });
});

apiRouter.post('/admin/clients', authenticate, (req: AuthRequest, res: Response) => {
  const { name, company, email, phone, address, city, country, taxId, contactPerson, notes, status } = req.body;
  if (!name || !company || !email) {
    return res.status(400).json({ error: 'Client name, company, and email are required.' });
  }

  const db = getDb();
  const newClient: Client = {
    id: `cli_${Date.now().toString(36)}`,
    name: String(name).trim(),
    company: String(company).trim(),
    email: String(email).trim().toLowerCase(),
    phone: phone ? String(phone).trim() : '',
    address,
    city,
    country: country || 'Kenya',
    taxId,
    contactPerson,
    notes,
    status: status || 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.clients.unshift(newClient);
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'CREATED_CLIENT', 'clients', newClient.id, `Created client ${newClient.company}`);

  res.status(201).json(newClient);
});

apiRouter.put('/admin/clients/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const index = db.clients.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Client not found' });

  const updated: Client = {
    ...db.clients[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.clients[index] = updated;
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'UPDATED_CLIENT', 'clients', updated.id, `Updated client ${updated.company}`);

  res.json(updated);
});

apiRouter.delete('/admin/clients/:id', authenticate, requireRole(['Super Administrator', 'Administrator']), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const client = db.clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  db.clients = db.clients.filter(c => c.id !== req.params.id);
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'DELETED_CLIENT', 'clients', req.params.id, `Deleted client ${client.company}`);

  res.json({ success: true });
});

// ==========================================
// 6. QUOTATIONS MANAGEMENT
// ==========================================

apiRouter.get('/admin/quotations', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  res.json(db.quotations);
});

apiRouter.get('/admin/quotations/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const quote = db.quotations.find(q => q.id === req.params.id);
  if (!quote) return res.status(404).json({ error: 'Quotation not found' });
  res.json(quote);
});

apiRouter.post('/admin/quotations', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { 
      clientId, issueDate, expiryDate, currency, items, 
      discountPercent, taxRate, notes, terms, status 
    } = req.body;

    const client = db.clients.find(c => c.id === clientId);
    if (!client) return res.status(400).json({ error: 'Valid client is required.' });

    // Format quotation number dynamically
    const seq = db.settings.quotationNextSeq || 1001;
    const quotationNumber = `${db.settings.quotationPrefix || 'QUO-2026-'}${seq}`;
    db.settings.quotationNextSeq = seq + 1;

    // Calculate line items
    const parsedItems: QuotationItem[] = (items || []).map((item: any, idx: number) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      const discount = Number(item.discount) || 0;
      const total = (quantity * unitPrice) - discount;
      return {
        id: `qi_${Date.now()}_${idx}`,
        type: item.type || 'service',
        description: item.description || 'Custom line item',
        quantity,
        unitPrice,
        discount,
        total: Math.max(0, total),
      };
    });

    const subtotal = parsedItems.reduce((sum, item) => sum + item.total, 0);
    const discPct = Number(discountPercent) || 0;
    const discountAmount = (subtotal * discPct) / 100;
    const subtotalAfterDisc = subtotal - discountAmount;
    const taxRt = taxRate !== undefined ? Number(taxRate) : db.settings.defaultTaxRate;
    const taxAmount = (subtotalAfterDisc * taxRt) / 100;
    const total = subtotalAfterDisc + taxAmount;

    const newQuote: Quotation = {
      id: `quo_${Date.now().toString(36)}`,
      quotationNumber,
      clientId: client.id,
      clientName: client.name,
      clientCompany: client.company,
      clientEmail: client.email,
      clientPhone: client.phone,
      clientAddress: client.address,
      issueDate: issueDate || new Date().toISOString().substring(0, 10),
      expiryDate: expiryDate || new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
      currency: currency || db.settings.currency,
      items: parsedItems,
      subtotal,
      discountPercent: discPct,
      discountAmount,
      taxRate: taxRt,
      taxAmount,
      total,
      notes: notes || 'Thank you for your business consideration.',
      terms: terms || db.settings.termsAndConditions,
      status: status || 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.quotations.unshift(newQuote);
    saveDb(db);
    logActivity(req.user!.id, req.user!.name, 'CREATED_QUOTATION', 'quotations', newQuote.id, `Created quotation ${quotationNumber} for ${client.company} ($${total.toFixed(2)})`);

    res.status(201).json(newQuote);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create quotation', details: err.message });
  }
});

apiRouter.put('/admin/quotations/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const index = db.quotations.findIndex(q => q.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Quotation not found' });

  const existing = db.quotations[index];
  const body = req.body;

  // Recalculate totals if items changed
  let items = existing.items;
  if (body.items) {
    items = body.items.map((item: any, idx: number) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      const discount = Number(item.discount) || 0;
      const total = (quantity * unitPrice) - discount;
      return {
        id: item.id || `qi_${Date.now()}_${idx}`,
        type: item.type || 'service',
        description: item.description,
        quantity,
        unitPrice,
        discount,
        total: Math.max(0, total),
      };
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discPct = body.discountPercent !== undefined ? Number(body.discountPercent) : existing.discountPercent;
  const discountAmount = (subtotal * discPct) / 100;
  const subtotalAfterDisc = subtotal - discountAmount;
  const taxRt = body.taxRate !== undefined ? Number(body.taxRate) : existing.taxRate;
  const taxAmount = (subtotalAfterDisc * taxRt) / 100;
  const total = subtotalAfterDisc + taxAmount;

  const updated: Quotation = {
    ...existing,
    ...body,
    items,
    subtotal,
    discountPercent: discPct,
    discountAmount,
    taxRate: taxRt,
    taxAmount,
    total,
    updatedAt: new Date().toISOString(),
  };

  db.quotations[index] = updated;
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'UPDATED_QUOTATION', 'quotations', updated.id, `Updated quotation ${updated.quotationNumber} (${updated.status})`);

  res.json(updated);
});

// Convert accepted quotation into an official invoice
apiRouter.post('/admin/quotations/:id/convert-to-invoice', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const quote = db.quotations.find(q => q.id === req.params.id);
  if (!quote) return res.status(404).json({ error: 'Quotation not found' });

  const invoiceSeq = db.settings.invoiceNextSeq || 1001;
  const invoiceNumber = `${db.settings.invoicePrefix || 'INV-2026-'}${invoiceSeq}`;
  db.settings.invoiceNextSeq = invoiceSeq + 1;

  const invoiceItems: InvoiceItem[] = quote.items.map((item, idx) => ({
    id: `ii_${Date.now()}_${idx}`,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: item.total,
  }));

  const newInvoice: Invoice = {
    id: `inv_${Date.now().toString(36)}`,
    invoiceNumber,
    quotationId: quote.id,
    quotationNumber: quote.quotationNumber,
    clientId: quote.clientId,
    clientName: quote.clientName,
    clientCompany: quote.clientCompany,
    clientEmail: quote.clientEmail,
    clientAddress: quote.clientAddress,
    issueDate: new Date().toISOString().substring(0, 10),
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
    currency: quote.currency,
    items: invoiceItems,
    subtotal: quote.subtotal,
    discountPercent: quote.discountPercent,
    discountAmount: quote.discountAmount,
    taxRate: quote.taxRate,
    taxAmount: quote.taxAmount,
    total: quote.total,
    amountPaid: 0,
    balanceDue: quote.total,
    notes: `Converted from quotation ${quote.quotationNumber}.`,
    paymentInstructions: db.settings.paymentInstructions,
    status: 'Sent',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  quote.status = 'Converted to Invoice';
  quote.convertedInvoiceId = newInvoice.id;

  db.invoices.unshift(newInvoice);
  saveDb(db);

  logActivity(req.user!.id, req.user!.name, 'CONVERTED_QUOTE_TO_INVOICE', 'invoices', newInvoice.id, `Converted quotation ${quote.quotationNumber} to invoice ${invoiceNumber}`);

  res.status(201).json({ success: true, invoice: newInvoice });
});

// ==========================================
// 7. INVOICE MANAGEMENT
// ==========================================

apiRouter.get('/admin/invoices', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  res.json(db.invoices);
});

apiRouter.get('/admin/invoices/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const invoice = db.invoices.find(i => i.id === req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  
  const payments = db.payments.filter(p => p.invoiceId === invoice.id);
  res.json({ invoice, payments });
});

apiRouter.post('/admin/invoices', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { 
      clientId, issueDate, dueDate, currency, items, 
      discountPercent, taxRate, notes, paymentInstructions, status 
    } = req.body;

    const client = db.clients.find(c => c.id === clientId);
    if (!client) return res.status(400).json({ error: 'Valid client is required.' });

    const seq = db.settings.invoiceNextSeq || 1001;
    const invoiceNumber = `${db.settings.invoicePrefix || 'INV-2026-'}${seq}`;
    db.settings.invoiceNextSeq = seq + 1;

    const parsedItems: InvoiceItem[] = (items || []).map((item: any, idx: number) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      return {
        id: `ii_${Date.now()}_${idx}`,
        description: item.description || 'Service deliverable',
        quantity,
        unitPrice,
        total: quantity * unitPrice,
      };
    });

    const subtotal = parsedItems.reduce((sum, item) => sum + item.total, 0);
    const discPct = Number(discountPercent) || 0;
    const discountAmount = (subtotal * discPct) / 100;
    const subtotalAfterDisc = subtotal - discountAmount;
    const taxRt = taxRate !== undefined ? Number(taxRate) : db.settings.defaultTaxRate;
    const taxAmount = (subtotalAfterDisc * taxRt) / 100;
    const total = subtotalAfterDisc + taxAmount;

    const newInvoice: Invoice = {
      id: `inv_${Date.now().toString(36)}`,
      invoiceNumber,
      clientId: client.id,
      clientName: client.name,
      clientCompany: client.company,
      clientEmail: client.email,
      clientAddress: client.address,
      issueDate: issueDate || new Date().toISOString().substring(0, 10),
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
      currency: currency || db.settings.currency,
      items: parsedItems,
      subtotal,
      discountPercent: discPct,
      discountAmount,
      taxRate: taxRt,
      taxAmount,
      total,
      amountPaid: 0,
      balanceDue: total,
      notes: notes || 'Payment is due within 14 calendar days.',
      paymentInstructions: paymentInstructions || db.settings.paymentInstructions,
      status: status || 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.invoices.unshift(newInvoice);
    saveDb(db);
    logActivity(req.user!.id, req.user!.name, 'CREATED_INVOICE', 'invoices', newInvoice.id, `Created invoice ${invoiceNumber} for ${client.company} ($${total.toFixed(2)})`);

    res.status(201).json(newInvoice);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create invoice', details: err.message });
  }
});

apiRouter.put('/admin/invoices/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const index = db.invoices.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Invoice not found' });

  const existing = db.invoices[index];
  const updated: Invoice = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.invoices[index] = updated;
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'UPDATED_INVOICE', 'invoices', updated.id, `Updated invoice ${updated.invoiceNumber}`);

  res.json(updated);
});

// ==========================================
// 8. PAYMENTS & RECEIPT GENERATION
// ==========================================

apiRouter.get('/admin/payments', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  res.json(db.payments);
});

apiRouter.get('/admin/receipts', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  res.json(db.receipts);
});

apiRouter.get('/admin/receipts/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const receipt = db.receipts.find(r => r.id === req.params.id);
  if (!receipt) return res.status(404).json({ error: 'Receipt not found' });
  res.json(receipt);
});

// Record a payment against an invoice and generate official Receipt
apiRouter.post('/admin/payments', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { invoiceId, paymentDate, amount, paymentMethod, paymentReference, notes } = req.body;

    const invoice = db.invoices.find(i => i.id === invoiceId);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) {
      return res.status(400).json({ error: 'Payment amount must be greater than zero.' });
    }

    // Auto generate receipt number
    const rctSeq = db.settings.receiptNextSeq || 1001;
    const receiptNumber = `${db.settings.receiptPrefix || 'RCT-2026-'}${rctSeq}`;
    db.settings.receiptNextSeq = rctSeq + 1;

    const newPayment: Payment = {
      id: `pay_${Date.now().toString(36)}`,
      receiptNumber,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      paymentDate: paymentDate || new Date().toISOString().substring(0, 10),
      amount: payAmount,
      currency: invoice.currency,
      paymentMethod: paymentMethod || 'Bank Transfer',
      paymentReference: paymentReference || `REF-${Date.now().toString().slice(-6)}`,
      notes,
      recordedBy: req.user!.name,
      createdAt: new Date().toISOString(),
    };

    // Update invoice balances
    invoice.amountPaid = (invoice.amountPaid || 0) + payAmount;
    invoice.balanceDue = Math.max(0, invoice.total - invoice.amountPaid);
    
    if (invoice.balanceDue <= 0.01) {
      invoice.status = 'Paid';
    } else {
      invoice.status = 'Partially Paid';
    }
    invoice.updatedAt = new Date().toISOString();

    // Generate matching official Receipt document
    const newReceipt: Receipt = {
      id: `rct_${Date.now().toString(36)}`,
      receiptNumber,
      paymentId: newPayment.id,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      clientCompany: invoice.clientCompany,
      paymentDate: newPayment.paymentDate,
      amount: payAmount,
      currency: invoice.currency,
      paymentMethod: newPayment.paymentMethod,
      paymentReference: newPayment.paymentReference,
      notes: notes || `Official payment confirmation for ${invoice.invoiceNumber}. Outstanding invoice balance: $${invoice.balanceDue.toFixed(2)}`,
      createdAt: new Date().toISOString(),
    };

    db.payments.unshift(newPayment);
    db.receipts.unshift(newReceipt);
    saveDb(db);

    logActivity(
      req.user!.id, 
      req.user!.name, 
      'RECORDED_PAYMENT', 
      'payments', 
      newPayment.id, 
      `Recorded payment of $${payAmount.toFixed(2)} on ${invoice.invoiceNumber} (Receipt: ${receiptNumber})`
    );

    res.status(201).json({
      success: true,
      payment: newPayment,
      receipt: newReceipt,
      invoice,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record payment', details: err.message });
  }
});

// ==========================================
// 9. WORK & PROJECT MANAGEMENT
// ==========================================

apiRouter.get('/admin/projects', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  res.json(db.projects);
});

apiRouter.post('/admin/projects', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { clientId, name, code, description, scope, startDate, targetEndDate, status, budget, currency, progress, assignedMembers } = req.body;

  const client = db.clients.find(c => c.id === clientId);
  if (!client || !name) {
    return res.status(400).json({ error: 'Client and Project name are required.' });
  }

  const projectCode = code || `PRJ-${client.company.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-2)}`;

  const newProject: Project = {
    id: `prj_${Date.now().toString(36)}`,
    clientId: client.id,
    clientName: client.company,
    name: String(name).trim(),
    code: projectCode,
    description: String(description || '').trim(),
    scope,
    startDate: startDate || new Date().toISOString().substring(0, 10),
    targetEndDate: targetEndDate || new Date(Date.now() + 60 * 86400000).toISOString().substring(0, 10),
    status: status || 'Planning',
    budget: Number(budget) || 0,
    spent: Number(req.body.spent) || 0,
    currency: currency || db.settings.currency,
    progress: Number(progress) || 0,
    assignedMembers: assignedMembers || [req.user!.name],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects.unshift(newProject);
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'CREATED_PROJECT', 'projects', newProject.id, `Created project ${newProject.name} (${newProject.code})`);

  res.status(201).json(newProject);
});

apiRouter.put('/admin/projects/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const index = db.projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  const updated: Project = {
    ...db.projects[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.projects[index] = updated;
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'UPDATED_PROJECT', 'projects', updated.id, `Updated project ${updated.name} (${updated.status})`);

  res.json(updated);
});

// Tasks
apiRouter.get('/admin/tasks', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  res.json(db.tasks);
});

apiRouter.post('/admin/tasks', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { projectId, title, description, assignee, priority, dueDate, status } = req.body;

  const project = db.projects.find(p => p.id === projectId);
  if (!project || !title) {
    return res.status(400).json({ error: 'Project and task title are required.' });
  }

  const newTask: Task = {
    id: `tsk_${Date.now().toString(36)}`,
    projectId: project.id,
    projectName: project.name,
    title: String(title).trim(),
    description,
    assignee: assignee || req.user!.name,
    priority: priority || 'Medium',
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
    status: status || 'To Do',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.tasks.unshift(newTask);
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'CREATED_TASK', 'tasks', newTask.id, `Created task ${newTask.title}`);

  res.status(201).json(newTask);
});

apiRouter.put('/admin/tasks/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const index = db.tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  const updated: Task = {
    ...db.tasks[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.tasks[index] = updated;
  saveDb(db);
  res.json(updated);
});

apiRouter.delete('/admin/tasks/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.tasks = db.tasks.filter(t => t.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// ==========================================
// 10. CMS MODULES (Services, Products, Portfolio, Articles, Team, Testimonials)
// ==========================================

// Services CMS
apiRouter.get('/admin/services', authenticate, (req: AuthRequest, res: Response) => res.json(getDb().services));
apiRouter.post('/admin/services', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const newService: Service = {
    id: `srv_${Date.now().toString(36)}`,
    title: req.body.title || 'New Service',
    slug: req.body.slug || `service-${Date.now()}`,
    category: req.body.category || 'Engineering',
    shortDescription: req.body.shortDescription || '',
    fullDescription: req.body.fullDescription || '',
    iconName: req.body.iconName || 'Code2',
    features: req.body.features || [],
    benefits: req.body.benefits || [],
    displayOrder: req.body.displayOrder || db.services.length + 1,
    isFeatured: !!req.body.isFeatured,
    isPublished: req.body.isPublished !== undefined ? !!req.body.isPublished : true,
    seoTitle: req.body.seoTitle,
    seoDescription: req.body.seoDescription,
  };
  db.services.push(newService);
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'CREATED_SERVICE', 'services', newService.id, `Created service: ${newService.title}`);
  res.status(201).json(newService);
});
apiRouter.put('/admin/services/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const idx = db.services.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });
  db.services[idx] = { ...db.services[idx], ...req.body };
  saveDb(db);
  res.json(db.services[idx]);
});
apiRouter.delete('/admin/services/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.services = db.services.filter(s => s.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Products CMS
apiRouter.get('/admin/products', authenticate, (req: AuthRequest, res: Response) => res.json(getDb().products));
apiRouter.post('/admin/products', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const newProd: Product = {
    id: `prd_${Date.now().toString(36)}`,
    name: req.body.name || 'New Product',
    slug: req.body.slug || `product-${Date.now()}`,
    tagline: req.body.tagline || '',
    shortDescription: req.body.shortDescription || '',
    fullDescription: req.body.fullDescription || '',
    logoUrl: req.body.logoUrl,
    heroImage: req.body.heroImage,
    screenshots: req.body.screenshots || [],
    features: req.body.features || [],
    benefits: req.body.benefits || [],
    industries: req.body.industries || [],
    techStack: req.body.techStack || [],
    pricingModel: req.body.pricingModel,
    demoUrl: req.body.demoUrl,
    ctaLabel: req.body.ctaLabel || 'Request Demo',
    isFeatured: !!req.body.isFeatured,
    isPublished: req.body.isPublished !== undefined ? !!req.body.isPublished : true,
    seoTitle: req.body.seoTitle,
    seoDescription: req.body.seoDescription,
  };
  db.products.push(newProd);
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'CREATED_PRODUCT', 'products', newProd.id, `Created product: ${newProd.name}`);
  res.status(201).json(newProd);
});
apiRouter.put('/admin/products/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  db.products[idx] = { ...db.products[idx], ...req.body };
  saveDb(db);
  res.json(db.products[idx]);
});
apiRouter.delete('/admin/products/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.products = db.products.filter(p => p.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Portfolio CMS
apiRouter.get('/admin/portfolio', authenticate, (req: AuthRequest, res: Response) => res.json(getDb().portfolio));
apiRouter.post('/admin/portfolio', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const newCase: PortfolioProject = {
    id: `case_${Date.now().toString(36)}`,
    title: req.body.title || 'New Case Study',
    slug: req.body.slug || `case-${Date.now()}`,
    client: req.body.client || 'Client Name',
    industry: req.body.industry || 'Technology',
    projectType: req.body.projectType || 'Enterprise Software',
    status: req.body.status || 'Completed',
    completionDate: req.body.completionDate || '2026',
    shortSummary: req.body.shortSummary || '',
    fullCaseStudy: req.body.fullCaseStudy || '',
    challenge: req.body.challenge || '',
    solution: req.body.solution || '',
    results: req.body.results || [],
    technologies: req.body.technologies || [],
    servicesProvided: req.body.servicesProvided || [],
    projectUrl: req.body.projectUrl,
    featuredImage: req.body.featuredImage || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    isFeatured: !!req.body.isFeatured,
    isPublished: req.body.isPublished !== undefined ? !!req.body.isPublished : true,
  };
  db.portfolio.push(newCase);
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'CREATED_CASE_STUDY', 'portfolio', newCase.id, `Created case study: ${newCase.title}`);
  res.status(201).json(newCase);
});
apiRouter.put('/admin/portfolio/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const idx = db.portfolio.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Case study not found' });
  db.portfolio[idx] = { ...db.portfolio[idx], ...req.body };
  saveDb(db);
  res.json(db.portfolio[idx]);
});
apiRouter.delete('/admin/portfolio/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.portfolio = db.portfolio.filter(p => p.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Articles CMS
apiRouter.get('/admin/articles', authenticate, (req: AuthRequest, res: Response) => res.json(getDb().articles));
apiRouter.post('/admin/articles', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const newArt: Article = {
    id: `art_${Date.now().toString(36)}`,
    title: req.body.title || 'New Insight',
    slug: req.body.slug || `article-${Date.now()}`,
    category: req.body.category || 'Technology',
    tags: req.body.tags || ['Enterprise'],
    author: req.body.author || req.user!.name,
    authorRole: req.body.authorRole || 'Software Architect',
    authorAvatar: req.user!.avatarUrl,
    coverImage: req.body.coverImage || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    summary: req.body.summary || '',
    content: req.body.content || '',
    readTime: req.body.readTime || '5 min read',
    isPublished: req.body.isPublished !== undefined ? !!req.body.isPublished : true,
    publishedAt: req.body.publishedAt || new Date().toISOString().substring(0, 10),
  };
  db.articles.push(newArt);
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'CREATED_ARTICLE', 'articles', newArt.id, `Published article: ${newArt.title}`);
  res.status(201).json(newArt);
});
apiRouter.put('/admin/articles/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const idx = db.articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article not found' });
  db.articles[idx] = { ...db.articles[idx], ...req.body };
  saveDb(db);
  res.json(db.articles[idx]);
});
apiRouter.delete('/admin/articles/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.articles = db.articles.filter(a => a.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Team Members
apiRouter.get('/admin/team', authenticate, (req: AuthRequest, res: Response) => res.json(getDb().team));
apiRouter.post('/admin/team', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const member: TeamMember = {
    id: `tm_${Date.now().toString(36)}`,
    name: req.body.name,
    position: req.body.position,
    bio: req.body.bio || '',
    avatarUrl: req.body.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    skills: req.body.skills || [],
    socialLinks: req.body.socialLinks,
    displayOrder: req.body.displayOrder || db.team.length + 1,
    isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
  };
  db.team.push(member);
  saveDb(db);
  res.status(201).json(member);
});
apiRouter.put('/admin/team/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const idx = db.team.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Team member not found' });
  db.team[idx] = { ...db.team[idx], ...req.body };
  saveDb(db);
  res.json(db.team[idx]);
});
apiRouter.delete('/admin/team/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.team = db.team.filter(t => t.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Testimonials
apiRouter.get('/admin/testimonials', authenticate, (req: AuthRequest, res: Response) => res.json(getDb().testimonials));
apiRouter.post('/admin/testimonials', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const test: Testimonial = {
    id: `tst_${Date.now().toString(36)}`,
    clientName: req.body.clientName,
    position: req.body.position,
    organization: req.body.organization,
    avatarUrl: req.body.avatarUrl,
    content: req.body.content,
    rating: req.body.rating || 5,
    relatedProject: req.body.relatedProject,
    displayPriority: req.body.displayPriority || 0,
    isPublished: req.body.isPublished !== undefined ? !!req.body.isPublished : true,
  };
  db.testimonials.push(test);
  saveDb(db);
  res.status(201).json(test);
});
apiRouter.put('/admin/testimonials/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const idx = db.testimonials.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Testimonial not found' });
  db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
  saveDb(db);
  res.json(db.testimonials[idx]);
});
apiRouter.delete('/admin/testimonials/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.testimonials = db.testimonials.filter(t => t.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// ==========================================
// UNIVERSAL CMS ENDPOINTS (/admin/cms/:entityType & /admin/cms/:entityType/:id)
// Supporting GET, POST, PUT, PATCH, DELETE for real-time Admin <-> Frontend Sync
// Supports videoUrl, galleryImages, coverImage, heroImage, and rich text fields
// ==========================================

const getEntityCollection = (db: any, entityType: string) => {
  const norm = String(entityType).toLowerCase().trim();
  if (norm === 'services' || norm === 'service') return { array: db.services, key: 'services', prefix: 'srv' };
  if (norm === 'products' || norm === 'product') return { array: db.products, key: 'products', prefix: 'prd' };
  if (norm === 'portfolio' || norm === 'case_studies' || norm === 'case-studies' || norm === 'projects') return { array: db.portfolio, key: 'portfolio', prefix: 'case' };
  if (norm === 'articles' || norm === 'article' || norm === 'insights' || norm === 'blog') return { array: db.articles, key: 'articles', prefix: 'art' };
  if (norm === 'team' || norm === 'team_members' || norm === 'team-members') return { array: db.team, key: 'team', prefix: 'tm' };
  if (norm === 'testimonials' || norm === 'testimonial') return { array: db.testimonials, key: 'testimonials', prefix: 'tst' };
  return null;
};

// GET entity list
apiRouter.get('/admin/cms/:entityType', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const target = getEntityCollection(db, req.params.entityType);
  if (!target) return res.status(400).json({ error: `Unknown CMS entity: ${req.params.entityType}` });
  res.json(target.array);
});

// POST create entity
apiRouter.post('/admin/cms/:entityType', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const target = getEntityCollection(db, req.params.entityType);
  if (!target) return res.status(400).json({ error: `Unknown CMS entity: ${req.params.entityType}` });

  const id = req.body.id || `${target.prefix}_${Date.now().toString(36)}`;
  const item = {
    ...req.body,
    id,
    isPublished: req.body.isPublished !== undefined ? req.body.isPublished : (req.body.published !== undefined ? req.body.published : true),
    createdAt: req.body.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  target.array.unshift(item);
  saveDb(db);
  logActivity(req.user?.id || 'admin', req.user?.name || 'Administrator', `CREATED_${target.key.toUpperCase()}`, target.key, id, `Created CMS item ${item.title || item.name || id}`);
  res.status(201).json(item);
});

// PATCH / PUT update entity
const handleUpdateCmsEntity = (req: AuthRequest, res: Response) => {
  const db = getDb();
  const target = getEntityCollection(db, req.params.entityType);
  if (!target) return res.status(400).json({ error: `Unknown CMS entity: ${req.params.entityType}` });

  const idx = target.array.findIndex((item: any) => item.id === req.params.id);
  if (idx === -1) {
    const newItem = {
      ...req.body,
      id: req.params.id,
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished : (req.body.published !== undefined ? req.body.published : true),
      updatedAt: new Date().toISOString(),
    };
    target.array.unshift(newItem);
    saveDb(db);
    return res.json(newItem);
  }

  const updated = {
    ...target.array[idx],
    ...req.body,
    id: req.params.id,
    isPublished: req.body.isPublished !== undefined ? req.body.isPublished : (req.body.published !== undefined ? req.body.published : target.array[idx].isPublished),
    updatedAt: new Date().toISOString(),
  };

  target.array[idx] = updated;
  saveDb(db);
  logActivity(req.user?.id || 'admin', req.user?.name || 'Administrator', `UPDATED_${target.key.toUpperCase()}`, target.key, req.params.id, `Updated CMS item ${updated.title || updated.name || req.params.id}`);
  res.json(updated);
};

apiRouter.patch('/admin/cms/:entityType/:id', authenticate, handleUpdateCmsEntity);
apiRouter.put('/admin/cms/:entityType/:id', authenticate, handleUpdateCmsEntity);

// DELETE entity
apiRouter.delete('/admin/cms/:entityType/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const target = getEntityCollection(db, req.params.entityType);
  if (!target) return res.status(400).json({ error: `Unknown CMS entity: ${req.params.entityType}` });

  db[target.key] = target.array.filter((item: any) => item.id !== req.params.id);
  saveDb(db);
  logActivity(req.user?.id || 'admin', req.user?.name || 'Administrator', `DELETED_${target.key.toUpperCase()}`, target.key, req.params.id, `Deleted CMS item ID ${req.params.id}`);
  res.json({ success: true, id: req.params.id });
});

// Media Library
apiRouter.get('/admin/media', authenticate, (req: AuthRequest, res: Response) => res.json(getDb().media));
apiRouter.post('/admin/media', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { fileName, fileUrl, fileType, fileSize, altText, caption } = req.body;
  if (!fileName || !fileUrl) {
    return res.status(400).json({ error: 'File name and URL are required.' });
  }
  const item: MediaItem = {
    id: `med_${Date.now().toString(36)}`,
    fileName,
    fileUrl,
    fileType: fileType || 'image/jpeg',
    fileSize: Number(fileSize) || 102400,
    altText,
    caption,
    createdAt: new Date().toISOString(),
  };
  db.media.unshift(item);
  saveDb(db);
  res.status(201).json(item);
});
apiRouter.delete('/admin/media/:id', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.media = db.media.filter(m => m.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Navigation
apiRouter.get('/admin/navigation', authenticate, (req: AuthRequest, res: Response) => res.json(getDb().navigation));
apiRouter.put('/admin/navigation', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  if (Array.isArray(req.body)) {
    db.navigation = req.body;
    saveDb(db);
    return res.json(db.navigation);
  }
  res.status(400).json({ error: 'Expected array of navigation items.' });
});

// ==========================================
// 11. GLOBAL SETTINGS & BRANDING
// ==========================================

apiRouter.get('/admin/settings', authenticate, (req: AuthRequest, res: Response) => {
  res.json(getDb().settings);
});

apiRouter.put('/admin/settings', authenticate, requireRole(['Super Administrator', 'Administrator']), (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.settings = {
    ...db.settings,
    ...req.body,
  };
  saveDb(db);
  logActivity(req.user?.id || 'admin', req.user?.name || 'Administrator', 'UPDATED_SETTINGS', 'settings', 'global', 'Updated enterprise global configuration & branding');
  res.json(db.settings);
});

apiRouter.patch('/admin/settings', authenticate, requireRole(['Super Administrator', 'Administrator']), (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.settings = {
    ...db.settings,
    ...req.body,
  };
  saveDb(db);
  logActivity(req.user?.id || 'admin', req.user?.name || 'Administrator', 'UPDATED_SETTINGS', 'settings', 'global', 'Updated enterprise global configuration & branding');
  res.json(db.settings);
});

// Dedicated Logo Upload & Update Endpoint
apiRouter.post('/admin/settings/logo', authenticate, requireRole(['Super Administrator', 'Administrator']), (req: AuthRequest, res: Response) => {
  const { logoUrl } = req.body;
  if (!logoUrl) {
    return res.status(400).json({ error: 'logoUrl is required' });
  }
  const db = getDb();
  db.settings.logoUrl = logoUrl;
  saveDb(db);
  logActivity(req.user?.id || 'admin', req.user?.name || 'Administrator', 'UPDATED_LOGO', 'settings', 'logo', 'Updated corporate logo image asset');
  res.json({ success: true, logoUrl: db.settings.logoUrl, settings: db.settings });
});


// ==========================================
// 12. USERS & RBAC MANAGEMENT
// ==========================================

apiRouter.get('/admin/users', authenticate, requireRole(['Super Administrator', 'Administrator']), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const safeUsers = db.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatarUrl: u.avatarUrl,
    phone: u.phone,
    isActive: u.isActive,
    createdAt: u.createdAt,
  }));
  res.json(safeUsers);
});

apiRouter.post('/admin/users', authenticate, requireRole(['Super Administrator']), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { name, email, password, role, phone } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (db.users.some(u => u.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  const newUser: User & { passwordHash: string } = {
    id: `usr_${Date.now().toString(36)}`,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    passwordHash: bcrypt.hashSync(String(password), 10),
    role: role || 'Staff',
    phone,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'CREATED_USER', 'users', newUser.id, `Created staff account for ${newUser.name} (${newUser.role})`);

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    phone: newUser.phone,
    isActive: newUser.isActive,
    createdAt: newUser.createdAt,
  });
});

apiRouter.put('/admin/users/:id', authenticate, requireRole(['Super Administrator']), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const user = db.users[index];
  if (req.body.name) user.name = req.body.name;
  if (req.body.role) user.role = req.body.role;
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.isActive !== undefined) user.isActive = !!req.body.isActive;
  if (req.body.password) user.passwordHash = bcrypt.hashSync(req.body.password, 10);

  saveDb(db);
  logActivity(req.user!.id, req.user!.name, 'UPDATED_USER', 'users', user.id, `Updated user ${user.name}`);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    isActive: user.isActive,
    createdAt: user.createdAt,
  });
});

// ==========================================
// 13. AUDIT ACTIVITY LOGS
// ==========================================

const handleGetAuditLogs = (req: AuthRequest, res: Response) => {
  const db = getDb();
  res.json(db.activityLogs || []);
};
apiRouter.get('/admin/audit-logs', authenticate, handleGetAuditLogs);
apiRouter.get('/admin/activity-logs', authenticate, handleGetAuditLogs);

// ==========================================
// 14. MYSQL DATABASE MANAGEMENT & EXPORT
// ==========================================

apiRouter.get('/admin/database/status', authenticate, async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const isConnected = isMysqlConnected();
  
  const tables = [
    { name: 'settings', rows: 1 },
    { name: 'users', rows: db.users.length },
    { name: 'clients', rows: db.clients.length },
    { name: 'leads', rows: db.leads.length },
    { name: 'quotations', rows: db.quotations.length },
    { name: 'invoices', rows: db.invoices.length },
    { name: 'payments', rows: db.payments.length },
    { name: 'receipts', rows: db.receipts.length },
    { name: 'projects', rows: db.projects.length },
    { name: 'tasks', rows: db.tasks.length },
    { name: 'services', rows: db.services.length },
    { name: 'products', rows: db.products.length },
    { name: 'portfolio_projects', rows: db.portfolio.length },
    { name: 'articles', rows: db.articles.length },
    { name: 'team_members', rows: db.team.length },
    { name: 'testimonials', rows: db.testimonials.length },
    { name: 'media', rows: db.media.length },
    { name: 'navigation', rows: db.navigation.length },
    { name: 'activity_logs', rows: db.activityLogs.length },
  ];

  res.json({
    engine: 'MySQL 8.0+ Compatible',
    isDirectMysqlConnected: isConnected,
    activeHost: process.env.MYSQL_HOST || 'localhost',
    activeDatabase: process.env.MYSQL_DATABASE || 'saaslink_db',
    tables,
    totalRecords: tables.reduce((sum, t) => sum + t.rows, 0),
    storageMode: isConnected ? 'Remote MySQL Server' : 'Container Integrated Persistent Engine (MySQL Compatible)',
    migrationVersion: '001_saaslink_mysql_schema.sql',
  });
});

// Test custom MySQL connection parameters from UI
apiRouter.post('/admin/database/test-connection', authenticate, async (req: AuthRequest, res: Response) => {
  const { host, port, user, password, database } = req.body;
  try {
    const testPool = mysql.createPool({
      host: host || 'localhost',
      port: Number(port) || 3306,
      user: user || 'root',
      password: password || '',
      database: database || 'saaslink_db',
      connectTimeout: 4000,
    });
    const conn = await testPool.getConnection();
    await conn.ping();
    conn.release();
    await testPool.end();

    res.json({ 
      success: true, 
      message: `Successfully connected to MySQL database "${database || 'saaslink_db'}" on host "${host || 'localhost'}"!` 
    });
  } catch (err: any) {
    res.status(400).json({ 
      success: false, 
      error: `Could not connect to MySQL server: ${err.message}. Ensure MySQL server is running and accessible.` 
    });
  }
});

// Generate and export full MySQL Dump (.sql)
apiRouter.get('/admin/database/export-sql', authenticate, (req: AuthRequest, res: Response) => {
  const db = getDb();
  let sql = `-- ==========================================================\n`;
  sql += `-- SaaSLink Technologies Ltd - MySQL Database Dump\n`;
  sql += `-- Exported on: ${new Date().toISOString()}\n`;
  sql += `-- Engine: MySQL 8.0+ / MariaDB 10.5+\n`;
  sql += `-- ==========================================================\n\n`;
  sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  // Helper for escaping SQL strings
  const esc = (val: any): string => {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return String(val);
    if (typeof val === 'boolean') return val ? '1' : '0';
    if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
    return `'${String(val).replace(/'/g, "''")}'`;
  };

  // Insert settings
  sql += `-- Settings\n`;
  sql += `INSERT INTO \`settings\` (\`id\`, \`category\`, \`data\`) VALUES ('global', 'general', ${esc(db.settings)}) ON DUPLICATE KEY UPDATE \`data\` = VALUES(\`data\`);\n\n`;

  // Insert Users
  sql += `-- Users\n`;
  db.users.forEach(u => {
    sql += `INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password_hash\`, \`role\`, \`avatar_url\`, \`phone\`, \`is_active\`) VALUES (${esc(u.id)}, ${esc(u.name)}, ${esc(u.email)}, ${esc(u.passwordHash)}, ${esc(u.role)}, ${esc(u.avatarUrl)}, ${esc(u.phone)}, ${u.isActive ? 1 : 0}) ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);\n`;
  });
  sql += `\n`;

  // Insert Clients
  sql += `-- Clients\n`;
  db.clients.forEach(c => {
    sql += `INSERT INTO \`clients\` (\`id\`, \`name\`, \`company\`, \`email\`, \`phone\`, \`address\`, \`city\`, \`country\`, \`tax_id\`, \`contact_person\`, \`notes\`, \`status\`) VALUES (${esc(c.id)}, ${esc(c.name)}, ${esc(c.company)}, ${esc(c.email)}, ${esc(c.phone)}, ${esc(c.address)}, ${esc(c.city)}, ${esc(c.country)}, ${esc(c.taxId)}, ${esc(c.contactPerson)}, ${esc(c.notes)}, ${esc(c.status)}) ON DUPLICATE KEY UPDATE \`company\` = VALUES(\`company\`);\n`;
  });
  sql += `\n`;

  // Insert Leads
  sql += `-- Leads\n`;
  db.leads.forEach(l => {
    sql += `INSERT INTO \`leads\` (\`id\`, \`full_name\`, \`email\`, \`phone\`, \`company\`, \`service_of_interest\`, \`budget_range\`, \`timeline\`, \`message\`, \`type\`, \`status\`, \`notes\`) VALUES (${esc(l.id)}, ${esc(l.fullName)}, ${esc(l.email)}, ${esc(l.phone)}, ${esc(l.company)}, ${esc(l.serviceOfInterest)}, ${esc(l.budgetRange)}, ${esc(l.timeline)}, ${esc(l.message)}, ${esc(l.type)}, ${esc(l.status)}, ${esc(l.notes)}) ON DUPLICATE KEY UPDATE \`status\` = VALUES(\`status\`);\n`;
  });
  sql += `\n`;

  // Insert Quotations & Items
  sql += `-- Quotations\n`;
  db.quotations.forEach(q => {
    sql += `INSERT INTO \`quotations\` (\`id\`, \`quotation_number\`, \`client_id\`, \`client_name\`, \`client_company\`, \`client_email\`, \`client_phone\`, \`client_address\`, \`issue_date\`, \`expiry_date\`, \`currency\`, \`subtotal\`, \`discount_percent\`, \`discount_amount\`, \`tax_rate\`, \`tax_amount\`, \`total\`, \`notes\`, \`terms\`, \`status\`) VALUES (${esc(q.id)}, ${esc(q.quotationNumber)}, ${esc(q.clientId)}, ${esc(q.clientName)}, ${esc(q.clientCompany)}, ${esc(q.clientEmail)}, ${esc(q.clientPhone)}, ${esc(q.clientAddress)}, ${esc(q.issueDate)}, ${esc(q.expiryDate)}, ${esc(q.currency)}, ${q.subtotal}, ${q.discountPercent}, ${q.discountAmount}, ${q.taxRate}, ${q.taxAmount}, ${q.total}, ${esc(q.notes)}, ${esc(q.terms)}, ${esc(q.status)}) ON DUPLICATE KEY UPDATE \`total\` = VALUES(\`total\`);\n`;
    
    q.items.forEach(item => {
      sql += `INSERT INTO \`quotation_items\` (\`id\`, \`quotation_id\`, \`type\`, \`description\`, \`quantity\`, \`unit_price\`, \`discount\`, \`total\`) VALUES (${esc(item.id)}, ${esc(q.id)}, ${esc(item.type)}, ${esc(item.description)}, ${item.quantity}, ${item.unitPrice}, ${item.discount}, ${item.total}) ON DUPLICATE KEY UPDATE \`total\` = VALUES(\`total\`);\n`;
    });
  });
  sql += `\n`;

  // Insert Invoices & Items
  sql += `-- Invoices\n`;
  db.invoices.forEach(i => {
    sql += `INSERT INTO \`invoices\` (\`id\`, \`invoice_number\`, \`quotation_id\`, \`quotation_number\`, \`client_id\`, \`client_name\`, \`client_company\`, \`client_email\`, \`client_address\`, \`issue_date\`, \`due_date\`, \`currency\`, \`subtotal\`, \`discount_percent\`, \`discount_amount\`, \`tax_rate\`, \`tax_amount\`, \`total\`, \`amount_paid\`, \`balance_due\`, \`notes\`, \`status\`) VALUES (${esc(i.id)}, ${esc(i.invoiceNumber)}, ${esc(i.quotationId)}, ${esc(i.quotationNumber)}, ${esc(i.clientId)}, ${esc(i.clientName)}, ${esc(i.clientCompany)}, ${esc(i.clientEmail)}, ${esc(i.clientAddress)}, ${esc(i.issueDate)}, ${esc(i.dueDate)}, ${esc(i.currency)}, ${i.subtotal}, ${i.discountPercent}, ${i.discountAmount}, ${i.taxRate}, ${i.taxAmount}, ${i.total}, ${i.amountPaid}, ${i.balanceDue}, ${esc(i.notes)}, ${esc(i.status)}) ON DUPLICATE KEY UPDATE \`balance_due\` = VALUES(\`balance_due\`);\n`;
    
    i.items.forEach(item => {
      sql += `INSERT INTO \`invoice_items\` (\`id\`, \`invoice_id\`, \`description\`, \`quantity\`, \`unit_price\`, \`total\`) VALUES (${esc(item.id)}, ${esc(i.id)}, ${esc(item.description)}, ${item.quantity}, ${item.unitPrice}, ${item.total}) ON DUPLICATE KEY UPDATE \`total\` = VALUES(\`total\`);\n`;
    });
  });
  sql += `\n`;

  // Insert Payments & Receipts
  sql += `-- Payments\n`;
  db.payments.forEach(p => {
    sql += `INSERT INTO \`payments\` (\`id\`, \`receipt_number\`, \`invoice_id\`, \`invoice_number\`, \`client_id\`, \`client_name\`, \`payment_date\`, \`amount\`, \`currency\`, \`payment_method\`, \`payment_reference\`, \`notes\`, \`recorded_by\`) VALUES (${esc(p.id)}, ${esc(p.receiptNumber)}, ${esc(p.invoiceId)}, ${esc(p.invoiceNumber)}, ${esc(p.clientId)}, ${esc(p.clientName)}, ${esc(p.paymentDate)}, ${p.amount}, ${esc(p.currency)}, ${esc(p.paymentMethod)}, ${esc(p.paymentReference)}, ${esc(p.notes)}, ${esc(p.recordedBy)});\n`;
  });
  sql += `\n`;

  sql += `-- Receipts\n`;
  db.receipts.forEach(r => {
    sql += `INSERT INTO \`receipts\` (\`id\`, \`receipt_number\`, \`payment_id\`, \`invoice_id\`, \`invoice_number\`, \`client_id\`, \`client_name\`, \`client_company\`, \`payment_date\`, \`amount\`, \`currency\`, \`payment_method\`, \`payment_reference\`, \`notes\`) VALUES (${esc(r.id)}, ${esc(r.receiptNumber)}, ${esc(r.paymentId)}, ${esc(r.invoiceId)}, ${esc(r.invoiceNumber)}, ${esc(r.clientId)}, ${esc(r.clientName)}, ${esc(r.clientCompany)}, ${esc(r.paymentDate)}, ${r.amount}, ${esc(r.currency)}, ${esc(r.paymentMethod)}, ${esc(r.paymentReference)}, ${esc(r.notes)});\n`;
  });
  sql += `\n`;

  // Services, Products, Portfolio
  sql += `-- CMS Services\n`;
  db.services.forEach(s => {
    sql += `INSERT INTO \`services\` (\`id\`, \`title\`, \`slug\`, \`category\`, \`short_description\`, \`full_description\`, \`icon_name\`, \`features\`, \`benefits\`, \`display_order\`, \`is_featured\`, \`is_published\`) VALUES (${esc(s.id)}, ${esc(s.title)}, ${esc(s.slug)}, ${esc(s.category)}, ${esc(s.shortDescription)}, ${esc(s.fullDescription)}, ${esc(s.iconName)}, ${esc(s.features)}, ${esc(s.benefits)}, ${s.displayOrder}, ${s.isFeatured ? 1 : 0}, ${s.isPublished ? 1 : 0}) ON DUPLICATE KEY UPDATE \`title\` = VALUES(\`title\`);\n`;
  });
  sql += `\n`;

  sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;

  res.setHeader('Content-Type', 'application/sql');
  res.setHeader('Content-Disposition', 'attachment; filename="saaslink_mysql_dump.sql"');
  res.send(sql);
});

// Fallback 404 handler for any unmapped API endpoints
apiRouter.use((req: Request, res: Response) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

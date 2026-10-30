import React, { useState } from 'react';
import { 
  Layers, ArrowRight, CheckCircle2, ShieldCheck, 
  ExternalLink, Sparkles, Building2, GraduationCap, 
  Cpu, Activity, Zap, Church, Users, HeartHandshake, Check, ShoppingBag, Home,
  Play
} from 'lucide-react';
import { Product } from '../../types.ts';

interface ProductsShowcaseProps {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onRequestDemo?: (productName: string) => void;
  onScheduleDemo?: (productName: string) => void;
}

const DEFAULT_SECTOR_PRODUCTS: Product[] = [
  {
    id: 'prd_propcloud',
    name: 'PropCloud360 Property Management System',
    slug: 'propcloud360',
    tagline: 'Commercial & Residential Real Estate Portfolio Operating System',
    shortDescription: 'Cloud property operating platform managing thousands of units across East Africa with automated M-Pesa rent collections, tenant portals, and landlord remittance payouts.',
    fullDescription: 'PropCloud360 eliminates property management headaches. It handles unit vacancy grids, digital lease agreements, automated monthly rent invoices via SMS, instant M-Pesa Paybill matching, tenant photo maintenance ticketing, and one-click multi-owner landlord remittance payout statements.',
    logoUrl: '/assets/propcloud-icon.svg',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Visual Unit Inventory, Tenant Screening & Lease Expiry Alerts',
      'Automated Monthly Rent Demands with M-Pesa STK Push',
      'Instant M-Pesa Paybill Rent Reconciliation with Zero Lag',
      'Tenant Portal for Photo Maintenance Requests & Work Orders',
      'One-Click Landlord Remittance Statements with Commission Deductions',
    ],
    benefits: [
      'Reduce rent arrears by up to 88% through automated SMS reminders',
      'Generate owner statements in under 30 seconds with complete audit proof',
      'Track technician maintenance dispatch and tenant approvals digitally',
    ],
    industries: ['Commercial Plazas', 'Residential Estates', 'Property Management Agencies', 'Real Estate'],
    techStack: ['React', 'Node.js', 'MySQL 8', 'M-Pesa Daraja C2B', 'AWS Cloud'],
    pricingModel: 'Tiered per managed unit or enterprise white-label license',
    demoUrl: '/contact?product=propcloud360',
    ctaLabel: 'Book PropCloud360 Demo',
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'prd_pijoshop',
    name: 'Pijo Shop Automated Inventory & Marketplace',
    slug: 'pijo-shop',
    tagline: 'Automated Inventory Management & Multi-Channel Marketplace for Fashion & Footwear SMEs (app.pijo.shop)',
    shortDescription: 'Cloud inventory management, barcode variant tracking (sizes/colors/half-sizes), point-of-sale (POS), and multi-vendor marketplace engine designed specifically for footwear and fashion merchants across East Africa (as seen on app.pijo.shop).',
    fullDescription: 'Pijo Shop (accessible live at app.pijo.shop) eliminates chaotic stockouts and multi-channel sales bottlenecks for fashion and footwear retailers, boutique shoe brands, and apparel importers. It provides matrix variant tracking (shoe sizes EU/UK/US 35-46, colorways, widths, and materials), instant stock synchronization between physical shops and the online marketplace, automated WhatsApp/SMS order notifications, M-Pesa automated cashiering, and parcel courier dispatch integrations (G4S, Fargo, Sendy, local riders).',
    logoUrl: '/assets/pijoshop-icon.svg',
    heroImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Footwear & Fashion Matrix Inventory (Sizes 35-46, Half-Sizes, Colors, Widths, Materials)',
      'Barcode / QR Scanner Integration & Multi-Store Physical Shop Inventory Sync',
      'Multi-Channel Marketplace Engine Connecting Merchants to Buyers (app.pijo.shop)',
      'Integrated Point-of-Sale (POS) with Instant M-Pesa STK Push Confirmation',
      'Automated WhatsApp Order Invoices, Delivery Tracking Links & Rider Waybills',
      'Fast-Moving SKU Analytics, Dead-Stock Alerts & Automated Supplier Restocking',
    ],
    benefits: [
      'Eliminate double-selling across Instagram/TikTok DMs, physical retail shops, and online marketplace',
      'Cut fashion and shoe inventory reconciliation time by 85%',
      'Speed up customer checkout to under 12 seconds with instant automated M-Pesa verification',
    ],
    industries: ['Fashion Retailers', 'Footwear Boutiques', 'Shoe Importers & Wholesalers', 'Apparel Brands', 'SME Merchants'],
    techStack: ['React / Next.js', 'Node.js', 'PostgreSQL / MySQL', 'M-Pesa Daraja STK Push', 'WhatsApp Business Cloud API', 'Redis Cache'],
    pricingModel: 'SME Merchant Monthly Subscription & Commission-Free Growth Tier',
    demoUrl: 'https://app.pijo.shop',
    ctaLabel: 'Launch Pijo Shop (app.pijo.shop)',
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'prd_masuma',
    name: 'MASUMA ERP System',
    slug: 'masuma-erp',
    tagline: 'Multi-Branch Enterprise Resource Planning & Distribution Engine',
    shortDescription: 'The enterprise ERP standard for automotive spare parts, wholesale distributors, and multi-warehouse supply networks with native KRA eTIMS.',
    fullDescription: 'MASUMA ERP is purpose-built for high-volume wholesale, retail distribution, and automotive parts networks. It unifies inventory across multiple warehouses and branch showrooms, features chassis/VIN fitment lookups, generates real-time KRA eTIMS compliant cryptographic QR invoices, and manages multi-tier purchase order approvals.',
    logoUrl: '/assets/masuma-icon.svg',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Multi-Warehouse Real-Time Inventory Synchronization',
      'KRA eTIMS Verified Cryptographic QR Tax Invoicing',
      'Chassis / VIN Number Part Fitment & Catalogue Search',
      'Wholesale Tiered Volume Pricing & Retail Branch POS',
      'Automated Kenyan Payroll (PAYE, SHA, NSSF, Housing Levy)',
    ],
    benefits: [
      'Eliminate stock mismatches across physical branches and warehouses',
      '100% compliant with Kenya Revenue Authority eTIMS mandates',
      'Cut monthly inventory reconciliation time from 5 days to 20 minutes',
    ],
    industries: ['Automotive Parts', 'Wholesale Distributors', 'Multi-Branch Retailers', 'Corporates'],
    techStack: ['TypeScript', 'React', 'Node.js', 'MySQL 8', 'KRA eTIMS API'],
    pricingModel: 'Enterprise Dedicated Cloud or On-Premise License',
    demoUrl: '/contact?product=masuma-erp',
    ctaLabel: 'Request MASUMA ERP Demo',
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'prd_raphamis',
    name: 'RaphaMIS Hospital Management System',
    slug: 'raphamis-hmis',
    tagline: 'Complete Clinical Workflow, EMR & Hospital Information Platform',
    shortDescription: 'Connected HMIS uniting patient triage, doctor consultation queues, Electronic Medical Records (EMR), laboratory testing, pharmacy dispensing, and SHA/NHIF billing.',
    fullDescription: 'RaphaMIS transforms hospitals and medical clinics from paper-file delays to seamless digital clinical delivery. From the moment a patient checks into triage to doctor consultation, electronic prescriptions, laboratory diagnostic queues, and automated cashiering, RaphaMIS secures patient records and prevents billing revenue leakages.',
    logoUrl: '/assets/raphamis-icon.svg',
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Outpatient (OPD) & Inpatient (IPD) Bed Management & Triage',
      'Electronic Medical Records (EMR) & Clinical Consultation Notes',
      'Diagnostic Laboratory (LIMS) Queue & Digital Result Dispatch',
      'Pharmacy Batch Inventory, Expiry Warnings & Dispensing Control',
      'Social Health Authority (SHA/NHIF) & Private Insurance Pre-Auth',
    ],
    benefits: [
      'Reduce patient waiting time from 3 hours to under 25 minutes',
      'Cut private and SHA insurance claim rejections by 64%',
      'Eliminate medication leakage and unrecorded pharmacy sales',
    ],
    industries: ['Hospitals & Medical Centres', 'Specialist Outpatient Clinics', 'Diagnostic Laboratories', 'Healthcare'],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL / MySQL', 'HL7 FHIR'],
    pricingModel: 'Hospital Tiered Appliance or Managed Cloud SLA',
    demoUrl: '/contact?product=raphamis',
    ctaLabel: 'Book RaphaMIS Demo',
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'prd_aura',
    name: 'Aura Utility Management System',
    slug: 'aura-utilities',
    tagline: 'Smart Metering, Water Board Billing & Automated Token Vending',
    shortDescription: 'Smart utility operating platform for water service providers, community boreholes, irrigation schemes, and sub-metered power grids with automated token vending.',
    fullDescription: 'Aura Utility Management automates revenue collection and leak detection for water service companies, community boreholes, and commercial sub-metered estates. Features mobile meter reader apps, tiered consumption tariffs, automated water token vending via M-Pesa, and non-revenue water recovery telemetry.',
    logoUrl: '/assets/aura-icon.svg',
    heroImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Customer Meter Account Profiling & Geotagged Locations',
      'Tiered Block Consumption Tariffs & Automated Monthly Bill Run',
      'Automated M-Pesa Water Token Generation & Instant SMS Receipts',
      'Field Meter Reader Mobile App with GPS & Photo Proof',
      'Non-Revenue Water Loss Detection Comparing Bulk & Branch Meters',
    ],
    benefits: [
      'Recover up to 42% of previously lost non-revenue water',
      'Achieve 94%+ on-time monthly utility bill collection via M-Pesa',
      'Instant prepaid token delivery directly to customer mobile phones',
    ],
    industries: ['County Water Service Providers (WSPs)', 'Community Boreholes', 'Sub-Metered Estates', 'Utilities'],
    techStack: ['TypeScript', 'Node.js', 'MySQL', 'M-Pesa Daraja API', 'Africa\'s Talking SMS'],
    pricingModel: 'Utility Meter Subscription or Enterprise Municipal License',
    demoUrl: '/contact?product=aura',
    ctaLabel: 'Request Aura Utility Demo',
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'prd_emis',
    name: 'EMIS Education Management System',
    slug: 'emis-education',
    tagline: 'Institutional School Governance, CBC Grading & Academic Operations Suite',
    shortDescription: 'Comprehensive academic ERP powering primary, secondary, and tertiary colleges with CBC grading, M-Pesa fee receipts, biometric gate attendance, and parent SMS alerts.',
    fullDescription: 'EMIS digitizes the entire student and institutional lifecycle. From admission inquiries, automated fee invoicing, and instant M-Pesa Paybill matching to digital CBC competency report cards, exam ranking, biometric/RFID gate attendance, and conflict-free timetables.',
    logoUrl: '/assets/emis-icon.svg',
    heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Student Enrollment, Bio Profiles & CBC Assessment Matrix',
      'Instant M-Pesa Paybill Fee Reconciliation & Parent SMS Receipts',
      'Parent Mobile Portal for Fee Balance & Printable Report Cards',
      'Conflict-Free School Timetabling & Teacher Allocation',
      'Biometric / RFID Student Gate Check-in Telemetry',
    ],
    benefits: [
      'Eliminate manual bank slip verification with instant automated matching',
      'Increase on-time fee settlement to over 92% through automated SMS alerts',
      '100% compliant with Ministry of Education CBC reporting standards',
    ],
    industries: ['K-12 Day & Boarding Schools', 'International Academies', 'Tertiary Colleges', 'Education'],
    techStack: ['Next.js', 'Node.js', 'MySQL', 'Africa\'s Talking SMS', 'Tailwind CSS'],
    pricingModel: 'Per-student annual licensing with dedicated server hosting',
    demoUrl: '/contact?product=emis-education',
    ctaLabel: 'Explore EMIS System',
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'prd_ecclesiah',
    name: 'Ecclesiah Church Management System',
    slug: 'ecclesiah-church',
    tagline: 'Parish Administration, Member Stewardship & Financial Ministry System',
    shortDescription: 'Faith-based administration software for churches and dioceses to manage membership records, cell groups, tithes & offerings M-Pesa reconciliation, and building pledge campaigns.',
    fullDescription: 'Ecclesiah brings financial transparency, administrative ease, and pastoral care together. It manages member profiles, family trees, and sacramental registers while automating Sunday tithes, thanksgiving, and sadaka reconciliation via M-Pesa Paybill. It tracks building pledges (harambee) and sends targeted bulk SMS to ministry departments.',
    logoUrl: '/assets/ecclesiah-icon.svg',
    heroImage: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Member Directory, Family Heads & Sacramental Registries',
      'Automated Tithes, Thanksgiving & Offering M-Pesa Reconciliation',
      'Building Fund Pledges (Harambee) & Special Project Tracking',
      'Cell Groups, Home Fellowships & Department Roster Management',
      'Targeted Congregational Bulk SMS & Pastoral Event Alerts',
    ],
    benefits: [
      '100% accurate Sunday giving reconciliation with automated thank-you SMS',
      'Zero lost member records across multi-service and multi-parish branches',
      'Instant financial accountability reports for parish councils and trustees',
    ],
    industries: ['Churches & Megaministries', 'Dioceses & Parishes', 'Faith-Based Charities', 'Religious Entities'],
    techStack: ['React', 'TypeScript', 'Node.js', 'MySQL 8', 'M-Pesa Daraja Paybill'],
    pricingModel: 'Tiered Congregational Size License with Cloud Hosting',
    demoUrl: '/contact?product=ecclesiah-church',
    ctaLabel: 'Request Ecclesiah Demo',
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'prd_hakihali',
    name: 'Haki Hali Civic Transparency System',
    slug: 'haki-hali-civic',
    tagline: 'Public Accountability, Civic Education & Non-Profit Transparency Platform',
    shortDescription: 'Public interest platform for NGOs, civil society organizations, and donor programs to track public budgets, conduct offline mobile surveys, and generate audit-proof donor compliance reports.',
    fullDescription: 'Haki Hali empowers non-profits, civil society, donor programs, and community advocates to deliver verifiable impact. It features public budget expenditure tracking, civic education modules, offline-first mobile survey collection with GPS timestamps, citizen feedback loops, and immutable audit logs that satisfy USAID, EU, and UN donor compliance.',
    logoUrl: '/assets/hakihali-icon.svg',
    heroImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80',
    ],
    features: [
      'Public Budget & County Project Expenditure Tracking',
      'Civic Education Learning Modules & Community Resources',
      'Offline-First Field Survey Collection with GPS Timestamping',
      'Citizen Grievance & Service Delivery Feedback Loop',
      'Donor Grant Accountability & Audit-Proof Compliance Reports',
    ],
    benefits: [
      '100% donor audit clean rate for multi-currency humanitarian grants',
      'Enable field data collectors to work in remote rural areas with zero internet',
      'Immutable audit trails preventing unauthorized tampering with records',
    ],
    industries: ['Non-Profits & NGOs', 'Civil Society Organizations', 'Donor-Funded Programs', 'Civic & Governance'],
    techStack: ['React PWA', 'Node.js & Python', 'PostgreSQL', 'Offline IndexedDB', 'Cryptographic Audit Hash'],
    pricingModel: 'Non-Profit Program License with Dedicated Technical Support',
    demoUrl: '/contact?product=haki-hali',
    ctaLabel: 'Request Haki Hali Demo',
    isFeatured: true,
    isPublished: true,
  },
];

// Strict priority order requested by user:
// 1. PropCloud360 Property Management
// 2. Pijo Shop (app.pijo.shop) Automated Fashion & Footwear Inventory
// 3. MASUMA ERP
// 4. RaphaMIS Hospital
// 5. Aura Utility
// 6. EMIS Education
// 7. Ecclesiah Church
// 8. Haki Hali Civic
const PRODUCT_PRIORITY_ORDER = [
  'propcloud360',
  'pijo-shop',
  'masuma-erp',
  'raphamis-hmis',
  'raphamis-hospital',
  'aura-utilities',
  'aura-utility',
  'emis-education',
  'ecclesiah-church',
  'haki-hali-civic',
  'haki-hali',
];

export const ProductsShowcase: React.FC<ProductsShowcaseProps> = ({
  products = [],
  onSelectProduct,
  onRequestDemo,
  onScheduleDemo,
}) => {
  const handleDemo = onScheduleDemo || onRequestDemo || (() => {});
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  // Merge loaded products with default sector platforms
  const rawList = (products && products.length > 0) ? products : DEFAULT_SECTOR_PRODUCTS;
  
  // Ensure the core platforms exist even if API only returned partial
  const mergedProducts = [...rawList];
  DEFAULT_SECTOR_PRODUCTS.forEach(defProd => {
    if (!mergedProducts.some(p => p.slug === defProd.slug || p.name.toLowerCase() === defProd.name.toLowerCase())) {
      mergedProducts.push(defProd);
    }
  });

  // Sort strictly according to the specified hierarchy: PropCloud360 first, Pijo Shop second, then others
  mergedProducts.sort((a, b) => {
    const idxA = PRODUCT_PRIORITY_ORDER.indexOf(a.slug);
    const idxB = PRODUCT_PRIORITY_ORDER.indexOf(b.slug);
    const orderA = idxA !== -1 ? idxA : 999;
    const orderB = idxB !== -1 ? idxB : 999;
    return orderA - orderB;
  });

  const filterTabs = [
    { id: 'All', label: 'All Sector Platforms (8)' },
    { id: 'Real Estate', label: 'Property (PropCloud360)' },
    { id: 'Fashion & Retail', label: 'Fashion & Footwear (Pijo Shop)' },
    { id: 'Corporates', label: 'Corporates & ERP (MASUMA)' },
    { id: 'Healthcare', label: 'Hospital & Clinical (RaphaMIS)' },
    { id: 'Utilities', label: 'Water & Utilities (Aura)' },
    { id: 'Education', label: 'Schools & Colleges (EMIS)' },
    { id: 'Religious Entities', label: 'Churches & Faith (Ecclesiah)' },
    { id: 'Civic & Governance', label: 'Non-Profits & Civic (Haki Hali)' },
  ];

  const filteredProducts = selectedFilter === 'All'
    ? mergedProducts
    : mergedProducts.filter(p => {
        const indString = (p.industries || []).join(' ').toLowerCase();
        const nameString = (p.name + ' ' + p.tagline + ' ' + p.shortDescription).toLowerCase();
        if (selectedFilter === 'Real Estate') return indString.includes('real estate') || indString.includes('propert') || nameString.includes('propcloud');
        if (selectedFilter === 'Fashion & Retail') return indString.includes('fashion') || indString.includes('footwear') || indString.includes('shoe') || nameString.includes('pijo');
        if (selectedFilter === 'Corporates') return indString.includes('corporate') || indString.includes('wholesale') || indString.includes('parts') || nameString.includes('masuma');
        if (selectedFilter === 'Healthcare') return indString.includes('hospital') || indString.includes('health') || nameString.includes('raphamis');
        if (selectedFilter === 'Utilities') return indString.includes('utilit') || indString.includes('water') || nameString.includes('aura');
        if (selectedFilter === 'Education') return indString.includes('education') || indString.includes('school') || nameString.includes('emis');
        if (selectedFilter === 'Religious Entities') return indString.includes('church') || indString.includes('faith') || indString.includes('religious') || nameString.includes('ecclesiah');
        if (selectedFilter === 'Civic & Governance') return indString.includes('non-profit') || indString.includes('ngo') || indString.includes('civic') || nameString.includes('haki');
        return true;
      });

  return (
    <section id="solutions" className="py-16 sm:py-24 bg-[oklch(0.28_0.038_165)] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
            Production-Tested Sector Platforms
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-sans">
            Flagship Sector Softwares <span className="text-gradient-gold">Built for Real Operations</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Ready-to-deploy enterprise software systems calibrated for East African market demands — starting with PropCloud360 property management, Pijo Shop automated fashion & footwear inventory, through MASUMA ERP, healthcare, utilities, CBC education, and civic transparency.
          </p>
        </div>

        {/* Sector Tabs Filter */}
        <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center items-center gap-2 mb-10 sm:mb-14 pb-2 sm:pb-0 px-2 sm:px-0 -mx-4 sm:mx-0 px-4 sm:px-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[44px] flex items-center justify-center whitespace-nowrap ${
                selectedFilter === tab.id
                  ? 'bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold shadow-gold'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="space-y-8 sm:space-y-12">
          {filteredProducts.map((product, idx) => {
            const isReversed = idx % 2 === 1;
            const isPijo = product.slug === 'pijo-shop' || product.demoUrl?.includes('pijo.shop');
            const isPropCloud = product.slug === 'propcloud360';
            return (
              <div
                key={product.id || product.slug}
                className={`rounded-2xl sm:rounded-3xl bg-[oklch(0.34_0.045_165/0.8)] border overflow-hidden shadow-elegant p-5 sm:p-8 lg:p-10 text-left transition-all duration-300 backdrop-blur-md ${
                  idx === 0 
                    ? 'border-[oklch(0.78_0.12_78/0.5)] shadow-gold' 
                    : idx === 1 
                      ? 'border-cyan-500/40' 
                      : 'border-white/10 hover:border-[oklch(0.78_0.12_78/0.4)]'
                }`}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center`}>
                  
                  {/* Content Column */}
                  <div className={`lg:col-span-7 space-y-5 sm:space-y-6 ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      {idx === 0 && (
                        <span className="px-3 py-1 rounded-full bg-[oklch(0.78_0.12_78/0.2)] text-[oklch(0.85_0.12_80)] border border-[oklch(0.78_0.12_78/0.5)] text-[11px] font-bold uppercase tracking-wider font-mono">
                          ★ Featured Flagship #1: Property Management
                        </span>
                      )}
                      {idx === 1 && (
                        <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold uppercase tracking-wider font-mono">
                          ★ Featured Platform #2: Fashion & Footwear Marketplace
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-[oklch(0.78_0.12_78/0.15)] text-[oklch(0.85_0.12_80)] border border-[oklch(0.78_0.12_78/0.3)] text-[11px] font-semibold uppercase tracking-wider font-mono">
                        {product.pricingModel || 'Enterprise Licensed'}
                      </span>
                      {(product.industries || []).map((ind, iIdx) => (
                        <span key={iIdx} className="px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 text-xs border border-white/10">
                          {ind}
                        </span>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                        <span>{product.name}</span>
                        {isPijo && (
                          <span className="px-2.5 py-0.5 rounded-md bg-cyan-400 text-slate-950 text-xs font-mono font-bold">
                            app.pijo.shop
                          </span>
                        )}
                      </h3>
                      <p className="text-[oklch(0.78_0.12_78)] text-xs sm:text-sm font-semibold mt-1">
                        {product.tagline}
                      </p>
                    </div>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                      {product.shortDescription}
                    </p>

                    {/* Features List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                      {(product.features || []).slice(0, 4).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-[oklch(0.78_0.12_78)] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">System Stack:</span>
                      {(product.techStack || []).map((tech, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-black/30 border border-white/10 text-slate-300 font-mono text-[11px]">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {isPijo ? (
                        <>
                          <a
                            href="https://app.pijo.shop"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold text-xs transition-all shadow-gold hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 min-h-[44px] text-center"
                          >
                            <span>Launch Pijo Shop (app.pijo.shop)</span>
                            <ExternalLink className="w-4 h-4 shrink-0" />
                          </a>
                          <button
                            onClick={() => handleDemo('Pijo Shop Footwear & Fashion Inventory')}
                            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-2 min-h-[44px] text-center"
                          >
                            <span>Schedule Merchant Onboarding</span>
                            <ArrowRight className="w-4 h-4 shrink-0" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleDemo(product.name)}
                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-semibold text-xs transition-all shadow-gold hover:-translate-y-0.5 cursor-pointer inline-flex items-center justify-center gap-2 min-h-[44px] text-center"
                        >
                          <span>{product.ctaLabel || 'Request Solution Demo'}</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </button>
                      )}

                      <button
                        onClick={() => onSelectProduct(product)}
                        className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/15 text-xs font-medium transition-all cursor-pointer inline-flex items-center justify-center gap-2 min-h-[44px] text-center"
                      >
                        <span>View Specifications</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Preview Column */}
                  <div className={`lg:col-span-5 ${isReversed ? 'lg:order-1' : ''}`}>
                    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-xl group">
                      {product.heroImage ? (
                        <img 
                          src={product.heroImage} 
                          alt={product.name} 
                          className="w-full h-56 sm:h-72 lg:h-84 object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-56 sm:h-72 flex items-center justify-center bg-black/40">
                          <Layers className="w-16 h-16 text-[oklch(0.78_0.12_78/0.4)]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {product.videoUrl && (
                        <button
                          onClick={() => onSelectProduct(product)}
                          className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-[oklch(0.85_0.12_80)] border border-[oklch(0.78_0.12_78/0.5)] backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer shadow-lg"
                        >
                          <Play className="w-3.5 h-3.5 fill-[oklch(0.85_0.12_80)]" />
                          <span>Watch Video Demo</span>
                        </button>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-slate-200 font-medium">
                            {isPijo ? 'Live Cloud Application (app.pijo.shop)' : '100% Client IP & Source Ownership'}
                          </span>
                        </div>
                        <span className="text-[oklch(0.85_0.12_80)] font-mono text-[11px]">
                          {product.techStack?.[0] || 'Cloud Native'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

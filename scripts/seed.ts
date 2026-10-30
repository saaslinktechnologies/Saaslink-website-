import fs from 'fs';
import path from 'path';
import { getDb, createInitialDataset } from '../src/server/db.ts';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

console.log('----------------------------------------------------');
console.log(' SaaSLink Technologies Ltd - Database Seeder');
console.log('----------------------------------------------------');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Generate clean pristine seed data
  console.log('[1/3] Generating initial enterprise dataset...');
  const db = getDb();

  console.log('[2/3] Verification of database records:');
  console.log(`  ✓ Users:        ${db.users.length} seeded`);
  console.log(`  ✓ Clients:      ${db.clients.length} seeded`);
  console.log(`  ✓ Leads:        ${db.leads.length} seeded`);
  console.log(`  ✓ Quotations:   ${db.quotations.length} seeded`);
  console.log(`  ✓ Invoices:     ${db.invoices.length} seeded`);
  console.log(`  ✓ Payments:     ${db.payments.length} seeded`);
  console.log(`  ✓ Receipts:     ${db.receipts.length} seeded`);
  console.log(`  ✓ Projects:     ${db.projects.length} seeded`);
  console.log(`  ✓ Tasks:        ${db.tasks.length} seeded`);
  console.log(`  ✓ Services:     ${db.services.length} seeded`);
  console.log(`  ✓ Products:     ${db.products.length} seeded`);
  console.log(`  ✓ Case Studies: ${db.portfolio.length} seeded`);
  console.log(`  ✓ Articles:     ${db.articles.length} seeded`);
  console.log(`  ✓ Media Items:  ${db.media.length} seeded`);

  console.log('[3/3] Master Admin Credentials:');
  console.log('  → Email:    admin@saaslink.tech');
  console.log('  → Password: admin123');
  console.log('  → Role:     Super Administrator');
  console.log('----------------------------------------------------');
  console.log(' Database is ready! Location: data/database.json');
  console.log('----------------------------------------------------');
} catch (err: any) {
  console.error('Failed to seed database:', err.message);
  process.exit(1);
}

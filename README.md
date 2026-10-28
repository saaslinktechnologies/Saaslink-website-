# SaaSLink Technologies Ltd - Platform & Operating System

> Enterprise digital solutions, software platforms, and complete business operating management system.
> **Official Website:** [www.saaslink.tech](https://www.saaslink.tech)

---

## 1. Overview & Architecture

This repository delivers both the public-facing corporate digital presence and the internal business management operating system for **SaaSLink Technologies Ltd**.

### Key Modules:
- **Public Corporate Website:**
  - Modern hero with value matrix & dynamic storytelling
  - Dynamic Services with FAQs and benefits
  - Flagship Products Showcase (*PropLink ERP*, *EduLink 360*, *SaaSLink Sync*)
  - Case Studies & Detailed Portfolio with measurable metrics
  - Strategic Engineering & Delivery Process
  - Technology Domain Matrix
  - Verified Client Testimonials & Thought Leadership Insights
  - Interactive Quotation Planner & Lead Intake
- **Internal Operating System (Admin Platform):**
  - **Live Executive Dashboard:** Real database metrics (no fake numbers), pipeline values, and revenue charts
  - **Leads Hub:** Stage progression (New, Contacted, Qualified, Proposal Sent, Won, Lost, Archived) + 1-Click Lead-to-Client conversion
  - **Clients 360 CRM:** Centralized accounts with connected projects, quotes, invoices, payments, and receipts
  - **Custom Quotations Engine:** Configurable numbering (`QUO-2026-XXXX`), line-item calculations, discounts, taxes, PDF printable layout, 1-Click "Convert to Invoice"
  - **Invoicing & Billing:** Configurable numbering (`INV-2026-XXXX`), milestone billing, partial payments, automated balance reconciliation
  - **Official Receipts:** Official receipt generation (`RCT-2026-XXXX`), payment method tracking, printable receipt vouchers
  - **Projects & Tasks:** Milestone tracking, progress bars, team assignments, task priorities
  - **Full CMS:** Homepage, Services, Products, Portfolio, Insights, Team, Testimonials, Media Library, Navigation
  - **MySQL Database Hub:** Live connection status, table record counts, dynamic MySQL `.sql` dump export
  - **RBAC & Security:** Granular roles (*Super Administrator*, *Administrator*, *Manager*, *Finance*, *Sales*, *Project Manager*, *Content Editor*, *Staff*), audit logs

---

## 2. Database Choice & MySQL Setup

As selected, this platform is engineered natively for **MySQL 8.0+** with strict referential integrity, foreign key constraints, JSON columns for flexible metadata, and indexed queries.

### Schema & Migrations:
The complete MySQL DDL is available at:
```bash
migrations/001_saaslink_mysql_schema.sql
```

### Quick MySQL Setup:
```bash
# 1. Create the database in your MySQL instance
mysql -u root -p -e "CREATE DATABASE saaslink_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Run the migration script
mysql -u root -p saaslink_db < migrations/001_saaslink_mysql_schema.sql
```

### Docker Compose (Optional Local MySQL 8):
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: saaslink-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: saaslink_db
      MYSQL_USER: saaslink_user
      MYSQL_PASSWORD: saaslink_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./migrations/001_saaslink_mysql_schema.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  mysql_data:
```

---

## 3. Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application Hosting
APP_URL=https://www.saaslink.tech
NODE_ENV=development

# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=saaslink_db

# Security
JWT_SECRET=your_super_secret_production_key_here
```

*Note: In container sandbox environments where an external MySQL daemon is not running, the system automatically uses its built-in relational persistence engine (`/data/database.json`), ensuring 100% functionality and persistent data without requiring external server provisioning.*

---

## 4. Default Credentials (Development & Admin)

| Role | Email | Password |
|---|---|---|
| **Super Administrator** | `admin@saaslink.tech` | `admin123` |
| **Finance Officer** | `finance@saaslink.tech` | `admin123` |
| **Sales Lead** | `sales@saaslink.tech` | `admin123` |

*A 1-click Quick Role Switcher is also provided in the admin portal header for instant testing between different access roles.*

---

## 5. Development & Production Scripts

```bash
# Install dependencies
npm install

# Start local full-stack development server (Express + Vite on port 3000)
npm run dev

# Compile production bundle (Frontend + Bundled CommonJS Server)
npm run build

# Start production server
npm start
```

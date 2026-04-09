-- ============================================================================
-- SafetyScore — MySQL Schema (migrado de Supabase PostgreSQL)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS safetyscore;
USE safetyscore;

-- ─────────────────────────────────────────────────────────────────────────────
-- USERS: Reemplaza auth.users de Supabase
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(36) PRIMARY KEY,
  role ENUM('pyme', 'investor') NOT NULL,
  full_name VARCHAR(255) NOT NULL DEFAULT '',
  avatar_url TEXT,
  nessie_customer_id VARCHAR(100),
  nessie_account_id VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- BUSINESSES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS businesses (
  id CHAR(36) PRIMARY KEY,
  owner_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL DEFAULT 'Otro',
  location_city VARCHAR(100) NOT NULL DEFAULT '',
  location_state VARCHAR(10) NOT NULL DEFAULT '',
  years_operating INT DEFAULT 0,
  employees INT DEFAULT 1,
  daily_sales DECIMAL(12, 2) DEFAULT 0,
  fixed_costs DECIMAL(12, 2) DEFAULT 0,
  variable_costs DECIMAL(12, 2) DEFAULT 0,
  has_debts TINYINT(1) DEFAULT 0,
  debt_amount DECIMAL(12, 2) DEFAULT 0,
  safety_score INT CHECK (safety_score BETWEEN 0 AND 100),
  safety_sub_cashflow INT CHECK (safety_sub_cashflow BETWEEN 0 AND 100),
  safety_sub_sector INT CHECK (safety_sub_sector BETWEEN 0 AND 100),
  safety_sub_consistency INT CHECK (safety_sub_consistency BETWEEN 0 AND 100),
  safety_sub_return_probability INT CHECK (safety_sub_return_probability BETWEEN 0 AND 100),
  trust_layer_analysis TEXT,
  status ENUM('draft', 'evaluating', 'scored', 'published', 'funded') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- OPPORTUNITIES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS opportunities (
  id CHAR(36) PRIMARY KEY,
  business_id CHAR(36) NOT NULL,
  requested_amount DECIMAL(12, 2) NOT NULL,
  funded_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  expected_roi DECIMAL(5, 2) NOT NULL DEFAULT 0,
  term_months INT NOT NULL DEFAULT 6,
  fund_destination VARCHAR(255) DEFAULT 'Capital de Trabajo',
  description TEXT,
  status ENUM('open', 'funded', 'active', 'completed') NOT NULL DEFAULT 'open',
  funded_percentage DECIMAL(5, 1) GENERATED ALWAYS AS (
    CASE WHEN requested_amount > 0
      THEN ROUND((funded_amount / requested_amount) * 100, 1)
      ELSE 0
    END
  ) STORED,
  marketplace_status ENUM('new', 'high-demand', 'last-day') NOT NULL DEFAULT 'new',
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closes_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- INVESTMENTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS investments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  investor_id CHAR(36) NOT NULL,
  opportunity_id CHAR(36) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  nessie_transfer_id VARCHAR(100),
  status ENUM('active', 'payment-due', 'overdue', 'completed') NOT NULL DEFAULT 'active',
  next_payment_date DATE,
  monthly_payment DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (investor_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- OPPORTUNITY_VIEWS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS opportunity_views (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  opportunity_id CHAR(36) NOT NULL,
  investor_id CHAR(36) NOT NULL,
  viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (investor_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'payment') NOT NULL DEFAULT 'info',
  `read` TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- BUSINESS_FINANCIAL_RECORDS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS business_financial_records (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  business_id CHAR(36) NOT NULL,
  record_month VARCHAR(7) NOT NULL,
  income DECIMAL(12, 2) NOT NULL DEFAULT 0,
  expenses DECIMAL(12, 2) NOT NULL DEFAULT 0,
  balance DECIMAL(12, 2) GENERATED ALWAYS AS (income - expenses) STORED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- PAYMENTS (Amortizations)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  investment_id CHAR(36) NOT NULL,
  amount_paid DECIMAL(12, 2) NOT NULL,
  paid_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('completed', 'failed', 'pending') NOT NULL DEFAULT 'completed',
  FOREIGN KEY (investment_id) REFERENCES investments(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- CONTRACTS (Agreements)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contracts (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  opportunity_id CHAR(36) NOT NULL,
  investor_id CHAR(36) NOT NULL,
  document_url TEXT,
  status ENUM('pending', 'signed', 'rejected') NOT NULL DEFAULT 'signed',
  signed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (investor_id) REFERENCES profiles(id) ON DELETE CASCADE
);

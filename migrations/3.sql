
-- Add fiat conversion settings to establishments
ALTER TABLE establishments ADD COLUMN auto_convert_enabled BOOLEAN DEFAULT 0;
ALTER TABLE establishments ADD COLUMN auto_convert_percent REAL DEFAULT 0;
ALTER TABLE establishments ADD COLUMN bank_account_holder TEXT;
ALTER TABLE establishments ADD COLUMN bank_account_number TEXT;
ALTER TABLE establishments ADD COLUMN bank_name TEXT;
ALTER TABLE establishments ADD COLUMN bank_account_type TEXT;

-- Create conversion requests table
CREATE TABLE conversion_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  establishment_id INTEGER NOT NULL,
  crypto_symbol TEXT NOT NULL,
  amount_crypto TEXT NOT NULL,
  amount_usd TEXT NOT NULL,
  amount_fiat TEXT NOT NULL,
  fiat_currency TEXT DEFAULT 'BRL',
  exchange_rate REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversion_requests_establishment ON conversion_requests(establishment_id);
CREATE INDEX idx_conversion_requests_status ON conversion_requests(status);

-- Create crypto balances table to track accumulated crypto
CREATE TABLE crypto_balances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  establishment_id INTEGER NOT NULL,
  crypto_symbol TEXT NOT NULL,
  available_balance TEXT DEFAULT '0',
  pending_conversion TEXT DEFAULT '0',
  total_received TEXT DEFAULT '0',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(establishment_id, crypto_symbol)
);

CREATE INDEX idx_crypto_balances_establishment ON crypto_balances(establishment_id);


CREATE TABLE pix_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  establishment_id INTEGER NOT NULL,
  key_type TEXT NOT NULL,
  key_value TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pix_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  establishment_id INTEGER NOT NULL,
  pix_key_id INTEGER NOT NULL,
  amount_brl TEXT NOT NULL,
  payer_name TEXT,
  payer_document TEXT,
  end_to_end_id TEXT UNIQUE,
  tx_id TEXT,
  qr_code_data TEXT,
  status TEXT DEFAULT 'pending',
  crypto_symbol TEXT,
  crypto_amount TEXT,
  conversion_rate REAL,
  converted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pix_keys_establishment ON pix_keys(establishment_id);
CREATE INDEX idx_pix_transactions_establishment ON pix_transactions(establishment_id);
CREATE INDEX idx_pix_transactions_end_to_end_id ON pix_transactions(end_to_end_id);

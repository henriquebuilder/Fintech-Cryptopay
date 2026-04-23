
CREATE TABLE establishments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  owner_email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_establishments_is_active ON establishments(is_active);
CREATE INDEX idx_establishments_owner_email ON establishments(owner_email);

CREATE TABLE wallets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  establishment_id INTEGER NOT NULL,
  crypto_symbol TEXT NOT NULL,
  address TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallets_establishment_id ON wallets(establishment_id);
CREATE INDEX idx_wallets_crypto_symbol ON wallets(crypto_symbol);
CREATE INDEX idx_wallets_address ON wallets(address);

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  establishment_id INTEGER NOT NULL,
  crypto_symbol TEXT NOT NULL,
  amount_crypto TEXT NOT NULL,
  amount_usd TEXT NOT NULL,
  wallet_address_from TEXT,
  wallet_address_to TEXT NOT NULL,
  tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_establishment_id ON transactions(establishment_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

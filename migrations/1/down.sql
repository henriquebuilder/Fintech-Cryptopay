
DROP INDEX idx_transactions_created_at;
DROP INDEX idx_transactions_tx_hash;
DROP INDEX idx_transactions_status;
DROP INDEX idx_transactions_establishment_id;
DROP TABLE transactions;

DROP INDEX idx_wallets_address;
DROP INDEX idx_wallets_crypto_symbol;
DROP INDEX idx_wallets_establishment_id;
DROP TABLE wallets;

DROP INDEX idx_establishments_owner_email;
DROP INDEX idx_establishments_is_active;
DROP TABLE establishments;

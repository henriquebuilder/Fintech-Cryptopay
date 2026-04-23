
DROP INDEX idx_crypto_balances_establishment;
DROP TABLE crypto_balances;
DROP INDEX idx_conversion_requests_status;
DROP INDEX idx_conversion_requests_establishment;
DROP TABLE conversion_requests;
ALTER TABLE establishments DROP COLUMN bank_account_type;
ALTER TABLE establishments DROP COLUMN bank_name;
ALTER TABLE establishments DROP COLUMN bank_account_number;
ALTER TABLE establishments DROP COLUMN bank_account_holder;
ALTER TABLE establishments DROP COLUMN auto_convert_percent;
ALTER TABLE establishments DROP COLUMN auto_convert_enabled;

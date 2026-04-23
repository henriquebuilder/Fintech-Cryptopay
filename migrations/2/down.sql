
DROP TABLE subscription_plans;

ALTER TABLE transactions DROP COLUMN merchant_net_usd;
ALTER TABLE transactions DROP COLUMN merchant_net_crypto;
ALTER TABLE transactions DROP COLUMN platform_fee_usd;
ALTER TABLE transactions DROP COLUMN platform_fee_crypto;

ALTER TABLE establishments DROP COLUMN total_transactions;
ALTER TABLE establishments DROP COLUMN total_revenue_usd;
ALTER TABLE establishments DROP COLUMN transaction_fee_percent;
ALTER TABLE establishments DROP COLUMN subscription_plan;

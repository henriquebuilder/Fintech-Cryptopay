
ALTER TABLE establishments ADD COLUMN subscription_plan TEXT DEFAULT 'free';
ALTER TABLE establishments ADD COLUMN transaction_fee_percent REAL DEFAULT 0.8;
ALTER TABLE establishments ADD COLUMN total_revenue_usd REAL DEFAULT 0;
ALTER TABLE establishments ADD COLUMN total_transactions INTEGER DEFAULT 0;

ALTER TABLE transactions ADD COLUMN platform_fee_crypto TEXT;
ALTER TABLE transactions ADD COLUMN platform_fee_usd TEXT;
ALTER TABLE transactions ADD COLUMN merchant_net_crypto TEXT;
ALTER TABLE transactions ADD COLUMN merchant_net_usd TEXT;

CREATE TABLE subscription_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  fee_percent REAL NOT NULL,
  max_monthly_transactions INTEGER,
  has_analytics BOOLEAN DEFAULT 0,
  has_priority_support BOOLEAN DEFAULT 0,
  monthly_price_usd REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO subscription_plans (name, display_name, fee_percent, max_monthly_transactions, has_analytics, has_priority_support, monthly_price_usd) VALUES
('free', 'Plano Gratuito', 1.0, 100, 0, 0, 0),
('premium', 'Plano Premium', 0.5, NULL, 1, 1, 29.99);

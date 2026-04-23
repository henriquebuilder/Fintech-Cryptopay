
CREATE TABLE service_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  icon_name TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  provider_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  min_amount_brl TEXT,
  max_amount_brl TEXT,
  fixed_amounts TEXT,
  processing_fee_percent REAL DEFAULT 2.0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  service_id INTEGER NOT NULL,
  amount_brl TEXT NOT NULL,
  amount_crypto TEXT NOT NULL,
  crypto_symbol TEXT NOT NULL,
  exchange_rate REAL NOT NULL,
  processing_fee_brl TEXT,
  total_paid_crypto TEXT,
  tx_hash TEXT,
  voucher_code TEXT,
  voucher_pin TEXT,
  status TEXT DEFAULT 'pending',
  phone_number TEXT,
  document_number TEXT,
  additional_data TEXT,
  error_message TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO service_categories (name, display_name, icon_name, description, sort_order) VALUES
  ('mobile_recharge', 'Recarga de Celular', 'Smartphone', 'Recargas para todas as operadoras', 1),
  ('gift_cards', 'Gift Cards', 'Gift', 'Cartões presente digitais', 2),
  ('transport', 'Transporte', 'Car', 'Uber, 99, pedágios e mais', 3),
  ('entertainment', 'Entretenimento', 'Tv', 'Streaming e jogos', 4),
  ('bills', 'Contas', 'Receipt', 'Boletos e pagamentos', 5);

INSERT INTO services (category_id, provider_name, service_name, description, min_amount_brl, max_amount_brl, fixed_amounts) VALUES
  (1, 'Vivo', 'Recarga Vivo', 'Recarga para Vivo Pré-Pago', '10', '100', '["10", "15", "20", "30", "50", "100"]'),
  (1, 'Tim', 'Recarga Tim', 'Recarga para Tim Pré-Pago', '10', '100', '["10", "15", "20", "30", "50", "100"]'),
  (1, 'Claro', 'Recarga Claro', 'Recarga para Claro Pré-Pago', '10', '100', '["10", "15", "20", "30", "50", "100"]'),
  (1, 'Oi', 'Recarga Oi', 'Recarga para Oi Pré-Pago', '10', '100', '["10", "15", "20", "30", "50", "100"]'),
  (2, 'Google', 'Google Play', 'Créditos para Google Play Store', '15', '500', '["15", "30", "50", "100", "200", "500"]'),
  (2, 'Apple', 'App Store', 'Créditos para App Store', '15', '500', '["15", "30", "50", "100", "200", "500"]'),
  (2, 'Amazon', 'Amazon Brasil', 'Vale-compras Amazon', '25', '500', '["25", "50", "100", "200", "500"]'),
  (3, 'Uber', 'Uber Gift Card', 'Créditos para Uber', '20', '200', '["20", "30", "50", "100", "200"]'),
  (3, '99', '99 Gift Card', 'Créditos para 99', '20', '200', '["20", "30", "50", "100", "200"]'),
  (3, 'Sem Parar', 'Recarga Sem Parar', 'Recarga para pedágios', '50', '500', '["50", "100", "150", "200", "300", "500"]'),
  (4, 'Netflix', 'Netflix Gift Card', 'Assinatura Netflix', '40', '200', '["40", "80", "120", "200"]'),
  (4, 'Spotify', 'Spotify Premium', 'Assinatura Spotify', '17', '100', '["17", "34", "51", "100"]');

CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_service_purchases_user ON service_purchases(user_id);
CREATE INDEX idx_service_purchases_status ON service_purchases(status);

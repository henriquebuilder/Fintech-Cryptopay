
-- Add Gaming category
INSERT INTO service_categories (name, display_name, description, icon_name, sort_order, is_active)
VALUES ('gaming', 'Gaming', 'Créditos para jogos', 'Gamepad2', 6, 1);

-- Add Delivery category
INSERT INTO service_categories (name, display_name, description, icon_name, sort_order, is_active)
VALUES ('delivery', 'Delivery', 'Apps de comida e entrega', 'UtensilsCrossed', 7, 1);

-- Add Gaming services
INSERT INTO services (category_id, service_name, provider_name, description, min_amount_brl, max_amount_brl, fixed_amounts, processing_fee_percent, is_active)
VALUES 
  (6, 'Steam Wallet', 'Steam', 'Créditos para jogos no Steam', '10', '500', '["20", "50", "100", "200", "500"]', 2.0, 1),
  (6, 'PlayStation Store', 'Sony', 'Créditos para PS Store', '25', '500', '["25", "50", "100", "150", "200", "500"]', 2.0, 1),
  (6, 'Xbox Gift Card', 'Microsoft', 'Créditos para Xbox e Microsoft Store', '25', '500', '["25", "50", "100", "200", "500"]', 2.0, 1),
  (6, 'Free Fire Diamantes', 'Garena', 'Diamantes para Free Fire', '10', '500', '["10", "20", "50", "100", "200", "500"]', 2.0, 1),
  (6, 'Fortnite V-Bucks', 'Epic Games', 'V-Bucks para Fortnite', '20', '500', '["20", "50", "100", "200", "500"]', 2.0, 1),
  (6, 'Roblox', 'Roblox', 'Robux para Roblox', '15', '500', '["15", "30", "50", "100", "200", "500"]', 2.0, 1),
  (6, 'Mobile Legends Diamantes', 'Moonton', 'Diamantes para Mobile Legends', '10', '300', '["10", "20", "50", "100", "200", "300"]', 2.0, 1),
  (6, 'League of Legends RP', 'Riot Games', 'RP para League of Legends', '15', '500', '["15", "30", "50", "100", "200", "500"]', 2.0, 1);

-- Add Delivery services
INSERT INTO services (category_id, service_name, provider_name, description, min_amount_brl, max_amount_brl, fixed_amounts, processing_fee_percent, is_active)
VALUES 
  (7, 'iFood Gift Card', 'iFood', 'Vale-presente iFood', '20', '500', '["20", "50", "100", "200", "500"]', 2.0, 1),
  (7, 'Rappi Créditos', 'Rappi', 'Créditos para Rappi', '20', '500', '["20", "50", "100", "200", "500"]', 2.0, 1),
  (7, 'Uber Eats', 'Uber', 'Vale-presente Uber Eats', '20', '300', '["20", "50", "100", "150", "200", "300"]', 2.0, 1);

-- Add more Streaming services
INSERT INTO services (category_id, service_name, provider_name, description, min_amount_brl, max_amount_brl, fixed_amounts, processing_fee_percent, is_active)
VALUES 
  (4, 'Disney+', 'Disney', 'Assinatura Disney+', '28', '280', '["28", "56", "84", "140", "280"]', 2.0, 1),
  (4, 'HBO Max', 'Warner Bros', 'Assinatura HBO Max', '30', '300', '["30", "60", "90", "180", "300"]', 2.0, 1),
  (4, 'Amazon Prime Video', 'Amazon', 'Assinatura Prime Video', '10', '200', '["10", "30", "60", "120", "200"]', 2.0, 1),
  (4, 'Paramount+', 'Paramount', 'Assinatura Paramount+', '20', '200', '["20", "40", "80", "160", "200"]', 2.0, 1),
  (4, 'YouTube Premium', 'Google', 'Assinatura YouTube Premium', '25', '250', '["25", "50", "75", "150", "250"]', 2.0, 1);

-- Add Boleto payment service
INSERT INTO services (category_id, service_name, provider_name, description, min_amount_brl, max_amount_brl, fixed_amounts, processing_fee_percent, is_active)
VALUES 
  (5, 'Pagamento de Boleto', 'Sistema', 'Pague qualquer boleto com cripto', '10', '5000', '[]', 2.0, 1);

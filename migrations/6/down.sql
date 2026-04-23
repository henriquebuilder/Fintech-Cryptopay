
-- Remove services added
DELETE FROM services WHERE category_id IN (6, 7);
DELETE FROM services WHERE service_name IN ('Disney+', 'HBO Max', 'Amazon Prime Video', 'Paramount+', 'YouTube Premium', 'Pagamento de Boleto');

-- Remove categories added
DELETE FROM service_categories WHERE name IN ('gaming', 'delivery');

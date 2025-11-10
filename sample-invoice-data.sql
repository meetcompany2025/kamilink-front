-- Insert sample freight request for demonstration
INSERT INTO freight_requests (
  id,
  client_id,
  origin_address,
  origin_city,
  origin_state,
  destination_address,
  destination_city,
  destination_state,
  cargo_type,
  weight,
  dimensions,
  quantity,
  description,
  pickup_date,
  delivery_date,
  requires_loading_help,
  requires_unloading_help,
  has_insurance,
  status,
  tracking_number
) VALUES (
  'sample-freight-001',
  (SELECT id FROM users WHERE email = 'client@example.com' LIMIT 1),
  'Rua da Missão, 123',
  'Luanda',
  'Luanda',
  'Avenida 4 de Fevereiro, 456',
  'Benguela',
  'Benguela',
  'Equipamentos Industriais',
  '2500',
  '2.5m x 1.8m x 1.2m',
  '3',
  'Máquinas industriais para fábrica de processamento',
  '2024-01-15',
  '2024-01-18',
  true,
  true,
  true,
  'delivered',
  'KL2024001'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample freight offer
INSERT INTO freight_offers (
  id,
  freight_request_id,
  transporter_id,
  vehicle_id,
  price,
  estimated_delivery_date,
  notes,
  status
) VALUES (
  'sample-offer-001',
  'sample-freight-001',
  (SELECT id FROM users WHERE user_type = 'transporter' LIMIT 1),
  (SELECT id FROM vehicles LIMIT 1),
  125000.00,
  '2024-01-18',
  'Transporte especializado com equipamento de elevação',
  'accepted'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample client invoice
INSERT INTO invoices (
  id,
  invoice_number,
  invoice_type,
  freight_request_id,
  freight_offer_id,
  client_id,
  transporter_id,
  issue_date,
  due_date,
  subtotal,
  tax_rate,
  tax_amount,
  total_amount,
  status,
  notes,
  payment_terms,
  company_name,
  company_address,
  company_tax_id
) VALUES (
  'sample-invoice-client-001',
  'KL-INV-2024-001',
  'client_invoice',
  'sample-freight-001',
  'sample-offer-001',
  (SELECT id FROM users WHERE email = 'client@example.com' LIMIT 1),
  (SELECT id FROM users WHERE user_type = 'transporter' LIMIT 1),
  '2024-01-18',
  '2024-02-17',
  125000.00,
  0.14,
  17500.00,
  142500.00,
  'paid',
  'Fatura referente ao transporte de equipamentos industriais',
  'Pagamento em 30 dias',
  'KamiLink Transportes',
  'Rua Principal, 789, Luanda, Angola',
  '5417189658'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample transporter receipt
INSERT INTO invoices (
  id,
  invoice_number,
  invoice_type,
  freight_request_id,
  freight_offer_id,
  client_id,
  transporter_id,
  issue_date,
  subtotal,
  tax_rate,
  tax_amount,
  total_amount,
  status,
  notes,
  company_name,
  company_address,
  company_tax_id
) VALUES (
  'sample-receipt-trans-001',
  'KL-REC-2024-001',
  'transporter_receipt',
  'sample-freight-001',
  'sample-offer-001',
  (SELECT id FROM users WHERE email = 'client@example.com' LIMIT 1),
  (SELECT id FROM users WHERE user_type = 'transporter' LIMIT 1),
  '2024-01-18',
  125000.00,
  0.14,
  17500.00,
  142500.00,
  'paid',
  'Recibo referente ao serviço de transporte prestado',
  'KamiLink Transportes',
  'Rua Principal, 789, Luanda, Angola',
  '5417189658'
) ON CONFLICT (id) DO NOTHING;

-- Insert invoice items for client invoice
INSERT INTO invoice_items (
  invoice_id,
  description,
  quantity,
  unit_price,
  total_price,
  item_type,
  sort_order
) VALUES 
(
  'sample-invoice-client-001',
  'Transporte de carga: Luanda → Benguela',
  1,
  95000.00,
  95000.00,
  'freight',
  1
),
(
  'sample-invoice-client-001',
  'Serviço de carregamento especializado',
  1,
  15000.00,
  15000.00,
  'loading_help',
  2
),
(
  'sample-invoice-client-001',
  'Serviço de descarregamento',
  1,
  10000.00,
  10000.00,
  'unloading_help',
  3
),
(
  'sample-invoice-client-001',
  'Seguro de carga (2% do valor)',
  1,
  5000.00,
  5000.00,
  'insurance',
  4
) ON CONFLICT DO NOTHING;

-- Insert invoice items for transporter receipt
INSERT INTO invoice_items (
  invoice_id,
  description,
  quantity,
  unit_price,
  total_price,
  item_type,
  sort_order
) VALUES 
(
  'sample-receipt-trans-001',
  'Receita por transporte de carga',
  1,
  95000.00,
  95000.00,
  'freight',
  1
),
(
  'sample-receipt-trans-001',
  'Receita por carregamento especializado',
  1,
  15000.00,
  15000.00,
  'loading_help',
  2
),
(
  'sample-receipt-trans-001',
  'Receita por descarregamento',
  1,
  10000.00,
  10000.00,
  'unloading_help',
  3
),
(
  'sample-receipt-trans-001',
  'Receita por seguro de carga',
  1,
  5000.00,
  5000.00,
  'insurance',
  4
) ON CONFLICT DO NOTHING;

-- Insert payment record
INSERT INTO invoice_payments (
  invoice_id,
  payment_date,
  amount,
  payment_method,
  reference_number,
  status,
  notes
) VALUES 
(
  'sample-invoice-client-001',
  '2024-01-20',
  142500.00,
  'Transferência Bancária',
  'TRF-2024-001-KL',
  'completed',
  'Pagamento efetuado via transferência bancária'
) ON CONFLICT DO NOTHING;

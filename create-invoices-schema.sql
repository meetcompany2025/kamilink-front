-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Invoice identification
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_type VARCHAR(20) NOT NULL CHECK (invoice_type IN ('client_invoice', 'transporter_receipt')),
  
  -- Related freight request
  freight_request_id UUID REFERENCES freight_requests(id) ON DELETE CASCADE,
  freight_offer_id UUID REFERENCES freight_offers(id) ON DELETE CASCADE,
  
  -- Parties involved
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Invoice details
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  payment_date DATE,
  
  -- Financial information
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,4) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  
  -- Additional information
  notes TEXT,
  payment_terms TEXT,
  payment_method VARCHAR(50),
  
  -- Document metadata
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP WITH TIME ZONE,
  
  -- Branding
  company_logo_url TEXT,
  company_name VARCHAR(255),
  company_address TEXT,
  company_tax_id VARCHAR(50)
);

-- Create invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  
  -- Item details
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  
  -- Item type (freight, insurance, loading_help, etc.)
  item_type VARCHAR(50) NOT NULL,
  
  -- Order for display
  sort_order INTEGER DEFAULT 0
);

-- Create invoice payments table
CREATE TABLE IF NOT EXISTS invoice_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  
  -- Payment details
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  reference_number VARCHAR(100),
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_freight_request ON invoices(freight_request_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_transporter ON invoices(transporter_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_type ON invoices(invoice_type);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice ON invoice_payments(invoice_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_payments ENABLE ROW LEVEL SECURITY;

-- Policies for invoices
CREATE POLICY "Users can view their own invoices" ON invoices
    FOR SELECT USING (
        auth.uid() = client_id OR 
        auth.uid() = transporter_id OR
        auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
    );

CREATE POLICY "System can insert invoices" ON invoices
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own invoices" ON invoices
    FOR UPDATE USING (
        auth.uid() = client_id OR 
        auth.uid() = transporter_id OR
        auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
    );

-- Policies for invoice items
CREATE POLICY "Users can view invoice items for their invoices" ON invoice_items
    FOR SELECT USING (
        invoice_id IN (
            SELECT id FROM invoices WHERE 
            auth.uid() = client_id OR 
            auth.uid() = transporter_id OR
            auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
        )
    );

CREATE POLICY "System can insert invoice items" ON invoice_items
    FOR INSERT WITH CHECK (true);

-- Policies for invoice payments
CREATE POLICY "Users can view payments for their invoices" ON invoice_payments
    FOR SELECT USING (
        invoice_id IN (
            SELECT id FROM invoices WHERE 
            auth.uid() = client_id OR 
            auth.uid() = transporter_id OR
            auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
        )
    );

CREATE POLICY "System can insert invoice payments" ON invoice_payments
    FOR INSERT WITH CHECK (true);

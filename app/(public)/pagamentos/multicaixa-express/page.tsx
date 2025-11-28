// app/payments/multicaixa/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Shield, Clock, SmartphoneCharging } from 'lucide-react';
import { PaymentConfirmation } from '@/components/PaymentConfirmation';
import { PaymentSuccess } from '@/components/PaymentSuccess';
import { useSearchParams } from 'next/navigation';

export default function MulticaixaPage() {
  const [step, setStep] = useState<'details' | 'confirmation' | 'success'>('details');
    const searchParams = useSearchParams();
  const [initialData, setInitialData] = useState({
    amount: '',
    phone: '',
    description: ''
  });
  const [formData, setFormData] = useState({
    phone: '',
    amount: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmation');
  };

  const handlePayment = () => {
    // Simular processamento
    setTimeout(() => setStep('success'), 2000);
  };

    useEffect(() => {
    // Pega os dados da URL
    const amount = searchParams.get('amount') || '';
    const phone = searchParams.get('phone') || '';
    const description = searchParams.get('description') || '';
    
    setInitialData({ amount, phone, description });
  }, [searchParams]);

  if (step === 'confirmation') {
    return (
      <PaymentConfirmation
        method="Multicaixa Express"
        amount={formData.amount}
        phone={formData.phone}
        onConfirm={handlePayment}
        onBack={() => setStep('details')}
      />
    );
  }

  if (step === 'success') {
    return (
      <PaymentSuccess
        amount={formData.amount}
        method="Multicaixa Express"
        transactionId={`MCX-$+{Date.now()}`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SmartphoneCharging className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Multicaixa Express
          </h1>
          <p className="text-muted-foreground mt-2">
            Pagamento rápido e seguro via rede Multicaixa
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border shadow-lg p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Valor */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Valor do Pagamento (AKZ)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0,00"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-lg font-semibold"
                  required
                  min="100"
                />
                <span className="absolute right-4 top-3 text-muted-foreground font-medium">AKZ</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Valor mínimo: 100 AKZ
              </p>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Número de Telefone
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-muted-foreground">+244</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="9XX XXX XXX"
                  className="w-full px-16 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background"
                  required
                  pattern="9[0-9]{8}"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Deve começar com 9 e ter 9 dígitos
              </p>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Descrição do Pagamento (Opcional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Assinatura mensal, Serviço premium..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background"
                maxLength={50}
              />
            </div>

            {/* Informações do Serviço */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Pagamento 100% seguro pela rede Multicaixa</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Confirmação instantânea</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Smartphone className="h-4 w-4 text-blue-600" />
                <span>Receberá uma notificação no seu telefone</span>
              </div>
            </div>

            {/* Botão */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
              disabled={!formData.amount || !formData.phone}
            >
              Continuar para Confirmação
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
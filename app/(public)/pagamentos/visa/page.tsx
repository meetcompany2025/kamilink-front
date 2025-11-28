// app/payments/visa/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Lock, User } from 'lucide-react';

export default function VisaPage() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    amount: ''
  });

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Cartão Visa
          </h1>
          <p className="text-muted-foreground mt-2">
            Pagamento seguro com cartão de crédito/débito
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-2xl border shadow-lg p-6"
          >
            <form className="space-y-6">
              {/* Valor */}
              <div>
                <label className="block text-sm font-medium mb-2">Valor (AKZ)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background"
                  required
                />
              </div>

              {/* Número do Cartão */}
              <div>
                <label className="block text-sm font-medium mb-2">Número do Cartão</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background"
                    maxLength={19}
                    required
                  />
                </div>
              </div>

              {/* Nome no Cartão */}
              <div>
                <label className="block text-sm font-medium mb-2">Nome no Cartão</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
                    placeholder="SEU NOME AQUI"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background uppercase"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Data de Expiração */}
                <div>
                  <label className="block text-sm font-medium mb-2">Validade</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/AA"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background"
                      maxLength={5}
                      required
                    />
                  </div>
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                      placeholder="123"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
              >
                Pagar Agora
              </motion.button>
            </form>
          </motion.div>

          {/* Preview do Cartão */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-6 text-white h-fit"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">VISA</div>
                <div className="text-sm">DÉBITO/CRÉDITO</div>
              </div>

              <div className="bg-white/20 rounded-lg p-4 font-mono text-lg tracking-wider">
                {formData.cardNumber || '•••• •••• •••• ••••'}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm opacity-80">NOME DO TITULAR</div>
                  <div className="font-semibold">{formData.cardName || 'SEU NOME'}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">VALIDADE</div>
                  <div className="font-semibold">{formData.expiry || 'MM/AA'}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
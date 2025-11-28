// app/payments/unitel-money/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Smartphone, Zap, Shield } from 'lucide-react';

export default function UnitelMoneyPage() {
  const [formData, setFormData] = useState({
    phone: '',
    amount: '',
    pin: ''
  });
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Unitel Money
          </h1>
          <p className="text-muted-foreground mt-2">
            Pagamento rápido com a sua carteira Unitel Money
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
              {/* Telefone Unitel */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Número Unitel Money
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9XX XXX XXX"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background"
                    pattern="9[0-9]{8}"
                    required
                  />
                </div>
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-medium mb-2">Valor (AKZ)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background"
                  min="50"
                  required
                />
              </div>

              {/* PIN */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  PIN do Unitel Money
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPin ? "text" : "password"}
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                    placeholder="••••"
                    className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background"
                    maxLength={4}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPin ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  PIN de 4 dígitos da sua conta Unitel Money
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
              >
                Autorizar Pagamento
              </motion.button>
            </form>
          </motion.div>

          {/* QR Code e Informações */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* QR Code Placeholder */}
            <div className="bg-card rounded-2xl border shadow-lg p-6 text-center">
              <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Pagamento por QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Escaneie este código com a app Unitel Money para pagar rapidamente
              </p>
            </div>

            {/* Informações */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Como funciona:
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• Tenha saldo suficiente na sua conta Unitel Money</li>
                <li>• Confirme o pagamento na app móvel</li>
                <li>• Receba a confirmação instantaneamente</li>
                <li>• Guarde o comprovativo da transação</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
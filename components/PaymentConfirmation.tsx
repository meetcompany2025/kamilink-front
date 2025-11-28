// components/payment-confirmation.tsx
'use client';

import { motion } from 'framer-motion';
import { Shield, Clock, Smartphone } from 'lucide-react';

interface PaymentConfirmationProps {
  method: string;
  amount: string;
  phone: string;
  onConfirm: () => void;
  onBack: () => void;
}

export function PaymentConfirmation({ 
  method, 
  amount, 
  phone, 
  onConfirm, 
  onBack 
}: PaymentConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 py-8 flex items-center justify-center"
    >
      <div className="bg-card rounded-2xl border shadow-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">Confirmar Pagamento</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Método:</span>
            <span className="font-semibold">{method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor:</span>
            <span className="font-semibold">{Number(amount).toLocaleString('pt-AO')} AKZ</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Telefone:</span>
            <span className="font-semibold">+244 {phone}</span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <Shield className="h-4 w-4 text-blue-600" />
            <span>Transação segura e criptografada</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>Processamento rápido</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Smartphone className="h-4 w-4 text-blue-600" />
            <span>Receberá uma confirmação por SMS</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Confirmar Pagamento
          </button>
        </div>
      </div>
    </motion.div>
  );
}
// components/payment-success.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Download, Share2, Home, Mail } from 'lucide-react';
import Link from 'next/link';

interface PaymentSuccessProps {
  amount: string;
  method: string;
  transactionId: string;
}

export function PaymentSuccess({ amount, method, transactionId }: PaymentSuccessProps) {
  const handleDownloadReceipt = () => {
    // Simular download do recibo
    console.log('Downloading receipt...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Comprovante de Pagamento',
        text: `Pagamento de ${amount} AKZ realizado com sucesso via ${method}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 py-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl border shadow-lg p-8 max-w-md w-full mx-4"
      >
        {/* Ícone de Sucesso */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </motion.div>
        
        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-4">Pagamento Confirmado!</h2>
        
        {/* Mensagem */}
        <p className="text-lg text-center text-muted-foreground mb-2">
          O seu pagamento de <strong>{Number(amount).toLocaleString('pt-AO')} AKZ</strong> foi processado com sucesso via {method}.
        </p>
        
        {/* Detalhes da Transação */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID da Transação:</span>
              <span className="font-mono font-semibold">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data:</span>
              <span>{new Date().toLocaleString('pt-AO')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Método:</span>
              <span className="font-semibold">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">Concluído</span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadReceipt}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Baixar Comprovante
          </motion.button>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              className="flex items-center justify-center gap-2 border border-border py-3 px-4 rounded-lg hover:bg-accent transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Partilhar
            </motion.button>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 border border-border py-3 px-4 rounded-lg hover:bg-accent transition-colors"
              >
                <Home className="h-4 w-4" />
                Início
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Mensagem Final */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          O comprovante foi enviado para o seu email. Obrigado pela sua confiança!
        </motion.p>
      </motion.div>
    </div>
  );
}
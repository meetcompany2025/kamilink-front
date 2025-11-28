// app/payments/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Smartphone, 
  QrCode, 
  Shield, 
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function PaymentsPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'multicaixa-express' | 'visa' | 'unitel-money'>('multicaixa-express');

  const paymentMethods = [
    {
      id: 'multicaixa-express',
      name: 'Multicaixa Express',
      icon: Smartphone,
      description: 'Pagamento rápido via Multicaixa',
      color: 'from-blue-500 to-purple-600',
      active: true,
      route: '/pagamentos/multicaixa-express'
    },
    {
      id: 'visa',
      name: 'Cartão Visa',
      icon: CreditCard,
      description: 'Cartão de crédito/débito',
      color: 'from-green-500 to-blue-600',
      active: true,
      route: '/pagamentos/visa'
    },
    {
      id: 'unitel-money',
      name: 'Unitel Money',
      icon: QrCode,
      description: 'Pagamento com Unitel Money',
      color: 'from-orange-500 to-red-500',
      active: true,
      route: '/pagamentos/unitel-money'
    }
  ];

  const handleContinue = () => {
    // Encontra a rota do método selecionado
    const selectedMethodData = paymentMethods.find(method => method.id === selectedMethod);
    
    if (selectedMethodData) {
      // Redireciona diretamente para a página específica do método
      router.push(selectedMethodData.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Finalizar Pagamento
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha a forma de pagamento mais conveniente para você
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Métodos de Pagamento */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl border shadow-sm p-6"
            >
              <h2 className="text-2xl font-semibold mb-6">Método de Pagamento</h2>
              
              {/* Cards de Métodos */}
              <div className="space-y-4 mb-8">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedMethod(method.id as any)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${method.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{method.name}</h3>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Botão de Continuar */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Lock className="h-5 w-5" />
                Continuar para Pagamento
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl border shadow-sm p-6 sticky top-8"
            >
              <h3 className="text-xl font-semibold mb-6">Resumo do Pedido</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produto/Serviço</span>
                  <span>Assinatura Premium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor</span>
                  <span className="font-semibold">5.000 AKZ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa</span>
                  <span>Grátis</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">5.000 AKZ</span>
                </div>
              </div>

              {/* Método Selecionado */}
              <div className="mb-6 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Método selecionado:</p>
                <p className="font-semibold">
                  {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </p>
              </div>

              {/* Benefícios */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Confirmado instantaneamente</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Dados criptografados</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Informações de Segurança */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            Seus dados estão protegidos com criptografia de última geração
          </p>
        </motion.div>
      </div>
    </div>
  );
}
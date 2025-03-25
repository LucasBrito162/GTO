import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Brain, Clock, CheckCircle } from 'lucide-react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

initMercadoPago('APP_USR-ec0b99b7-24ca-4d44-a2bf-fe2db4ca45d4');

type PlanDuration = 1 | 6 | 12;

const PLAN_PRICES: Record<PlanDuration, number> = {
  1: 29.90,
  6: 149.90,
  12: 269.90
};

function PaymentPage() {
  const [selectedDuration, setSelectedDuration] = useState<PlanDuration>(1);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Trophy className="w-12 h-12 text-yellow-400" />,
      title: "Estratégia GTO Avançada",
      description: "Acesso a recomendações baseadas em teoria do jogo otimizada"
    },
    {
      icon: <Target className="w-12 h-12 text-blue-400" />,
      title: "Decisões Precisas",
      description: "Tome decisões matemáticamente corretas em cada posição"
    },
    {
      icon: <Brain className="w-12 h-12 text-purple-400" />,
      title: "Melhore seu Jogo",
      description: "Aprenda e internalize conceitos avançados de poker"
    },
    {
      icon: <Clock className="w-12 h-12 text-green-400" />,
      title: "Acesso 24/7",
      description: "Estude e pratique quando e onde quiser"
    }
  ];

  const handlePayment = () => {
    // Note: In a production environment, this should be handled by a backend
    // to create the preference securely
    navigate('/app'); // Temporary direct navigation for demo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">GTO Poker Study Tool</h1>
          <p className="text-xl text-gray-300">Eleve seu jogo ao próximo nível com análises GTO precisas</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-8">Por que escolher nossa ferramenta?</h2>
            <div className="grid gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Escolha seu plano</h2>
            
            <div className="space-y-4 mb-8">
              {[1, 6, 12].map((months) => (
                <button
                  key={months}
                  onClick={() => setSelectedDuration(months as PlanDuration)}
                  className={`w-full p-4 rounded-lg flex items-center justify-between ${
                    selectedDuration === months
                      ? 'bg-blue-600 border-2 border-blue-400'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <CheckCircle className={`w-6 h-6 ${
                      selectedDuration === months ? 'text-blue-200' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <div className="font-semibold">{months} {months === 1 ? 'Mês' : 'Meses'}</div>
                      <div className="text-sm text-gray-300">
                        {months === 12 ? 'Melhor valor!' : months === 6 ? 'Mais popular' : 'Experimente!'}
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    R$ {PLAN_PRICES[months as PlanDuration].toFixed(2)}
                  </div>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <div className="text-center text-gray-300 mb-4">
                Pagamento seguro via Mercado Pago
              </div>
              <button
                onClick={handlePayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200"
              >
                Começar Agora
              </button>
            </div>

            <div className="text-sm text-gray-400 text-center">
              7 dias de garantia de reembolso
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400">
          <p>© 2024 GTO Poker Study Tool. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
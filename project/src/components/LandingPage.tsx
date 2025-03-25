import React, { useState } from 'react';
import { Brain, Target, BarChart as ChartBar, Zap, Cpu, Lightbulb, Users, TrendingUp, Check } from 'lucide-react';

const gtoFeatures = [
  {
    icon: <Brain className="w-12 h-12 text-purple-400" />,
    title: "Decisões Matemáticamente Perfeitas",
    description: "GTO representa a estratégia matematicamente perfeita que não pode ser explorada, mesmo pelo adversário mais forte."
  },
  {
    icon: <Target className="w-12 h-12 text-blue-400" />,
    title: "Equilíbrio Nash",
    description: "Baseado no conceito de Equilíbrio de Nash, o GTO encontra o ponto ótimo onde nenhum jogador pode melhorar unilateralmente sua estratégia."
  },
  {
    icon: <ChartBar className="w-12 h-12 text-green-400" />,
    title: "Análise de Ranges",
    description: "Trabalhe com ranges completos em vez de mãos individuais, permitindo decisões mais robustas e equilibradas."
  },
  {
    icon: <Zap className="w-12 h-12 text-yellow-400" />,
    title: "Exploração Mínima",
    description: "Minimize suas próprias vulnerabilidades enquanto mantém a capacidade de explorar os erros dos oponentes."
  }
];

const benefits = [
  {
    icon: <Cpu className="w-8 h-8 text-blue-500" />,
    title: "Estratégia Avançada",
    description: "Aprenda a jogar de forma inexploitável e matematicamente correta"
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    title: "Compreensão Profunda",
    description: "Entenda os fundamentos teóricos por trás de cada decisão"
  },
  {
    icon: <Users className="w-8 h-8 text-purple-500" />,
    title: "Adaptabilidade",
    description: "Ajuste sua estratégia com base no perfil dos adversários"
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-green-500" />,
    title: "Resultados Consistentes",
    description: "Alcance resultados mais estáveis e previsíveis a longo prazo"
  }
];

const accessPlans = [
  {
    name: "Plano Básico",
    accesses: 30,
    price: "R$ 29,90",
    features: [
      "30 acessos à ferramenta GTO",
      "Análise de ranges completa",
      "Recomendações em tempo real",
      "Suporte via WhatsApp"
    ]
  },
  {
    name: "Plano Profissional",
    accesses: 45,
    price: "R$ 39,90",
    popular: true,
    features: [
      "45 acessos à ferramenta GTO",
      "Análise de ranges completa",
      "Recomendações em tempo real",
      "Suporte prioritário via WhatsApp",
      "20% de desconto por acesso"
    ]
  },
  {
    name: "Plano Elite",
    accesses: 60,
    price: "R$ 49,90",
    features: [
      "60 acessos à ferramenta GTO",
      "Análise de ranges completa",
      "Recomendações em tempo real",
      "Suporte VIP via WhatsApp",
      "30% de desconto por acesso"
    ]
  }
];

function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const handleWhatsAppClick = (planIndex?: number) => {
    const baseUrl = 'https://wa.me/5511940738778?text=';
    let message = '';

    if (planIndex !== undefined && planIndex >= 0 && planIndex < accessPlans.length) {
      const plan = accessPlans[planIndex];
      message = encodeURIComponent(
        `Olá! Gostaria de adquirir o ${plan.name} da ferramenta GTO Pré-Flop Poker por ${plan.price}, que inclui ${plan.accesses} acessos.`
      );
    } else {
      message = encodeURIComponent('Olá! Gostaria de saber mais sobre a ferramenta GTO Pré-Flop Poker.');
    }

    window.open(baseUrl + message, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Domine o Poker com<br />
              <span className="text-white">Estratégia GTO</span>{' '}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text animate-gradient">
                Pré-Flop
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Game Theory Optimal (GTO) é a abordagem matemáticamente perfeita para o poker, 
              permitindo que você tome decisões inexploráveis e maximize seus lucros a longo prazo.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => handleWhatsAppClick()}
                className="px-6 py-3 text-lg font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition duration-150 ease-in-out"
              >
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* O que é GTO Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">O que é GTO</span>{' '}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
                Pré-Flop
              </span>{' '}
              <span className="text-white">no Poker?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              GTO (Game Theory Optimal) é uma abordagem matemática ao poker que busca 
              criar uma estratégia perfeitamente equilibrada e inexploitável. É o padrão-ouro 
              para jogadores que buscam excelência e consistência.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {gtoFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Benefícios do Estudo GTO</span>{' '}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
                Pré-Flop
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ao dominar os conceitos GTO, você desenvolverá uma compreensão profunda 
              do poker que o diferenciará da maioria dos jogadores.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6">
                <div className="mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2 text-center">{benefit.title}</h3>
                <p className="text-gray-400 text-center">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Escolha seu Plano
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Invista no seu desenvolvimento como jogador com nossos planos de acesso à ferramenta GTO
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {accessPlans.map((plan, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedPlan(index)}
                className={`relative bg-gray-800 rounded-2xl p-8 border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  selectedPlan === index 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-105' 
                    : plan.popular 
                      ? 'border-blue-500/50'
                      : 'border-gray-700 hover:border-blue-500/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                  </div>
                  <p className="text-gray-400 mt-2">{plan.accesses} acessos</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhatsAppClick(index);
                  }}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition duration-150 ease-in-out ${
                    selectedPlan === index || plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  Contratar Agora
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-white">Pronto para elevar seu jogo no</span>{' '}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
                Pré-Flop
              </span>
              <span className="text-white">?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Comece agora a sua jornada rumo ao domínio do poker GTO Pré-Flop
            </p>
            <button
              onClick={() => handleWhatsAppClick()}
              className="px-6 py-3 text-lg font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition duration-150 ease-in-out"
            >
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
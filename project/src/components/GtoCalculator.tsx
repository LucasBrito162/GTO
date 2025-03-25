import React, { useState } from 'react';
import { ChevronDown, Cpu, Zap, Target } from 'lucide-react';

type Position = 'BTN' | 'SB' | 'BB' | 'UTG' | 'MP' | 'CO';
type Card = {
  rank: string;
  suit: string;
};

type Action = 'FOLD' | 'RAISE' | 'CALL';

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['♠', '♥', '♦', '♣'];

function getHandStrength(hand: string): 'premium' | 'strong' | 'medium' | 'speculative' | 'weak' {
  const premiumHands = ['AA', 'KK', 'QQ', 'AKs', 'AKo'];
  const strongHands = ['JJ', 'TT', 'AQs', 'AQo', 'AJs', 'KQs'];
  const mediumHands = ['99', '88', '77', 'ATs', 'KJs', 'QJs', 'JTs'];
  const speculativeHands = ['66', '55', 'A9s', 'A8s', 'A7s', 'A5s', 'KTs', 'QTs'];

  if (premiumHands.includes(hand)) return 'premium';
  if (strongHands.includes(hand)) return 'strong';
  if (mediumHands.includes(hand)) return 'medium';
  if (speculativeHands.includes(hand)) return 'speculative';
  return 'weak';
}

function getRecommendedAction(handStrength: string): Action {
  switch (handStrength) {
    case 'premium':
    case 'strong':
      return 'RAISE';
    case 'medium':
    case 'speculative':
      return 'CALL';
    default:
      return 'FOLD';
  }
}

function getActionButtonColor(action: Action): string {
  switch (action) {
    case 'RAISE':
      return 'bg-yellow-600 hover:bg-yellow-700';
    case 'CALL':
      return 'bg-blue-600 hover:bg-blue-700';
    case 'FOLD':
      return 'bg-red-600 hover:bg-red-700';
    default:
      return 'bg-gray-600 hover:bg-gray-700';
  }
}

function getDetailedAdvice(position: Position, hand: string, handStrength: string): string {
  const positionStrength = {
    BTN: 'mais agressiva',
    CO: 'relativamente agressiva',
    MP: 'moderada',
    UTG: 'mais conservadora',
    SB: 'seletiva',
    BB: 'defensiva'
  };

  const baseAdvice = {
    premium: {
      raise: '3-bet para construir um pote grande',
      sizing: '3.5x-4x do big blind',
      strategy: 'Jogue agressivamente e busque construir o pote'
    },
    strong: {
      raise: 'Open raise para estabelecer dominância',
      sizing: '2.5x-3x do big blind',
      strategy: 'Jogue forte mas esteja preparado para enfrentar 3-bets'
    },
    medium: {
      raise: 'Open raise em posição tardia',
      sizing: '2.5x do big blind',
      strategy: 'Jogue de forma posicional e esteja disposto a desistir contra agressão'
    },
    speculative: {
      raise: 'Call em posição, fold sem posição',
      sizing: 'Apenas call aberturas padrão',
      strategy: 'Jogue fit-or-fold e busque ver flops baratos'
    },
    weak: {
      raise: 'Fold na maioria das situações',
      sizing: 'Evite investir fichas',
      strategy: 'Melhore sua seleção de mãos iniciais'
    }
  };

  const advice = baseAdvice[handStrength as keyof typeof baseAdvice];
  
  if (handStrength === 'premium') {
    return `Mão premium! ${advice.raise}. Faça uma abertura de ${advice.sizing}. ${advice.strategy}. Em posição ${position}, que é ${positionStrength[position]}, você pode ser ainda mais agressivo.`;
  }
  
  if (handStrength === 'strong') {
    return `Mão forte. ${advice.raise}. Recomendo abertura de ${advice.sizing}. ${advice.strategy}. Na posição ${position}, mantenha uma abordagem ${positionStrength[position]}.`;
  }
  
  if (handStrength === 'medium') {
    return `Mão média. ${advice.raise}. Considere uma abertura de ${advice.sizing}. ${advice.strategy}. Em ${position}, você deve ser ${positionStrength[position]}.`;
  }
  
  if (handStrength === 'speculative') {
    return `Mão especulativa. ${advice.raise}. ${advice.strategy}. Na posição ${position}, que requer uma abordagem ${positionStrength[position]}, seja cauteloso.`;
  }
  
  return `Mão fraca. ${advice.raise}. ${advice.strategy}. Em ${position}, mesmo com uma abordagem ${positionStrength[position]}, esta mão raramente será lucrativa.`;
}

function getHandNotation(card1: Card, card2: Card): string {
  const ranks = [card1.rank, card2.rank].sort((a, b) => 
    RANKS.indexOf(a) - RANKS.indexOf(b)
  );
  
  if (ranks[0] === ranks[1]) {
    return ranks[0] + ranks[1];
  }
  
  const suited = card1.suit === card2.suit ? 's' : 'o';
  return ranks[0] + ranks[1] + suited;
}

function GtoCalculator() {
  const [position, setPosition] = useState<Position>('BTN');
  const [card1, setCard1] = useState<Card>({ rank: 'A', suit: '♠' });
  const [card2, setCard2] = useState<Card>({ rank: 'K', suit: '♠' });
  const [showAdvice, setShowAdvice] = useState(false);

  const positions: Position[] = ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'];
  const positionDescriptions: Record<Position, string> = {
    'BTN': 'Botão',
    'SB': 'Small Blind',
    'BB': 'Big Blind',
    'UTG': 'Under the Gun',
    'MP': 'Posição Média',
    'CO': 'Cut-off'
  };

  const currentHand = getHandNotation(card1, card2);
  const handStrength = getHandStrength(currentHand);
  const recommendedAction = getRecommendedAction(handStrength);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Cpu className="w-8 h-8 text-blue-500" />
          <h1 className="text-4xl font-bold text-center">
            <span className="text-white">GTO</span>{' '}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
              Pré-Flop
            </span>{' '}
            <span className="text-white">Poker</span>
          </h1>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50">
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 text-gray-300">Posição na Mesa</label>
            <div className="relative">
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="w-full bg-gray-700/50 backdrop-blur-sm rounded-xl py-3 px-4 appearance-none cursor-pointer border border-gray-600/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                {positions.map((pos) => (
                  <option key={pos} value={pos}>{pos} - {positionDescriptions[pos]}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { label: 'Primeira Carta', card: card1, setCard: setCard1 },
              { label: 'Segunda Carta', card: card2, setCard: setCard2 }
            ].map((item, index) => (
              <div key={index}>
                <label className="block text-sm font-medium mb-2 text-gray-300">{item.label}</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={item.card.rank}
                    onChange={(e) => item.setCard({ ...item.card, rank: e.target.value })}
                    className="bg-gray-700/50 backdrop-blur-sm rounded-xl py-3 px-4 border border-gray-600/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  >
                    {RANKS.map((rank) => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                  <select
                    value={item.card.suit}
                    onChange={(e) => item.setCard({ ...item.card, suit: e.target.value })}
                    className="bg-gray-700/50 backdrop-blur-sm rounded-xl py-3 px-4 border border-gray-600/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  >
                    {SUITS.map((suit) => (
                      <option key={suit} value={suit}>{suit}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gray-700/30 backdrop-blur-md rounded-xl p-6 border border-gray-600/30">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-300">Sua Mão:</h3>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {currentHand}
                  </p>
                </div>
                
                <div className="mt-auto bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                  <p className="text-sm text-gray-400 italic">
                    Lembre-se de adaptar sua estratégia com base no perfil dos seus adversários. Jogadores mais passivos ou agressivos requerem ajustes específicos no seu jogo.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setShowAdvice(true)}
                className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md flex flex-col items-center justify-center gap-2 w-full"
              >
                <Target className="w-6 h-6" />
                <span>Obter Recomendação GTO</span>
              </button>

              <div className="bg-gray-700/30 backdrop-blur-md rounded-xl p-4 border border-gray-600/30">
                <button
                  className={`w-full py-4 rounded-lg font-bold text-xl flex items-center justify-center transform hover:scale-105 transition-all duration-200 ${getActionButtonColor(recommendedAction)}`}
                >
                  {recommendedAction}
                </button>
              </div>
            </div>
          </div>

          {showAdvice && (
            <div className="mt-6 animate-fadeIn">
              <div className="bg-gray-700/30 backdrop-blur-md rounded-xl border border-gray-600/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-xl font-semibold">Análise GTO Detalhada</h3>
                </div>
                <p className="text-lg leading-relaxed text-gray-200 mb-4">
                  {getDetailedAdvice(position, currentHand, handStrength)}
                </p>
                <div className="pt-4 border-t border-gray-600/30">
                  <p className="text-sm text-gray-400 italic">
                    Lembre-se: GTO é um guia estratégico, mas adapte seu jogo aos seus oponentes e às dinâmicas da mesa.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GtoCalculator;
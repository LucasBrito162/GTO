import React, { useState } from 'react';
import { ChevronDown, Cpu, Zap, Target, Users } from 'lucide-react';
import type { TableSize, Position6, Position9, Position, Card, Action } from '../types/poker';

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['♠', '♥', '♦', '♣'];

const POSITIONS_6: Position6[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const POSITIONS_9: Position9[] = ['UTG', 'UTG+1', 'UTG+2', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

// GTO ranges for different positions
const GTO_RANGES = {
  '6': {
    'UTG': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', 'AQs', 'AQo', 'AJs', 'KQs'],
      'playable': ['88', '77', 'ATs', 'KJs', 'QJs'],
      'action': 'RAISE',
      'sizing': '2.5x',
      'range': '~18%',
      'description': 'Range mais restrito, focando em mãos premium e fortes'
    },
    'HJ': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', 'AQs', 'AQo', 'AJs', 'KQs', 'KJs'],
      'playable': ['77', '66', 'ATs', 'KTs', 'QJs', 'JTs'],
      'action': 'RAISE',
      'sizing': '2.5x',
      'range': '~22%',
      'description': 'Pode incluir mais mãos conectoras e suited'
    },
    'CO': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', '77', 'AQs', 'AQo', 'AJs', 'KQs', 'KJs'],
      'playable': ['66', '55', 'ATs', 'KTs', 'QJs', 'JTs', '98s'],
      'action': 'RAISE',
      'sizing': '2.3x',
      'range': '~30%',
      'description': 'Posição tardia permite range mais amplo'
    },
    'BTN': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', '77', '66', 'AQs', 'AQo', 'AJs', 'KQs'],
      'playable': ['55', '44', '33', '22', 'ATs', 'KTs', 'QTs', 'JTs', '98s', '87s'],
      'action': 'RAISE',
      'sizing': '2.2x',
      'range': '~45%',
      'description': 'Posição mais lucrativa, range muito amplo'
    },
    'SB': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', 'AQs', 'AQo', 'AJs', 'KQs'],
      'playable': ['77', '66', 'ATs', 'KJs', 'QJs', 'JTs'],
      'action': 'RAISE',
      'sizing': '3x',
      'range': '~35%',
      'description': 'Range seletivo devido à posição pós-flop ruim'
    },
    'BB': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', '77', 'AQs', 'AQo', 'AJs', 'KQs'],
      'playable': ['66', '55', '44', '33', '22', 'ATs', 'KJs', 'QJs'],
      'action': 'CALL',
      'sizing': 'Call vs 2.5x',
      'range': '~50%',
      'description': 'Defesa contra aberturas, range depende do sizing'
    }
  },
  '9': {
    'UTG': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', 'AQs', 'AQo'],
      'playable': ['99', 'AJs', 'KQs'],
      'action': 'RAISE',
      'sizing': '2.5x',
      'range': '~12%',
      'description': 'Range muito restrito, apenas mãos premium'
    },
    'UTG+1': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', 'AQs', 'AQo'],
      'playable': ['88', 'AJs', 'KQs'],
      'action': 'RAISE',
      'sizing': '2.5x',
      'range': '~14%',
      'description': 'Range restrito, mãos fortes'
    },
    'UTG+2': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', 'AQs', 'AQo', 'AJs'],
      'playable': ['77', 'KQs', 'KJs'],
      'action': 'RAISE',
      'sizing': '2.5x',
      'range': '~16%',
      'description': 'Range um pouco mais amplo que UTG+1'
    },
    'MP': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', 'AQs', 'AQo', 'AJs', 'KQs'],
      'playable': ['77', '66', 'ATs', 'KJs', 'QJs'],
      'action': 'RAISE',
      'sizing': '2.5x',
      'range': '~18%',
      'description': 'Range moderado, começa a incluir mais suited connectors'
    },
    'HJ': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', 'AQs', 'AQo', 'AJs', 'KQs'],
      'playable': ['77', '66', 'ATs', 'KJs', 'QJs', 'JTs'],
      'action': 'RAISE',
      'sizing': '2.5x',
      'range': '~22%',
      'description': 'Range mais amplo, posição começa a ficar boa'
    },
    'CO': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', '77', 'AQs', 'AQo', 'AJs', 'KQs'],
      'playable': ['66', '55', 'ATs', 'KJs', 'QJs', 'JTs'],
      'action': 'RAISE',
      'sizing': '2.3x',
      'range': '~27%',
      'description': 'Posição tardia, range bem amplo'
    },
    'BTN': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', '77', '66', 'AQs', 'AQo', 'AJs', 'KQs'],
      'playable': ['55', '44', '33', '22', 'ATs', 'KTs', 'QTs', 'JTs', '98s'],
      'action': 'RAISE',
      'sizing': '2.2x',
      'range': '~40%',
      'description': 'Melhor posição, range muito amplo'
    },
    'SB': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', 'AQs', 'AQo', 'AJs', 'KQs'],
      'playable': ['77', '66', 'ATs', 'KJs', 'QJs'],
      'action': 'RAISE',
      'sizing': '3x',
      'range': '~30%',
      'description': 'Range seletivo devido à posição pós-flop ruim'
    },
    'BB': {
      'premium': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'],
      'strong': ['TT', '99', '88', '77', 'AQs', 'AQo', 'AJs', 'KQs'],
      'playable': ['66', '55', '44', '33', '22', 'ATs', 'KJs', 'QJs'],
      'action': 'CALL',
      'sizing': 'Call vs 2.5x',
      'range': '~45%',
      'description': 'Defesa contra aberturas, range depende do sizing'
    }
  }
};

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

function getHandStrength(cards: Card[]): string | null {
  if (cards.length !== 2) return null;
  
  const [card1, card2] = cards;
  const ranks = [card1.rank, card2.rank].sort((a, b) => RANKS.indexOf(a) - RANKS.indexOf(b));
  const suited = card1.suit === card2.suit;
  
  return ranks[0] === ranks[1]
    ? ranks[0] + ranks[1] // Pair
    : ranks[0] + ranks[1] + (suited ? 's' : 'o'); // Non-pair
}

function getHandCategory(hand: string | null, position: Position, tableSize: TableSize): string {
  if (!hand) return 'Selecione duas cartas';
  
  const positionRanges = GTO_RANGES[tableSize][position as keyof typeof GTO_RANGES[typeof tableSize]];
  
  if (positionRanges.premium.includes(hand)) return 'Premium';
  if (positionRanges.strong.includes(hand)) return 'Forte';
  if (positionRanges.playable.includes(hand)) return 'Jogável';
  return 'Fold';
}

function getDetailedAdvice(hand: string | null, tableSize: TableSize, position: Position): string {
  if (!hand) return 'Selecione duas cartas para obter uma recomendação detalhada.';

  const positionData = GTO_RANGES[tableSize][position as keyof typeof GTO_RANGES[typeof tableSize]];
  const category = getHandCategory(hand, position, tableSize);
  
  switch (category) {
    case 'Premium':
      return `${hand} é uma mão premium na posição ${position}. ${positionData.action} ${positionData.sizing}. Você pode jogar esta mão agressivamente de qualquer posição.`;
    case 'Forte':
      return `${hand} é uma mão forte na posição ${position}. ${positionData.action} ${positionData.sizing}. Boa mão para continuar após 3-bet.`;
    case 'Jogável':
      return `${hand} é uma mão jogável na posição ${position}. ${positionData.action} ${positionData.sizing}. Jogue com cautela contra 3-bets.`;
    default:
      return `${hand} não está no range recomendado para ${position}. A ação recomendada é dar fold.`;
  }
}

function GtoCalculator() {
  const [tableSize, setTableSize] = useState<TableSize>('6');
  const [position, setPosition] = useState<Position>('BTN');
  const [showAdvice, setShowAdvice] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  const positions = tableSize === '6' ? POSITIONS_6 : POSITIONS_9;
  const positionData = GTO_RANGES[tableSize][position as keyof typeof GTO_RANGES[typeof tableSize]];
  const hand = getHandStrength(selectedCards);
  const handCategory = getHandCategory(hand, position, tableSize);
  const recommendedAction = handCategory === 'Fold' ? 'FOLD' : positionData.action;

  const handleCardSelect = (rank: string, suit: string) => {
    if (selectedCards.length < 2) {
      setSelectedCards([...selectedCards, { rank, suit }]);
    } else {
      setSelectedCards([{ rank, suit }]);
    }
  };

  const getSuitColor = (suit: string) => {
    return suit === '♥' || suit === '♦' ? 'text-red-500' : 'text-white';
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Tamanho da Mesa</label>
              <div className="relative">
                <select
                  value={tableSize}
                  onChange={(e) => setTableSize(e.target.value as TableSize)}
                  className="w-full bg-gray-700/50 backdrop-blur-sm rounded-xl py-3 px-4 appearance-none cursor-pointer border border-gray-600/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                >
                  <option value="6">6-max</option>
                  <option value="9">9-max</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Posição na Mesa</label>
              <div className="relative">
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as Position)}
                  className="w-full bg-gray-700/50 backdrop-blur-sm rounded-xl py-3 px-4 appearance-none cursor-pointer border border-gray-600/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                >
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium mb-4 text-gray-300">Selecione suas Cartas</label>
            <div className="grid grid-cols-13 gap-1 mb-4">
              {RANKS.map((rank) => (
                <div key={rank} className="text-center font-bold">
                  {rank}
                </div>
              ))}
              {SUITS.map((suit) => (
                <React.Fragment key={suit}>
                  {RANKS.map((rank) => (
                    <button
                      key={`${rank}${suit}`}
                      onClick={() => handleCardSelect(rank, suit)}
                      className={`p-2 text-center rounded ${
                        selectedCards.some(card => card.rank === rank && card.suit === suit)
                          ? 'bg-blue-600'
                          : 'bg-gray-700 hover:bg-gray-600'
                      } ${getSuitColor(suit)} transition-colors`}
                    >
                      {rank}{suit}
                    </button>
                  ))}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-center gap-4 mb-6">
              {selectedCards.map((card, index) => (
                <div
                  key={index}
                  className={`text-2xl font-bold ${getSuitColor(card.suit)} bg-gray-700 rounded-lg p-4`}
                >
                  {card.rank}{card.suit}
                </div>
              ))}
              {Array(2 - selectedCards.length).fill(null).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="text-2xl font-bold text-gray-500 bg-gray-700 rounded-lg p-4 w-16 text-center"
                >
                  ?
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gray-700/30 backdrop-blur-md rounded-xl p-6 border border-gray-600/30">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-300">Análise da Mão:</h3>
                  <div className="mt-2">
                    <p className="text-2xl font-bold">
                      {hand ? (
                        <span className={`${
                          handCategory === 'Premium' ? 'text-yellow-400' :
                          handCategory === 'Forte' ? 'text-green-400' :
                          handCategory === 'Jogável' ? 'text-blue-400' :
                          'text-red-400'
                        }`}>
                          {hand} - {handCategory}
                        </span>
                      ) : (
                        <span className="text-gray-400">Selecione duas cartas</span>
                      )}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg font-medium text-gray-300">Range da Posição:</h4>
                    <p className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                      {positionData.range}
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                  <p className="text-sm text-gray-400 italic">
                    {hand ? getDetailedAdvice(hand, tableSize, position) : 
                    'Selecione suas cartas para receber uma recomendação GTO detalhada.'}
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
                  className={`w-full py-4 rounded-lg font-bold text-xl flex items-center justify-center transform hover:scale-105 transition-all duration-200 ${getActionButtonColor(recommendedAction as Action)}`}
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
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Mãos Premium nesta posição:</h4>
                    <p className="text-yellow-400">{positionData.premium.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Mãos Fortes:</h4>
                    <p className="text-green-400">{positionData.strong.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Mãos Jogáveis:</h4>
                    <p className="text-blue-400">{positionData.playable.join(', ')}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-600/30">
                    <p className="text-sm text-gray-400 italic">
                      Sizing recomendado: {positionData.sizing}
                    </p>
                  </div>
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
export type TableSize = '6' | '9';
export type Position6 = 'UTG' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BB';
export type Position9 = 'UTG' | 'UTG+1' | 'UTG+2' | 'MP' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BB';
export type Position = Position6 | Position9;

export type Card = {
  rank: string;
  suit: string;
};

export type Action = 'FOLD' | 'RAISE' | 'CALL';
import { TupleType } from 'typescript';

export type BookDepth = [
  [number, number],
  [number, number],
  [number, number],
  [number, number],
  [number, number],
];

export type OrderBookMessage = {
  timestamp: string;
  exchange: string;
  coin: string;
  bids: BookDepth;
  asks: BookDepth;
};

export type TokenState = {
  lastTimestamp: string;
  currentData: {
    bids: BookDepth;
    asks: BookDepth;
  };
};

export type OrderBookState = {
  [key: string]: TokenState; // "{coin}|{exchange}" compound key
};

export type ExchangeCoin = {
  exchange: string;
  coin: string;
};

export type MarketSubscriber = (
  coin: string,
  exchange: string,
  onUpdate: (tokenState: TokenState) => void
) => () => void;

export type Side = 'bid' | 'ask';

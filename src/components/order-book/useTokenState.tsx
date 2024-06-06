import React, { useEffect, useState } from 'react';
import { ExchangeCoin, MarketSubscriber, TokenState } from '../../data/types';

type Props = {
  marketSubscriber: MarketSubscriber;
  exchangeCoin: ExchangeCoin | null;
};

export default function useTokenState({
  marketSubscriber,
  exchangeCoin,
}: Props) {
  // const { marketSubscriber, exchangeCoin } = props;
  const [latestState, setLatestState] = useState<TokenState | null>(null);

  useEffect(() => {
    if (exchangeCoin === null) {
      return;
    }

    const unsubscribe = marketSubscriber(
      exchangeCoin.coin,
      exchangeCoin.exchange,
      setLatestState
    );
    return () => {
      unsubscribe();
    };
  }, [exchangeCoin, setLatestState, marketSubscriber]);

  return latestState;
}

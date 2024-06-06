import React, { useEffect, useRef, useState } from 'react';
import { ExchangeCoin, MarketSubscriber, TokenState } from '../../data/types';

type Props = {
  marketSubscriber: MarketSubscriber;
  exchangeCoin: ExchangeCoin | null;
};

/**
 * An abstraction to get the token state given the needed exchangeCoin. It takes care of
 * subscribing and unsubscribing to updates and returning the latest token state on each
 * update.
 */
export default function useTokenState({
  marketSubscriber,
  exchangeCoin,
}: Props) {
  const [latestState, setLatestState] = useState<TokenState | null>(null);
  const [lastExchangeCoin, setLastExchangeCoin] = useState<ExchangeCoin | null>(
    null
  );
  const unsubscribeFunc = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (exchangeCoin === null) {
      return;
    }
    if (
      exchangeCoin.coin === lastExchangeCoin?.coin &&
      exchangeCoin.exchange === lastExchangeCoin?.exchange
    ) {
      return;
    }
    if (unsubscribeFunc.current !== null) {
      // Before subscribing in the same component, unsubscribe from previous component.
      unsubscribeFunc.current();
    }

    const unsubscribe = marketSubscriber(
      exchangeCoin.coin,
      exchangeCoin.exchange,
      setLatestState
    );

    unsubscribeFunc.current = unsubscribe;
    setLastExchangeCoin(exchangeCoin);
  }, [
    exchangeCoin,
    setLatestState,
    marketSubscriber,
    lastExchangeCoin,
    setLastExchangeCoin,
  ]);

  return latestState;
}

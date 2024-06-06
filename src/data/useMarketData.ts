import React, { useCallback, useMemo, useRef, useState } from 'react';
import { MarketSubscriber, OrderBookMessage, TokenState } from './types';
import useOrderBookWebSocket from './useOrderBookWebSocket';

function createCompoundKey(coin: string, exchange: string): string {
  return coin + '|' + exchange;
}

type RegisteredSubscribers = {
  [key: string]: { [key: string]: (tokenState: TokenState) => void };
};

/**
 * Subscribes to the stream of the market updates and manages those internally.
 *
 * Optionally we could keep the current state of all the coins and exchanges to have instant load
 * of the last state. In this case the ticks are so fast and regular that it is not needed for this
 * simulated environment.
 *
 * @returns
 */
export default function useMarketData(): {
  availableCoins: Set<string>;
  availableExchanges: Set<string>;
  marketSubscriber: MarketSubscriber;
} {
  /**
   * NOTE: This part of the code is assuming that all coins run on all exchanges. If this was not
   * the case I would observe which coins run on which exchanges and then have the available
   * exchanges per coin.
   */
  const [availableCoins, setAvailableCoins] = useState<Set<string>>(new Set());
  const [availableExchanges, setAvailableExchanges] = useState<Set<string>>(
    new Set()
  );

  const registeredSubscribers = useRef<RegisteredSubscribers>({});

  const marketSubscriber = useCallback(
    (
      coin: string,
      exchange: string,
      onUpdate: (tokenState: TokenState) => void
    ): (() => void) => {
      console.log(`subscribing to coin ${coin} and exchange ${exchange}`);
      const compoundKey = createCompoundKey(coin, exchange);
      const registerKey = String(Math.random()).slice(2);

      if (compoundKey in registeredSubscribers.current) {
        registeredSubscribers.current[compoundKey][registerKey] = onUpdate;
      } else {
        const obj = {
          [registerKey]: onUpdate,
        };
        registeredSubscribers.current[compoundKey] = obj;
      }

      /**
       * Unsubscribe from the data stream.
       */
      const unsubscribe = () => {
        delete registeredSubscribers.current[compoundKey][registerKey];
        if (
          Object.keys(registeredSubscribers.current[compoundKey]).length === 0
        ) {
          delete registeredSubscribers.current[compoundKey];
        }
      };
      return unsubscribe;
    },
    []
  );

  const updateOrderBookState = useCallback(
    (lastMessage: MessageEvent<any>) => {
      // In a real application I would likely use some types from Swagger or have some validation
      // of the payload here to ensure that the data is not corrupted.
      const orderBookMessage: OrderBookMessage = JSON.parse(lastMessage.data);

      const compoundKey = createCompoundKey(
        orderBookMessage.coin,
        orderBookMessage.exchange
      );

      const newTokenState = {
        lastTimestamp: orderBookMessage.timestamp,
        currentData: {
          bids: orderBookMessage.bids,
          asks: orderBookMessage.asks,
        },
      };

      // update all listeners
      if (compoundKey in registeredSubscribers.current) {
        Object.values(registeredSubscribers.current[compoundKey]).forEach(
          (func) => func(newTokenState)
        );
      }

      // add coins and exchanges which we have not seen yet.
      if (!availableCoins.has(orderBookMessage.coin)) {
        const newCoins = new Set([...availableCoins, orderBookMessage.coin]);
        setAvailableCoins(newCoins);
      }
      if (!availableExchanges.has(orderBookMessage.exchange)) {
        const newExchanges = new Set([
          ...availableExchanges,
          orderBookMessage.exchange,
        ]);
        setAvailableExchanges(newExchanges);
      }
    },
    [
      setAvailableExchanges,
      setAvailableCoins,
      availableCoins,
      availableExchanges,
    ]
  );

  useOrderBookWebSocket(updateOrderBookState);

  const ret = useMemo(
    () => ({
      availableCoins,
      availableExchanges,
      marketSubscriber,
    }),
    [availableCoins, availableExchanges, marketSubscriber]
  );

  return ret;
}

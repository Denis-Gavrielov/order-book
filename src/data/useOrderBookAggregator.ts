// reads the order book data, keeps all data alive
// shows the current data and which fields have been changed since last data.
// essentially is responsible for updates for each exchange.

// probably we want another component which does this only for each individual
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  MarketSubscriber,
  OrderBookMessage,
  OrderBookState,
  TokenState,
} from './types';
import useOrderBookWebSocket from './useOrderBookWebSocket';

function createCompoundKey(coin: string, exchange: string): string {
  return coin + '|' + exchange;
}

type RegisteredSubscribers = {
  [key: string]: { [key: string]: (tokenState: TokenState) => void };
};

// specify that we could try to optimise be throwing away old data.

/**
 * Subscribes to the stream of the market updates and manages those internally.
 *
 *
 *
 * @returns
 */
export default function useOrderBookAggregator(): {
  availableCoins: Set<string>;
  availableExchanges: Set<string>;
  marketSubscriber: MarketSubscriber;
} {
  // say this state object is kinda optional -> it's only necessary if we want fast loads.
  // const [orderBookState, setOrderBookState] = useState<OrderBookState>({}); // can use immer.

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

      const newMarketData = {
        lastTimestamp: orderBookMessage.timestamp,
        currentData: {
          bids: orderBookMessage.bids,
          asks: orderBookMessage.asks,
        },
      };

      const newOrderBookState: OrderBookState = {
        ...orderBookState,
        [compoundKey]: newMarketData,
      }; // can use immer

      setOrderBookState(newOrderBookState);

      // console.log(`subscribers: ${JSON.stringify(registeredSubscribers)}`);
      // update all listeners
      if (compoundKey in registeredSubscribers.current) {
        // console.log(`Updating for key ${compoundKey}`);
        // console.log(orderBookMessage);
        Object.values(registeredSubscribers.current[compoundKey]).forEach(
          (func) => func(newMarketData)
        );
      }

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
      setOrderBookState,
      orderBookState,
      setAvailableExchanges,
      setAvailableCoins,
      availableCoins,
      availableExchanges,
      // registeredSubscribers,
    ]
  );

  const webSocketReadyState = useOrderBookWebSocket(updateOrderBookState); // return not needed

  const ret = useMemo(
    () => ({
      // orderBookState,
      // webSocketReadyState,
      availableCoins,
      availableExchanges,
      marketSubscriber,
    }),
    [
      // orderBookState,
      // webSocketReadyState,
      availableCoins,
      availableExchanges,
      marketSubscriber,
    ]
  );

  return ret;
}

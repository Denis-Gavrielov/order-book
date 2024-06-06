// reads the order book data, keeps all data alive
// shows the current data and which fields have been changed since last data.
// essentially is responsible for updates for each exchange.

// probably we want another component which does this only for each individual
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ExchangeCoin,
  MarketSubscriber,
  OrderBookMessage,
  OrderBookState,
  TokenState,
} from './types';
import useOrderBookWebSocket from './useOrderBookWebSocket';
import { ReadyState } from 'react-use-websocket';

function createCompoundKey(coin: string, exchange: string): string {
  return coin + '|' + exchange;
}

type RegisteredSubscribers = {
  [key: string]: { [key: string]: (tokenState: TokenState) => void };
};

// specify that we could try to optimise be throwing away old data.
export default function useOrderBookAggregator(): {
  orderBookState: OrderBookState;
  webSocketReadyState: ReadyState;
  availableCoins: Set<string>;
  availableExchanges: Set<string>;
  marketSubscriber: MarketSubscriber;
} {
  // maybe "useOrderBookState"

  // say this state object is kinda optional -> it's only necessary if we want fast loads.
  const [orderBookState, setOrderBookState] = useState<OrderBookState>({}); // can use immer.
  const [availableCoins, setAvailableCoins] = useState<Set<string>>(new Set());
  const [availableExchanges, setAvailableExchanges] = useState<Set<string>>(
    new Set()
  );
  // TODO: specify in README that I'm assuming all exchanges have all coins.
  const [registeredSubscribers, setRegisteredSubscribers] =
    useState<RegisteredSubscribers>({}); // compoundKey to multiple subscribers.

  // const unsubscribeForUpdates = useCallback(() => )

  const marketSubscriber = useCallback(
    (
      coin: string,
      exchange: string,
      onUpdate: (tokenState: TokenState) => void
    ): (() => void) => {
      const compoundKey = createCompoundKey(coin, exchange);
      const registerKey = Math.random();

      setRegisteredSubscribers({
        ...registeredSubscribers,
        [compoundKey]: { [registerKey]: onUpdate }, // fix this for multiple
      });

      const unsubscribe = () => {
        // TODO: ensure that given the registerKey we unsubscribe.
        // however, this becomes tricky because how do we know about the currently registered
        // subscribers?
      };
      return unsubscribe;
    },
    [setRegisteredSubscribers, registeredSubscribers]
  );

  const updateOrderBookState = useCallback(
    (lastMessage: MessageEvent<any>) => {
      const orderBookMessage: OrderBookMessage = JSON.parse(lastMessage.data); // ideally have validation

      const compoundKey = createCompoundKey(
        orderBookMessage.coin,
        orderBookMessage.exchange
      );

      // can show delta as well. probably not worth it
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

      // update all listeners
      if (compoundKey in registeredSubscribers) {
        Object.values(registeredSubscribers[compoundKey]).forEach((func) =>
          func(newMarketData)
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
      registeredSubscribers,
    ]
  );

  const webSocketReadyState = useOrderBookWebSocket(updateOrderBookState);

  const ret = useMemo(
    () => ({
      orderBookState,
      webSocketReadyState,
      availableCoins,
      availableExchanges,
      marketSubscriber,
    }),
    [
      orderBookState,
      webSocketReadyState,
      availableCoins,
      availableExchanges,
      marketSubscriber,
    ]
  );

  return ret;
}

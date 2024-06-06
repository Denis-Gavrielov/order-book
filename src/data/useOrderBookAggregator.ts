// reads the order book data, keeps all data alive
// shows the current data and which fields have been changed since last data.
// essentially is responsible for updates for each exchange.

// probably we want another component which does this only for each individual
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ExchangeCoin, OrderBookMessage, OrderBookState } from './types';
import useOrderBookWebSocket from './useOrderBookWebSocket';
import { ReadyState } from 'react-use-websocket';

// specify that we could try to optimise be throwing away old data.
export default function useOrderBookAggregator(): {
  orderBookState: OrderBookState;
  webSocketReadyState: ReadyState;
  availableCoins: Set<string>;
  availableExchanges: Set<string>;
} {
  // maybe "useOrderBookState"
  const [orderBookState, setOrderBookState] = useState<OrderBookState>({}); // can use immer.
  const [availableCoins, setAvailableCoins] = useState<Set<string>>(new Set());
  const [availableExchanges, setAvailableExchanges] = useState<Set<string>>(
    new Set()
  );
  // TODO: specify in README that I'm assuming all exchanges have all coins.

  const updateOrderBookState = useCallback(
    (lastMessage: MessageEvent<any>) => {
      // console.log('received new message', lastMessage.data);

      const orderBookMessage: OrderBookMessage = JSON.parse(lastMessage.data); // ideally have validation

      const compoundKey =
        orderBookMessage.coin + '|' + orderBookMessage.exchange;

      // can show delta as well. probably not worth it

      const newOrderBookState: OrderBookState = {
        ...orderBookState,
        [compoundKey]: {
          lastTimestamp: orderBookMessage.timestamp,
          currentData: {
            bids: orderBookMessage.bids,
            asks: orderBookMessage.asks,
          },
        },
      }; // can use immer

      setOrderBookState(newOrderBookState);

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
    ]
  );

  const webSocketReadyState = useOrderBookWebSocket(updateOrderBookState);

  const ret = useMemo(
    () => ({
      orderBookState,
      webSocketReadyState,
      availableCoins,
      availableExchanges,
    }),
    [orderBookState, webSocketReadyState, availableCoins, availableExchanges]
  );

  return ret;
}

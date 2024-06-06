import React, { useState } from 'react';
import useOrderBookData from '../data/useOrderBookWebSocket';
import ExchangeSelector from '../components/exchange-selector/ExchangeSelector';
import useOrderBookAggregator from '../data/useOrderBookAggregator';
import OrderBook from '../components/order-book/OrderBook';
import { ExchangeCoin } from '../data/types';
import useTokenState from '../components/order-book/useTokenState';

const Main = () => {
  const {
    orderBookState,
    availableCoins,
    availableExchanges,
    marketSubscriber,
  } = useOrderBookAggregator(); // probably this would be called "marketState"

  const [exchangeCoin, setSelectorState] = useState<ExchangeCoin | null>(null);

  // TODO: from orderBook aggregator, make sure that we have a "list to this" function.
  // That will return a thing that returns the updates which we can send into the
  // order book.

  const tokenState = useTokenState({ marketSubscriber, exchangeCoin });

  return (
    <div className="App">
      Hello World!
      {/* <span>Last message: {orderBookData.lastMessage}</span> */}
      {/* <span>Ready state: {orderBookData.connectionStatus}</span> */}
      <ExchangeSelector
        setSelectorState={setSelectorState}
        availableCoins={availableCoins}
        availableExchanges={availableExchanges}
      />
      {exchangeCoin !== null ? <OrderBook tokenState={tokenState} /> : null}
      {/* ^ takes the exchange data, or takes a hook to get the exact data that it needs. 
        From the exchange selector I can already see what data we want.
        */}
    </div>
  );
};

export default Main;

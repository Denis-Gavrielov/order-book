import React, { useState } from 'react';
import useOrderBookData from '../data/useOrderBookWebSocket';
import ExchangeSelector from '../components/exchange-selector/ExchangeSelector';
import useOrderBookAggregator from '../data/useOrderBookAggregator';
import OrderBook from '../components/order-book/OrderBook';
import { ExchangeCoin } from '../data/types';

const Main = () => {
  const orderBookState = useOrderBookAggregator();

  const [selectorState, setSelectorState] = useState<ExchangeCoin | null>(null);

  // TODO: from orderBook aggregator, make sure that we have a "list to this" function.
  // That will return a thing that returns the updates which we can send into the
  // order book.

  return (
    <div className="App">
      Hello World!
      {/* <span>Last message: {orderBookData.lastMessage}</span> */}
      {/* <span>Ready state: {orderBookData.connectionStatus}</span> */}
      <ExchangeSelector
        setSelectorState={setSelectorState}
        availableCoins={orderBookState.availableCoins}
        availableExchanges={orderBookState.availableExchanges}
      />
      <OrderBook />
      {/* ^ takes the exchange data, or takes a hook to get the exact data that it needs. 
        From the exchange selector I can already see what data we want.
        */}
    </div>
  );
};

export default Main;

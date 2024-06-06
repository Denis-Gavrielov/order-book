import React, { memo } from 'react';
import { OrderBookState, TokenState } from '../../data/types';
import MarketDepth from './MarketDepth';

type Props = {
  tokenState: TokenState | null;
};

const OrderBook = (props: Props) => {
  // NOTE: we definitely need to have some sort of unsubscriber as well.
  const { tokenState } = props;

  if (tokenState === null) {
    return (
      <div>
        <h1>Order book</h1>
        <p>Loading market data ...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center m-4">
      <div className="w-1/4 justify-center">
        <h1 className="text-3xl font-bold">Order book</h1>
        <div className="flex justify-center items-center space-x-4">
          <MarketDepth side={'bid'} bookDepth={tokenState.currentData.bids} />
          <MarketDepth side={'ask'} bookDepth={tokenState.currentData.asks} />
        </div>
      </div>
    </div>
  );
};

export default OrderBook;

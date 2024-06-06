import React from 'react';
import { TokenState } from '../../data/types';
import MarketDepth from './MarketDepth';

type Props = {
  tokenState: TokenState | null;
};

/**
 * Display bid and ask side of market data.
 */
const OrderBook = (props: Props) => {
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
      <div className="justify-center">
        <div className="flex justify-center items-center space-x-4">
          <MarketDepth side={'bid'} bookDepth={tokenState.currentData.bids} />
          <MarketDepth side={'ask'} bookDepth={tokenState.currentData.asks} />
        </div>
      </div>
    </div>
  );
};

export default OrderBook;

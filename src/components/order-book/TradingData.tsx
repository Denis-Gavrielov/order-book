import { CloseCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import ExchangeSelector from '../exchange-selector/ExchangeSelector';
import OrderBook from './OrderBook';
import useTokenState from './useTokenState';
import { ExchangeCoin, MarketSubscriber } from '../../data/types';

type Props = {
  availableCoins: Set<string>;
  availableExchanges: Set<string>;
  marketSubscriber: MarketSubscriber;
  onClose: () => void;
};

const TradingData = (props: Props) => {
  const { availableCoins, availableExchanges, marketSubscriber, onClose } =
    props;

  const [exchangeCoin, setSelectorState] = useState<ExchangeCoin | null>(null);
  const tokenState = useTokenState({ marketSubscriber, exchangeCoin });

  return (
    <div className="w-[650px] relative bg-white p-6 rounded shadow-md">
      <h1 className="text-3xl font-bold">Order book</h1>
      <CloseCircleOutlined
        className="absolute top-2 right-2"
        onClick={onClose}
      />
      <div className="flex-vertical">
        <ExchangeSelector
          setSelectorState={setSelectorState}
          availableCoins={availableCoins}
          availableExchanges={availableExchanges}
        />
        {exchangeCoin !== null ? <OrderBook tokenState={tokenState} /> : null}
      </div>
    </div>
  );
};

export default TradingData;

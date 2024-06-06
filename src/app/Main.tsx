import React, { useCallback, useState } from 'react';
import useOrderBookData from '../data/useOrderBookWebSocket';
import ExchangeSelector from '../components/exchange-selector/ExchangeSelector';
import useOrderBookAggregator from '../data/useOrderBookAggregator';
import OrderBook from '../components/order-book/OrderBook';
import { ExchangeCoin } from '../data/types';
import useTokenState from '../components/order-book/useTokenState';
import { CloseCircleOutlined } from '@ant-design/icons';
import TradingData from '../components/order-book/TradingData';
import { Button } from 'antd';

// type TradingDataMap = {
//   [key: string]:;
// };

const Main = () => {
  const { availableCoins, availableExchanges, marketSubscriber } =
    useOrderBookAggregator(); // probably this would be called "marketState"

  const [components, setComponents] = useState<number[]>([1]);

  const onAddExchange = useCallback(() => {
    ('');
    const lastKey = components[components.length - 1];
    setComponents([...components, lastKey + 1]);
  }, [components, setComponents]);

  return (
    <div className="App">
      <Button onClick={onAddExchange}>Add order book</Button>
      <div className="flex">
        {[...components].map((key: number) => {
          return (
            <TradingData
              key={key}
              onClose={() => {
                setComponents(
                  components.filter((value: number) => value !== key)
                );
              }}
              availableCoins={availableCoins}
              availableExchanges={availableExchanges}
              marketSubscriber={marketSubscriber}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Main;

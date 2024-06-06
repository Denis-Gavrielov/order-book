import React, { useCallback, useState } from 'react';
import useMarketData from '../data/useMarketData';
import OrderBookPage from '../components/order-book/OrderBookPage';
import { Button } from 'antd';

const Main = () => {
  const { availableCoins, availableExchanges, marketSubscriber } =
    useMarketData();

  const [components, setComponents] = useState<number[]>([1]);

  const onAddExchange = useCallback(() => {
    const lastKey = components[components.length - 1];
    setComponents([...components, lastKey + 1]);
  }, [components, setComponents]);

  return (
    <div className="App">
      <Button onClick={onAddExchange}>Add order book</Button>
      <div className="flex">
        {[...components].map((key: number) => {
          return (
            <OrderBookPage
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

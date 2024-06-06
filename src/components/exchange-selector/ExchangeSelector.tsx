import React, { memo, useState } from 'react';
import { ExchangeCoin } from '../../data/types';
import { Select } from 'antd';
const { Option } = Select;

type Props = {
  setSelectorState: (newSelection: ExchangeCoin | null) => void;
  availableCoins: Set<string>;
  availableExchanges: Set<string>;
};

const ExchangeSelector = ({
  setSelectorState,
  availableCoins,
  availableExchanges,
}: Props) => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);

  const onCoinSelect = (coin: string) => {
    setSelectedCoin(coin);
    if (selectedExchange !== null) {
      setSelectorState({
        coin,
        exchange: selectedExchange,
      });
    }
  };

  const onExchangeSelect = (exchange: string) => {
    setSelectedExchange(exchange);
    if (selectedCoin !== null) {
      setSelectorState({
        coin: selectedCoin,
        exchange,
      });
    }
  };

  return (
    <div className="m-4">
      <h3 className="text-1xl font-bold m-4">Select a coin and exchange</h3>
      <Select
        style={{ width: 200 }}
        placeholder="Select a Coin"
        onSelect={onCoinSelect}
      >
        {[...availableCoins].map((item, index) => (
          <Option key={index} value={item}>
            {item}
          </Option>
        ))}
      </Select>

      <Select
        style={{ width: 200 }}
        placeholder="Select an Exchange"
        onSelect={onExchangeSelect}
      >
        {[...availableExchanges].map((item, index) => (
          <Option key={index} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default memo(ExchangeSelector);

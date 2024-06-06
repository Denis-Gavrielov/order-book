import React, { useState } from 'react';
import { ExchangeCoin } from '../../data/types';
import { Dropdown, Select } from 'antd';
const { Option } = Select;

type Props = {
  setSelectorState: (newSelection: ExchangeCoin | null) => void;
  availableCoins: Set<string>;
  availableExchanges: Set<string>;
};

// TODO: takes available exchanges and coins.
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
      <h1 className="text-3xl font-bold m-4">Select a coin and exchange</h1>
      {/* <Dropdown items={[...availableCoins]} trigger={['click']} /> */}
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

export default ExchangeSelector;

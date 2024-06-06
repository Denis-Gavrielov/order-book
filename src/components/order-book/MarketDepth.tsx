import React from 'react';
import { Table } from 'antd';
import { BookDepth, Side } from '../../data/types';

type Props = {
  side: Side;
  bookDepth: BookDepth;
};

const columns = [
  {
    title: 'Volume',
    dataIndex: 'volume',
    key: 'volume',
    width: 120,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: 100,
    className: 'text-green-500',
  },
];
const MarketDepth = (props: Props) => {
  const { side, bookDepth } = props;

  const dataSource = bookDepth.map((items: [number, number], index: number) => {
    const [volume, price] = items;
    return {
      key: index,
      volume,
      price,
    };
  });
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        tableLayout="fixed"
        title={() => side}
        className="w-1/2"
      />
    </div>
  );
};

export default MarketDepth;

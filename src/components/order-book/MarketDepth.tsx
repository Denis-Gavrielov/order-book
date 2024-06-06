import React from 'react';
import { Table } from 'antd';
import { BookDepth, Side } from '../../data/types';

type Props = {
  side: Side;
  bookDepth: BookDepth;
};

const MarketDepth = (props: Props) => {
  const { side, bookDepth } = props;

  const color = side === 'bid' ? 'text-green-700' : 'text-red-700';

  const columns = [
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      className: color,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      className: color,
    },
  ];

  const dataSource = bookDepth
    .sort((leftItem: [number, number], rightItem: [number, number]) => {
      const leftPrice = leftItem[1];
      const rightPrice = rightItem[1];

      //   if (side === 'ask') {
      // return leftPricfe - rightPrice;
      //   } else {
      return rightPrice - leftPrice;
      //   }
    })
    .map((items: [number, number], index: number) => {
      const [volume, price] = items;
      return {
        key: index,
        volume,
        price,
      };
    });

  const getTitle = () => {
    const string = side === 'bid' ? 'Bid' : 'Ask';
    return <h1 className="text-xl font-bold">{string}</h1>;
  };
  return (
    <div className="flex flex-col items-center w-auto">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        tableLayout="fixed"
        title={getTitle}
      />
    </div>
  );
};

export default MarketDepth;

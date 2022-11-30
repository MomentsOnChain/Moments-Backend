import { chunkify } from './utils';

export const transactionResult = (
  customerId = '5c4ed244-5060-42a7-9853-9441e4f2085a',
) => [
  {
    totalValue: 260,
    timeLeft: 0,
    transactions: [
      {
        value: 200,
        latency: 850,
        customerId,
      },
      {
        value: 40,
        latency: 100,
        customerId,
      },
      {
        value: 20,
        latency: 50,
        customerId,
      },
    ],
  },
  {
    totalValue: 180,
    timeLeft: 150,
    transactions: [
      {
        value: 110,
        latency: 600,
        customerId,
      },
      {
        value: 70,
        latency: 250,
        customerId,
      },
    ],
  },
  {
    totalValue: 120,
    timeLeft: 0,
    transactions: [
      {
        value: 120,
        latency: 1000,
        customerId,
      },
    ],
  },
];

export const transactionInput = (
  customerId = '5c4ed244-5060-42a7-9853-9441e4f2085a',
) => [
  {
    value: 110,
    latency: 600,
    customerId,
  },
  {
    value: 70,
    latency: 250,
    customerId,
  },
  {
    value: 200,
    latency: 850,
    customerId,
  },
  {
    value: 120,
    latency: 1000,
    customerId,
  },
  {
    value: 20,
    latency: 50,
    customerId,
  },
  {
    value: 40,
    latency: 100,
    customerId,
  },
];

describe('Chunkify', () => {
  it('should return chunkified array of transactions', async () => {
    expect(chunkify(transactionInput())).toStrictEqual(transactionResult());
  });
});

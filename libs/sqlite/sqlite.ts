import Keyv from 'keyv';

export default new Keyv<{
  userId: string;
  amount?: number;
  createdAt: number;
  spacesCount?: number;
  provider?: 'stripe';
  quantity?: number;
  transactionId: string;
}>('sqlite://cache.db');

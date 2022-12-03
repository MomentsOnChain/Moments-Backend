import Keyv from 'keyv';

export default new Keyv<{
  docId?: string;
  userId: string;
  amount?: number;
  spacesCount?: number;
  provider?: 'stripe';
  quantity?: number;
  transactionId: string;
}>('sqlite://cache.db');

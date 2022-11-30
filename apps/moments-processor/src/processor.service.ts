import { TransactionService, UserService } from '@app/mongoose';
import { Injectable } from '@nestjs/common';
import { TransactionArrayOut, TransactionArray } from '../../../config/dto';

@Injectable()
export class MomentsService {
  unsuccessfulTransactions: {
    transaction: TransactionArray;
    retryAfter: number;
  }[] = [];

  constructor(
    private transactionModule: TransactionService,
    private userService: UserService,
  ) {
    setInterval(() => {
      this.retryTransactions();
    }, 1000 * 60 * 5);
  }

  async process(chunk: TransactionArrayOut[]) {
    const transactionOperations = [];
    for (let i = 0; i < chunk.length; i++) {
      const { transactions } = chunk[i];
      for (let j = 0; j < transactions.length; j++) {
        const { value, customerId } = transactions[j];
        const user = await this.userService.findOneByUid(customerId);
        if (user) {
          const difference = user.credit_card.ballance - value;
          if (difference < 0) {
            transactionOperations.push({
              insertOne: { document: { ...transactions[j], success: false } },
            });
            this.unsuccessfulTransactions.push({
              transaction: transactions[j],
              retryAfter: Date.now() + 1000 * 60 * 60,
            });
          } else {
            await this.userService.updateOneByUid(customerId, {
              $inc: { 'credit_card.ballance': -value },
            });
            transactionOperations.push({
              insertOne: { document: { ...transactions[j], success: true } },
            });
          }
        }
      }
    }
    await this.transactionModule.bulkWrite(transactionOperations);

    return true;
  }

  async retryTransactions() {
    const transactionOperations = [];
    for (let i = 0; i < this.unsuccessfulTransactions.length; i++) {
      const { transaction, retryAfter } = this.unsuccessfulTransactions[i];
      if (retryAfter <= Date.now()) {
        const { value, customerId } = transaction;
        const user = await this.userService.findOneByUid(customerId);
        if (user) {
          const difference = user.credit_card.ballance - value;
          if (difference < 0) {
            transactionOperations.push({
              insertOne: {
                document: { ...transaction, success: false, retried: true },
              },
            });
            this.unsuccessfulTransactions.splice(i, 1);
          } else {
            await this.userService.updateOneByUid(customerId, {
              $inc: { 'credit_card.ballance': -value },
            });
            transactionOperations.push({
              insertOne: {
                document: { ...transaction, success: true, retried: true },
              },
            });
            this.unsuccessfulTransactions.splice(i, 1);
          }
        }
      }
    }
    await this.transactionModule.bulkWrite(transactionOperations);
  }
}

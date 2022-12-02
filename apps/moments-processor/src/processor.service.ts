import { TransactionService, UserService } from '@app/mongoose';
import { Injectable } from '@nestjs/common';
import { TransactionArray } from '../../../config/dto';

@Injectable()
export class MomentsService {
  unsuccessfulTransactions: {
    transaction: TransactionArray;
    retryAfter: number;
  }[] = [];

  constructor(
    private transactionModule: TransactionService,
    private userService: UserService,
  ) {}
}

import {
  TransactionModule,
  TransactionService,
  UserModule,
  UserService,
} from '@app/mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
// import { MomentsController } from './processor.controller';
import { MomentsService } from './processor.service';
import { Logger } from '@nestjs/common';

const logger = new Logger();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI ?? '', {
      connectionFactory: (connection: Connection) => {
        const states = {
          0: 'disconnected',
          1: 'connected',
          2: 'connecting',
          3: 'disconnecting',
          99: 'uninitialized',
        };
        connection.on('connected', () => {
          logger.log('DB connected');
        });
        connection.on('disconnected', () => {
          logger.log('DB disconnected');
        });
        connection.on('error', (error) => {
          logger.error('DB connection failed! Error: ' + (error.message ?? ''));
        });

        logger.log(`DB State: ${states[connection.readyState]}`);
        return connection;
      },
    }),
    TransactionModule,
    UserModule,
  ],
  controllers: [],
  providers: [TransactionService, MomentsService, UserService],
})
export class AppModule {}

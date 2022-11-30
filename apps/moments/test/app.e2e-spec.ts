import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { transactionInput, transactionResult } from '../src/util.spec';

describe('Moments Api', () => {
  const testData = {
    first_name: 'Test',
    last_name: 'Tester Testing',
    password: 'Tester123',
    username: 'Tester@1',
    gender: 'Male',
    phone_number: '0123456789',
    social_insurance_number: '2454545',
    avatar: 'https://sofi.gg',
    email: `${Date.now()}@tester.me`,
    date_of_birth: '1900-01-01 15:00:00.000',
    credit_card: {
      ballance: 0,
      cc_number: '154545',
    },
  };
  let uid: string;
  let accessToken: string;

  let app: INestApplication;
  const apiService = {
    isAuthenticated: () => true,
    getUser: () => ({
      first_name: testData.first_name,
      last_name: testData.last_name,
      ballance: testData.credit_card.ballance,
    }),
    softDelete: () => ({ deleted: true }),
    updateUser: () => ({
      first_name: testData.first_name,
      last_name: testData.last_name,
      ballance: 2000,
    }),
    chunkify: () => [],
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    const body = (
      await request(app.getHttpServer()).post('/auth/signup').send(testData)
    ).body;
    uid = body.uid;
    accessToken = body.access_token;
  });

  it(`/GET customer:id`, () => {
    return request(app.getHttpServer())
      .get(`/customer/${uid}`)
      .auth(accessToken, { type: 'bearer' })
      .expect(200)
      .expect(apiService.getUser());
  });

  it(`/PATCH customer:id`, () => {
    return request(app.getHttpServer())
      .patch(`/customer/${uid}`)
      .send({
        credit_card: {
          ballance: 2000,
          cc_number: 'a23',
        },
      })
      .expect(200)
      .expect(apiService.updateUser());
  });

  it(`/POST transaction`, () => {
    return request(app.getHttpServer())
      .post('/transaction')
      .send({
        data: transactionInput(uid),
      })
      .auth(accessToken, { type: 'bearer' })
      .expect(200)
      .expect({ acknowledged: true, chunkified: transactionResult(uid) });
  });

  it(`/DELETE customer:id`, () => {
    return request(app.getHttpServer())
      .delete(`/customer/${uid}`)
      .expect(200)
      .expect(apiService.softDelete());
  });

  afterAll(async () => {
    await app.close();
  });
});

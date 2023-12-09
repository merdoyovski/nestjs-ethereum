import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { bootstrap } from './main';
import * as request from 'supertest';

describe('bootstrap', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should listen on port 3001', async () => {
    const dynamicPort = 3001;
    await bootstrap(dynamicPort);
    expect(app.getHttpServer()).toBeDefined();

    const response = await request(`http://localhost:${dynamicPort}`).get('/');
    expect(response.status).toBeGreaterThanOrEqual(200);
  });

  afterEach(async () => {
    await app.close();
  });
});

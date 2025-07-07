import request from 'supertest';
import express from 'express';
import { initTestDb } from '../test-utils/init-test-db';

let server: express.Express;

beforeAll(async () => {
  await initTestDb();
  const app = (await import('../app')).default;
  server = app;
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({
        fullName: 'Integration User',
        birthDate: '1990-01-01',
        email: 'integration@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('integration@example.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('should not register with existing email', async () => {
    await request(server)
      .post('/auth/register')
      .send({
        fullName: 'Integration User',
        birthDate: new Date('1990-01-01'),
        email: 'integration2@example.com',
        password: 'password123',
      });
    const res = await request(server)
      .post('/auth/register')
      .send({
        fullName: 'Integration User',
        birthDate: '1990-01-01',
        email: 'integration2@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

   it('should login user', async () => {
    await request(server)
      .post('/auth/register')
      .send({
        fullName: 'Login User',
        birthDate: '1990-01-01',
        email: 'login@example.com',
        password: 'password123',
      });
    const res = await request(server)
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body).toHaveProperty('id');
  });

  it('should not login with wrong password', async () => {
    await request(server)
      .post('/auth/register')
      .send({
        fullName: 'Wrong Password',
        birthDate: '1990-01-01',
        email: 'wrongpass@example.com',
        password: 'password123',
      });
    const res = await request(server)
      .post('/auth/login')
      .send({
        email: 'wrongpass@example.com',
        password: 'wrong',
      });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
}); 
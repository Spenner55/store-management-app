const request = require('supertest');
const { buildApp } = require('../helpers');

// --- Mocks ---
jest.mock('../../middleware/loginLimiter', () => (req, res, next) => next());

// mock DB pool
const mockQuery = jest.fn();
jest.mock('../../config/connect', () => ({
  query: (...args) => mockQuery(...args),
}));

// mock bcrypt + jwt
jest.mock('bcrypt', () => ({ compare: jest.fn() }));
const bcrypt = require('bcrypt');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'signed.token.value'),
  verify: jest.fn((token, secret, cb) => cb(null, { email: 'test@example.com', id: 1 })),
}));
const jwt = require('jsonwebtoken');

// Bring in the controller module so mocks apply
const authController = require('../../controllers/authController'); // uses pool,bcrypt,jwt,cookies :contentReference[oaicite:10]{index=10}

describe('Auth routes', () => {
  const app = buildApp({ mountAuth: true, mountInventory: false });

  beforeEach(() => {
    mockQuery.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockClear();
  });

  test('POST /auth - 400 when fields missing', async () => {
    const res = await request(app).post('/auth').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'All fields required' });
  });

  test('POST /auth - 401 when user not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).post('/auth').send({ email: 'x@y.com', password: 'pw' });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized Employee' });
  });

  test('POST /auth - 401 when password mismatch', async () => {
    // DB returns a user
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, email: 'x@y.com', password: 'hash', role: 'Employee' }] });
    bcrypt.compare.mockResolvedValueOnce(false);

    const res = await request(app).post('/auth').send({ email: 'x@y.com', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized Employee' });
  });

  test('POST /auth - 200 success returns accessToken and sets refresh cookie', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, email: 'x@y.com', password: 'hash', role: 'Employee' }] });
    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await request(app).post('/auth').send({ email: 'x@y.com', password: 'pw' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ accessToken: 'signed.token.value' });
    // cookie 'jwt' should be set for refresh
    const setCookieHeaders = res.headers['set-cookie'] || [];
    expect(setCookieHeaders.join(';')).toMatch(/jwt=/);
  });

  test('GET /auth/refresh - 401 if no jwt cookie', async () => {
    const res = await request(app).get('/auth/refresh');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized Refresh' });
  });

  test('GET /auth/refresh - 200 returns new accessToken when cookie present', async () => {
    // controller will jwt.verify -> decoded.email, then query DB for email+role and sign again
    mockQuery.mockResolvedValueOnce({ rows: [{ email: 'test@example.com', role: 'Employee' }] });

    const res = await request(app)
      .get('/auth/refresh')
      .set('Cookie', ['jwt=refresh.token.value']);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ accessToken: 'signed.token.value' });
  });

  test('POST /auth/logout - clears cookie', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .set('Cookie', ['jwt=refresh.token.value']);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Cookie cleared' });
    const setCookie = (res.headers['set-cookie'] || []).join(';');
    expect(setCookie).toMatch(/jwt=;/); // cleared/expired
  });
});

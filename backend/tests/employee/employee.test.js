const request = require('supertest');
const { buildApp } = require('../helpers');

// Mock JWT middleware to pass through
jest.mock('../../middleware/verifyJWT', () => (req, res, next) => next());

// Mock database pool
const mockQuery = jest.fn();
jest.mock('../../config/connect', () => ({
  query: (...args) => mockQuery(...args),
}));

// Mock bcrypt hashing
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed-password')),
}));
const bcrypt = require('bcrypt');

// Ensure controller uses the mocked dependencies
require('../../controllers/employeeController');

describe('Employee routes', () => {
  const app = buildApp({ mountEmployee: true });

  beforeEach(() => {
    mockQuery.mockReset();
    bcrypt.hash.mockClear();
  });

  describe('GET /employee', () => {
    test('returns employees when available', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            first_name: 'Alice',
            last_name: 'Smith',
            email: 'alice@example.com',
            department: 'Sales',
            role: 'Cashier',
            wage: 15,
          },
        ],
      });

      const res = await request(app).get('/employee');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          id: 1,
          first_name: 'Alice',
          last_name: 'Smith',
          email: 'alice@example.com',
          department: 'Sales',
          role: 'Cashier',
          wage: 15,
        },
      ]);
    });

    test('returns 400 when no employees found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get('/employee');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'No Employees Found' });
    });
  });

  describe('POST /employee', () => {
    test('returns 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/employee')
        .send({ first_name: 'Alice' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Required Fields Not Completed' });
      expect(mockQuery).not.toHaveBeenCalled();
    });

    test('creates a new employee when data is valid', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ first_name: 'Alice', last_name: 'Smith' }],
      });

      const res = await request(app)
        .post('/employee')
        .send({
          first_name: 'Alice',
          last_name: 'Smith',
          email: 'alice@example.com',
          password: 'plain-password',
          department: 'Sales',
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: expect.stringContaining('New Employee') });
      expect(bcrypt.hash).toHaveBeenCalledWith('plain-password', 10);
      expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [
        'Alice',
        'Smith',
        'alice@example.com',
        'hashed-password',
        'Sales',
      ]);
    });
  });

  describe('PATCH /employee', () => {
    test('returns 400 when required fields missing', async () => {
      const res = await request(app)
        .patch('/employee')
        .send({ id: 1, first_name: 'Alice' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'All fields are required' });
      expect(mockQuery).not.toHaveBeenCalled();
    });

    test('returns 400 when employee is not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .patch('/employee')
        .send({
          id: 1,
          first_name: 'Alice',
          last_name: 'Smith',
          email: 'alice@example.com',
          department: 'Sales',
          wage: 20,
          role: 'Manager',
          password: 'new-password',
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'No employee found' });
    });

    test('updates an employee and hashes new password', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ id: 1, password: 'existing-hash' }] })
        .mockResolvedValueOnce({ rows: [{ first_name: 'Alice', last_name: 'Smith' }] });

      const res = await request(app)
        .patch('/employee')
        .send({
          id: 1,
          first_name: 'Alice',
          last_name: 'Smith',
          email: 'alice@example.com',
          department: 'Sales',
          wage: 20,
          role: 'Manager',
          password: 'new-password',
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Employee Alice Smith has been updated' });
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
      expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
        'Alice',
        'Smith',
        'alice@example.com',
        'Sales',
        20,
        'Manager',
        'hashed-password',
        1,
      ]);
    });

    test('updates an employee without hashing when password not provided', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ id: 1, password: 'existing-hash' }] })
        .mockResolvedValueOnce({ rows: [{ first_name: 'Alice', last_name: 'Smith' }] });

      const res = await request(app)
        .patch('/employee')
        .send({
          id: 1,
          first_name: 'Alice',
          last_name: 'Smith',
          email: 'alice@example.com',
          department: 'Sales',
          wage: 20,
          role: 'Manager',
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Employee Alice Smith has been updated' });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockQuery).toHaveBeenLastCalledWith(expect.any(String), [
        'Alice',
        'Smith',
        'alice@example.com',
        'Sales',
        20,
        'Manager',
        'existing-hash',
        1,
      ]);
    });
  });

  describe('DELETE /employee', () => {
    test('returns 400 when id missing', async () => {
      const res = await request(app).delete('/employee').send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Missing id' });
      expect(mockQuery).not.toHaveBeenCalled();
    });

    test('returns 400 when employee not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .delete('/employee')
        .send({ id: 1 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'No employee found to delete' });
    });

    test('deletes an employee successfully', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ first_name: 'Alice', last_name: 'Smith' }] });

      const res = await request(app)
        .delete('/employee')
        .send({ id: 1 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Employee Alice Smith deleted' });
      expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [1]);
    });
  });
});

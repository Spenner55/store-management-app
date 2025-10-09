const request = require('supertest');
const { buildApp } = require('../helpers');

// mock JWT middleware to a pass-through
jest.mock('../../middleware/verifyJWT', () => (req, res, next) => next());

// mock DB
const mockQuery = jest.fn();
jest.mock('../../config/connect', () => ({
  query: (...args) => mockQuery(...args),
}));

// bring controller to apply mocks
require('../../controllers/inventoryController');

describe('POST /inventory - createNewItem', () => {
    const app = buildApp({ mountInventory: true});

    beforeEach(() => mockQuery.mockReset());

    test('400 if item_name or price is missing', async () => {
    const res = await request(app)
      .post('/inventory')
      .send({ price: 4.99 }); // missing name

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'name and price must be provided' });
  });

  test('201 if new item successfully inserted', async () => {
    const fakeItem = { id: 1, item_name: 'Apple', price: 1.99, current_stock: 50 };
    mockQuery.mockResolvedValueOnce({ rows: [fakeItem] });

    const res = await request(app)
      .post('/inventory')
      .send({ item_name: 'Apple', price: 1.99, current_stock: 50 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'New Item Created', item: fakeItem });
  });

  test('400 if DB returns no rows (insert failed)', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .post('/inventory')
      .send({ item_name: 'Pear', price: 2.99, current_stock: 20 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Error creating item' });
  });
});
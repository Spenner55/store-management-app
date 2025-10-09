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
require('../../controllers/inventoryController'); // uses pool.query and req.query.*  :contentReference[oaicite:14]{index=14}

describe('Inventory routes', () => {
  const app = buildApp({ mountInventory: true, mountAuth: false });

  beforeEach(() => mockQuery.mockReset());

  test('GET /inventory - returns items', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        { id: 1, item_name: 'Apple', description: 'Fruit', current_stock: 10, price: 1.25, department: 'produce' },
      ],
    });

    const res = await request(app).get('/inventory');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, item_name: 'Apple', description: 'Fruit', current_stock: 10, price: 1.25, department: 'produce' },
    ]);
  });

  test('GET /inventory - 400 when no items', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/inventory');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'No items found in inventory' });
  });

  test('GET /inventory/:department - 200 when department match', async () => {
    mockQuery.mockResolvedValueOnce({ 
        rows: [
            { id: 1, item_name: 'Apple', description: 'Fruit', current_stock: 10, price: 1.25, department: 'produce' }
        ],
    });
    const res = await request(app).get('/inventory/department/produce');
    expect(res.status).toBe(200);
  });

  test('GET /inventory/department/:department - 400 when no department match', async () => {
    mockQuery.mockResolvedValueOnce({ 
        rows: []
    });
    const res = await request(app).get('/inventory/department/produce');
    expect(res.status).toBe(400);
  });

  test('GET /inventory/item/:item_name - 200 when item_name match', async () => {
    mockQuery.mockResolvedValueOnce({ 
        rows: [
            { id: 1, item_name: 'Apple', description: 'Fruit', current_stock: 10, price: 1.25, department: 'produce' }
        ],
    });
    const res = await request(app).get('/inventory/item/Apple');
    expect(res.status).toBe(200);
  });

  test('GET /inventory/item/:item_name - 200 when partial name match', async () => {
    mockQuery.mockResolvedValueOnce({ 
        rows: [
            { id: 1, item_name: 'Apple', description: 'Fruit', current_stock: 10, price: 1.25, department: 'produce' }
        ],
    });
    const res = await request(app).get('/inventory/item/App');
    expect(res.status).toBe(200);
  });

  test('GET /inventory/item/:item_name - 400 when no item_name match', async () => {
    mockQuery.mockResolvedValueOnce({ 
        rows: [],
    });
    const res = await request(app).get('/inventory/item/Apple');
    expect(res.status).toBe(400);
  });
});

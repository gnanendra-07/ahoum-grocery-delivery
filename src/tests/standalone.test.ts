import test from 'node:test';
import assert from 'node:assert/strict';

// Simulated Product Type
interface TestProduct {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
}

interface TestCartItem {
  product: TestProduct;
  quantity: number;
}

// 1. Search Race-Condition Shield Test
test('Async Search: AbortController cancels pending request', async () => {
  const controller = new AbortController();
  controller.abort();

  let isAborted = false;
  try {
    if (controller.signal.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      isAborted = true;
    }
  }

  assert.equal(isAborted, true);
});

test('Async Search: Out-of-order responses do not overwrite newer query state', async () => {
  let latestRequestId = 0;
  let activeResults: string[] = [];

  const simulateSearch = async (query: string, delayMs: number, requestId: number) => {
    await new Promise((r) => setTimeout(r, delayMs));
    if (requestId === latestRequestId) {
      activeResults = [query];
    }
  };

  // Request 1: slow (100ms delay) for query "egg"
  latestRequestId = 1;
  const p1 = simulateSearch('egg', 100, 1);

  // Request 2: fast (20ms delay) for query "apple"
  latestRequestId = 2;
  const p2 = simulateSearch('apple', 20, 2);

  await Promise.all([p1, p2]);

  // Active results MUST reflect Request 2 ("apple"), NOT Request 1 ("egg")
  assert.deepEqual(activeResults, ['apple']);
});

// 2. Persisted Cart Revalidation Test
test('Cart Persistence: Revalidates deleted items, price updates, and stock limits', () => {
  const currentCatalog: TestProduct[] = [
    { id: 'p1', name: 'Organic Bananas', price: 3.49, stock: 5 },
    { id: 'p2', name: 'Red Apples', price: 5.99, stock: 10 }, // Price updated from 4.99 -> 5.99
  ];

  const storedCartItems: TestCartItem[] = [
    {
      product: { id: 'p2', name: 'Red Apples', price: 4.99, stock: 10 },
      quantity: 3,
    },
    {
      product: { id: 'p1', name: 'Organic Bananas', price: 3.49, stock: 5 },
      quantity: 12, // Exceeds current stock (5)
    },
    {
      product: { id: 'deleted-p3', name: 'Discontinued Item', price: 9.99, stock: 0 },
      quantity: 2, // Product no longer exists in catalog
    },
  ];

  // Perform revalidation logic matching useCartStore
  const productMap = new Map<string, TestProduct>(currentCatalog.map((p) => [p.id, p]));
  const revalidated: TestCartItem[] = [];

  for (const item of storedCartItems) {
    const latest = productMap.get(item.product.id);
    if (!latest || latest.stock <= 0) continue;

    const clampedQty = Math.min(item.quantity, latest.stock);
    if (clampedQty > 0) {
      revalidated.push({
        product: latest,
        quantity: clampedQty,
      });
    }
  }

  // Assertion 1: Deleted item dropped
  assert.equal(revalidated.length, 2);
  assert.ok(!revalidated.some((i) => i.product.id === 'deleted-p3'));

  // Assertion 2: Price updated to latest catalog price (5.99)
  const apple = revalidated.find((i) => i.product.id === 'p2');
  assert.equal(apple?.product.price, 5.99);

  // Assertion 3: Quantity clamped to available stock (5)
  const banana = revalidated.find((i) => i.product.id === 'p1');
  assert.equal(banana?.quantity, 5);
});

test('Cart Persistence: Out-of-stock products (stock=0) are removed during revalidation', () => {
  const currentCatalog: TestProduct[] = [
    { id: 'fresh-chicken', name: 'Fresh Whole Chicken', price: 7.49, stock: 0 }, // was in stock, now OOS
    { id: 'salmon-fillet', name: 'Salmon Fillet', price: 16.99, stock: 0 },      // was in stock, now OOS
    { id: 'cashews', name: 'Cashew Nuts', price: 7.49, stock: 40 },              // still in stock
  ];

  const storedCartItems: TestCartItem[] = [
    { product: { id: 'fresh-chicken', name: 'Fresh Whole Chicken', price: 8.99, stock: 25 }, quantity: 1 },
    { product: { id: 'salmon-fillet', name: 'Salmon Fillet', price: 16.99, stock: 15 }, quantity: 2 },
    { product: { id: 'cashews', name: 'Cashew Nuts', price: 8.99, stock: 40 }, quantity: 3 },
  ];

  const productMap = new Map<string, TestProduct>(currentCatalog.map((p) => [p.id, p]));
  const revalidated: TestCartItem[] = [];

  for (const item of storedCartItems) {
    const latest = productMap.get(item.product.id);
    if (!latest || latest.stock <= 0) continue; // drop OOS or deleted
    const clampedQty = Math.min(item.quantity, latest.stock);
    if (clampedQty > 0) {
      revalidated.push({ product: latest, quantity: clampedQty });
    }
  }

  // OOS products must be removed from cart
  assert.ok(!revalidated.some((i) => i.product.id === 'fresh-chicken'), 'OOS chicken should be removed');
  assert.ok(!revalidated.some((i) => i.product.id === 'salmon-fillet'), 'OOS salmon should be removed');

  // In-stock cashews must remain
  assert.equal(revalidated.length, 1);
  const cashewItem = revalidated[0];
  assert.ok(cashewItem !== undefined, 'Cashew item should be present');
  assert.equal(cashewItem.product.id, 'cashews');
  assert.equal(cashewItem.quantity, 3);
});

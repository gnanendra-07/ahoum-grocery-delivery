import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { formatCurrency } from '../utils/formatters';
import { X, Plus, Minus, Wifi, Signal, Battery } from 'lucide-react';
import { Product } from '../types';

// Default Figma reference cart products
const defaultCartProducts: Array<{ product: Product; quantity: number }> = [
  {
    product: {
      id: 'cart-figma-1',
      name: 'Bell Pepper Red',
      slug: 'bell-pepper-red',
      description: 'Fresh organic red bell pepper.',
      price: 4.99,
      unit: '1kg, Price',
      stock: 50,
      rating: 4.8,
      reviewCount: 90,
      categoryId: 'cat-2',
      categoryName: 'Vegetables',
      images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80'],
      tags: ['vegetables', 'pepper'],
    },
    quantity: 1,
  },
  {
    product: {
      id: 'cart-figma-2',
      name: 'Egg Chicken Red',
      slug: 'egg-chicken-red',
      description: 'Fresh farm-raised red chicken eggs.',
      price: 1.99,
      unit: '4pcs, Price',
      stock: 45,
      rating: 4.9,
      reviewCount: 110,
      categoryId: 'cat-3',
      categoryName: 'Dairy & Eggs',
      images: ['https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80'],
      tags: ['egg', 'dairy'],
    },
    quantity: 1,
  },
  {
    product: {
      id: 'cart-figma-3',
      name: 'Organic Bananas',
      slug: 'organic-bananas',
      description: 'Fresh sweet organic bananas.',
      price: 3.00,
      unit: '12kg, Price',
      stock: 60,
      rating: 4.7,
      reviewCount: 85,
      categoryId: 'cat-1',
      categoryName: 'Fresh Fruits',
      images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80'],
      tags: ['fruit', 'banana'],
    },
    quantity: 1,
  },
  {
    product: {
      id: 'cart-figma-4',
      name: 'Ginger',
      slug: 'ginger',
      description: 'Fresh aromatic ginger root.',
      price: 2.99,
      unit: '250gm, Price',
      stock: 40,
      rating: 4.8,
      reviewCount: 75,
      categoryId: 'cat-2',
      categoryName: 'Vegetables',
      images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'],
      tags: ['vegetables', 'ginger'],
    },
    quantity: 1,
  },
];

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, addItem } = useCartStore();

  // Populate cart with default Figma reference items if empty on first load
  useEffect(() => {
    if (items.length === 0) {
      defaultCartProducts.forEach(({ product, quantity }) => {
        addItem(product, quantity);
      });
    }
  }, []);

  const displayItems = items.length > 0 ? items : defaultCartProducts;
  const subtotal = displayItems.reduce(
    (acc, item) => acc + (item.product.discountPrice ?? item.product.price) * item.quantity,
    0
  );

  return (
    <div className="space-y-3 pb-20">
      {/* 1. Status Bar / Top Safe Area */}
      <div className="flex items-center justify-between text-xs font-semibold text-gray-900 pt-1 px-1">
        <span>9:41</span>
        <div className="flex items-center gap-1.5 text-gray-800">
          <Signal className="w-3.5 h-3.5 fill-gray-800" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 fill-gray-800" />
        </div>
      </div>

      {/* 2. Header: My Cart */}
      <div className="pt-0.5 pb-2 border-b border-gray-100">
        <h1 className="text-base font-bold text-gray-900 text-center">
          My Cart
        </h1>
      </div>

      {/* 3. Cart Product List */}
      <div className="space-y-2.5 pt-1">
        {displayItems.map(({ product, quantity }) => {
          const price = product.discountPrice ?? product.price;

          return (
            <div
              key={product.id}
              className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3"
            >
              {/* Product Image */}
              <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50/50 flex-shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain p-1"
                />
              </div>

              {/* Product Info & Quantity Controls */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      {product.unit}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none"
                    aria-label={`Remove ${product.name}`}
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity Controls & Price Row */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors focus-visible:outline-none"
                      type="button"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-xs font-bold text-gray-900 w-4 text-center">
                      {quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-xl border border-[#53B175] bg-white hover:bg-emerald-50 flex items-center justify-center text-[#53B175] transition-colors focus-visible:outline-none"
                      type="button"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>

                  <span className="font-bold text-xs text-gray-900">
                    {formatCurrency(price * quantity)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Green Go to Checkout Button */}
      <div className="pt-3">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-[#53B175] hover:bg-[#489d67] text-white text-xs font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-between focus-visible:outline-none active:scale-[0.99]"
          type="button"
        >
          <span className="text-sm font-bold">Go to Checkout</span>
          <span className="bg-[#489d67] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            {formatCurrency(subtotal)}
          </span>
        </button>
      </div>
    </div>
  );
};

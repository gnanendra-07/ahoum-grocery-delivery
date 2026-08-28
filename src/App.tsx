import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { mockApi } from './services/mockApi';
import { useCartStore } from './stores/useCartStore';

export const App: React.FC = () => {
  const revalidateCart = useCartStore((state) => state.revalidateCart);

  useEffect(() => {
    // Synchronize and revalidate persisted cart against latest product dataset on app mount
    const syncPersistedCart = async () => {
      try {
        const res = await mockApi.getProducts({ limit: 100 });
        if (res.data && res.data.length > 0) {
          revalidateCart(res.data);
        }
      } catch (err) {
        console.warn('[App] Skipping initial cart revalidation due to network error.', err);
      }
    };

    syncPersistedCart();
  }, [revalidateCart]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistAPI } from '@/services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistIds: Set<number>;
  itemCount: number;
  isLoading: boolean;
  isInWishlist: (productId: string | number) => boolean;
  toggleWishlist: (productId: string | number) => Promise<void>;
  addToWishlist: (productId: string | number) => Promise<void>;
  removeFromWishlist: (productId: string | number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await wishlistAPI.list();
      const ids = new Set((data.items || []).map((item: any) => item.product.id));
      setWishlistIds(ids);
      setItemCount(data.count || 0);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const isInWishlist = (productId: string | number): boolean => {
    return wishlistIds.has(Number(productId));
  };

  const toggleWishlist = async (productId: string | number) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const id = Number(productId);
    const wasInWishlist = wishlistIds.has(id);

    setWishlistIds((prev) => {
      const newSet = new Set(prev);
      if (wasInWishlist) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    try {
      await wishlistAPI.toggle(productId);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      setWishlistIds((prev) => {
        const newSet = new Set(prev);
        if (wasInWishlist) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
    }
  };

  const addToWishlist = async (productId: string | number) => {
    if (!isInWishlist(productId)) {
      await toggleWishlist(productId);
    }
  };

  const removeFromWishlist = async (productId: string | number) => {
    if (isInWishlist(productId)) {
      await toggleWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        itemCount,
        isLoading,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return context;
}

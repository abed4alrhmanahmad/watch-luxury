import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { wishlistAPI } from '@/services/api';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { wishlistIds, itemCount } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const { data } = await wishlistAPI.list();
        setWishlistProducts((data.items || []).map((item: any) => item.product));
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 flex justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-12">
        <div className="mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">MY WISHLIST</h1>
          <p className="text-sm text-muted-foreground font-body">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mb-6 opacity-50" />
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-muted-foreground font-body mb-6 max-w-sm">
              Start adding your favorite watches to your wishlist by clicking the heart icon on products.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-primary text-primary-foreground px-6 py-3 text-xs font-body font-semibold tracking-widest hover:bg-accent transition-colors"
            >
              BROWSE SHOP
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WishlistPage;

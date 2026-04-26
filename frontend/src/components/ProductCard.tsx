import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Product, getImageUrls, isInStock, getStockCount, getOriginalPrice } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const images = getImageUrls(product);
  const inStock = isInStock(product);
  const originalPrice = getOriginalPrice(product);
  const isNew = product.is_new ?? product.isNew;
  const inWishlist = isInWishlist(product.id);

  // Normalise to the shape cartStore expects
  const cartProduct = {
    id: String(product.id),
    name: product.name,
    price: Number(product.price),
    originalPrice,
    category: product.category_slug || (product.category as string) || '',
    brand: product.brand || '',
    description: product.description || '',
    images,
    inStock,
    stockCount: getStockCount(product),
    isNew,
    isFeatured: product.is_featured ?? product.isFeatured,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative overflow-hidden bg-muted mb-3">
        <Link to={`/product/${product.id}`}>
          <img
            src={images[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {isNew && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-body font-semibold tracking-wider px-2 py-1">
            NEW
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-all backdrop-blur-sm"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      <Link to={`/product/${product.id}`}>
        <h3 className="font-body text-sm font-medium text-foreground mb-1">{product.name}</h3>
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <p className="font-body text-sm font-semibold text-foreground">${Number(product.price).toFixed(2)}</p>
        {originalPrice && (
          <p className="text-xs text-muted-foreground line-through">${Number(originalPrice).toFixed(2)}</p>
        )}
      </div>

      <button
        onClick={() => inStock && addItem(cartProduct)}
        disabled={!inStock}
        className="w-full bg-primary text-primary-foreground text-xs font-body font-semibold tracking-wider py-2.5 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
      </button>
    </motion.div>
  );
};

export default ProductCard;

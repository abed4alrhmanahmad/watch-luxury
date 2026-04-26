import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Truck, Shield, RotateCcw, Heart } from 'lucide-react';
import { productsAPI, reviewsAPI } from '@/services/api';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product, getImageUrls, isInStock, getStockCount, getOriginalPrice } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { StarRating } from '@/components/StarRating';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface RatingStats {
  average_rating: number;
  total_reviews: number;
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user: authUser, isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats>({ average_rating: 0, total_reviews: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = (productId: string | number) => {
    setReviewsLoading(true);
    Promise.all([
      reviewsAPI.list(productId),
      reviewsAPI.rating(productId)
    ]).then(([reviewsRes, ratingRes]) => {
      setReviews(reviewsRes.data || []);
      setRatingStats(ratingRes.data || { average_rating: 0, total_reviews: 0 });
    }).catch(() => {}).finally(() => setReviewsLoading(false));
  };

  const handleSubmitReview = async () => {
    if (!id || !authUser || formRating === 0) return;

    setSubmitting(true);
    try {
      await reviewsAPI.create(id, {
        rating: formRating,
        comment: formComment
      });
      setFormRating(0);
      setFormComment('');
      fetchReviews(id);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setSelectedImage(0);
    setQuantity(1);
    setFormRating(0);
    setFormComment('');

    productsAPI.detail(id).then(({ data }) => {
      setProduct(data);
      fetchReviews(id);
      // Fetch related from same category
      const slug = data.category?.slug || data.category_slug;
      if (slug) {
        productsAPI.list({ category: slug, page_size: 5 }).then(({ data: relData }) => {
          const all: Product[] = relData.results ?? relData;
          setRelated(all.filter((p: Product) => String(p.id) !== String(data.id)).slice(0, 4));
        }).catch(() => {});
      }
    }).catch(() => setProduct(null)).finally(() => setIsLoading(false));
  }, [id]);

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

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl">Product not found</h1>
          <Link to="/shop" className="text-accent font-body text-sm mt-4 inline-block">← Back to shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrls = getImageUrls(product);
  const inStock = isInStock(product);
  const stockCount = getStockCount(product);
  const originalPrice = getOriginalPrice(product);

  // Build a normalized product for the cart store (it still expects the old shape)
  const cartProduct = {
    id: String(product.id),
    name: product.name,
    price: Number(product.price),
    originalPrice,
    category: product.category_slug || product.category || '',
    brand: product.brand || '',
    description: product.description || '',
    images: imageUrls,
    inStock,
    stockCount,
    isNew: product.is_new ?? product.isNew,
    isFeatured: product.is_featured ?? product.isFeatured,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="container py-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-muted mb-4">
              <img
                src={imageUrls[selectedImage]}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            {imageUrls.length > 1 && (
              <div className="flex gap-3">
                {imageUrls.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 bg-muted border-2 transition-colors ${
                      selectedImage === i ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>

            <div className="flex items-center gap-4">
              <span className="font-body text-2xl font-bold text-foreground">${Number(product.price).toFixed(2)}</span>
              {originalPrice && (
                <span className="font-body text-lg text-muted-foreground line-through">${Number(originalPrice).toFixed(2)}</span>
              )}
            </div>

            <p className="font-body text-muted-foreground leading-relaxed">{product.description}</p>

            <p className={`text-sm font-body font-semibold ${inStock ? 'text-green-600' : 'text-destructive'}`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-body text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stockCount || 99, quantity + 1))}
                  className="px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => inStock && addItem(cartProduct, quantity)}
                disabled={!inStock}
                className="flex-1 bg-primary text-primary-foreground py-3 text-xs font-body font-semibold tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
              >
                ADD TO CART
              </button>
              <button
                onClick={() => product?.id && toggleWishlist(product.id)}
                className="p-3 border border-border hover:border-accent transition-colors"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    product?.id && isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-border pt-6 space-y-3">
              {[
                { icon: Truck, text: 'Free Shipping on orders over $100' },
                { icon: Shield, text: '2 Years Warranty' },
                { icon: RotateCcw, text: '30 Day Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-accent" />
                  <span className="text-sm font-body text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 border-t border-border pt-12">
          <h2 className="font-heading text-2xl font-bold mb-8">Customer Reviews</h2>

          {/* Rating Summary */}
          <div className="mb-12 p-6 bg-card border border-border">
            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <StarRating value={ratingStats.average_rating} readOnly />
                  <span className="font-heading text-2xl font-bold">{ratingStats.average_rating}</span>
                </div>
                <p className="text-sm text-muted-foreground">{ratingStats.total_reviews} reviews</p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          {isAuthenticated ? (
            <div className="mb-12 p-6 bg-card border border-border">
              <h3 className="font-heading text-lg font-bold mb-6">Leave a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-body font-semibold tracking-widest mb-3 text-foreground">YOUR RATING</label>
                  <StarRating value={formRating} interactive onChange={setFormRating} />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold tracking-widest mb-3 text-foreground">COMMENT (OPTIONAL)</label>
                  <textarea
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-3 border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={4}
                  />
                </div>
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting || formRating === 0}
                  className="bg-primary text-primary-foreground px-6 py-3 text-xs font-body font-semibold tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-12 p-6 bg-card border border-border text-center">
              <p className="text-muted-foreground font-body mb-4">
                Please <Link to="/auth" className="text-accent font-semibold hover:underline">log in</Link> to leave a review.
              </p>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="p-6 bg-card border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-body font-semibold text-foreground">{review.user_name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <StarRating value={review.rating} readOnly />
                        <span className="text-xs text-muted-foreground font-body">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm font-body text-muted-foreground leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-muted-foreground font-body">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl font-bold mb-8 text-center">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;

import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { productsAPI } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Product } from '@/types/product';

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

const ITEMS_PER_PAGE = 12;

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    productsAPI.categories().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number | boolean> = {
        page,
        page_size: ITEMS_PER_PAGE,
      };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      switch (sortBy) {
        case 'price-low': params.ordering = 'price'; break;
        case 'price-high': params.ordering = '-price'; break;
        default: params.ordering = '-created_at';
      }

      const { data }: { data: ApiResponse } = await productsAPI.list(params);
      setProducts(data.results ?? (data as unknown as Product[]));
      setTotalCount(data.count ?? (data as unknown as Product[]).length);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, sortBy, minPrice, maxPrice, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, sortBy, minPrice, maxPrice]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="container py-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Shop</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold">ALL WATCHES</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-body hidden md:block">
              {totalCount} result{totalCount !== 1 ? 's' : ''}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-body border border-border bg-card px-3 py-2 text-foreground focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden text-muted-foreground">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`w-64 flex-shrink-0 space-y-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search watches..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm font-body border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <h3 className="text-xs font-body font-bold tracking-wider mb-3 text-foreground">CATEGORIES</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`text-sm font-body transition-colors ${!selectedCategory ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    All Watches
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`text-sm font-body transition-colors ${selectedCategory === cat.slug ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-body font-bold tracking-wider mb-3 text-foreground">PRICE RANGE</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-20 px-2 py-1.5 text-xs font-body border border-border bg-card text-foreground focus:outline-none"
                  placeholder="$0"
                />
                <span className="text-muted-foreground">—</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-20 px-2 py-1.5 text-xs font-body border border-border bg-card text-foreground focus:outline-none"
                  placeholder="$9999"
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-muted animate-pulse aspect-square" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="text-center text-muted-foreground font-body py-20">No products found.</p>
            ) : (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 text-sm font-body transition-colors ${
                      page === i + 1
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground hover:text-foreground border border-border'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;

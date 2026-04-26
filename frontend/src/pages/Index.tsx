import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Shield, RotateCcw, Award } from 'lucide-react';
import heroImage from '@/assets/hero-watch.jpg';
import saleBanner from '@/assets/sale-banner.jpg';
import { productsAPI } from '@/services/api';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  product_count: number;
}

const heroTextBlocks = [
  {
    line1: 'Timeless Elegance.',
    line2: 'Luxury That Defines You.',
    line3: 'Discover our collection of premium watches and accessories.',
  },
  {
    line1: 'Redefine Your Style.',
    line2: 'Precision Meets Luxury.',
    line3: 'Crafted for modern gentlemen.',
  },
  {
    line1: 'Built for Perfection.',
    line2: 'Designed to Impress.',
    line3: 'Experience true luxury watches.',
  },
];

const HomePage = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const [isHeroFading, setIsHeroFading] = useState(false);

  useEffect(() => {
    productsAPI.list({ is_featured: true, page_size: 8 })
      .then(({ data }) => setFeatured(data.results ?? data))
      .catch(() => {});

    productsAPI.categories()
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let timeoutId: number | undefined;

    const intervalId = window.setInterval(() => {
      setIsHeroFading(true);

      timeoutId = window.setTimeout(() => {
        setHeroTextIndex((prev) => (prev + 1) % heroTextBlocks.length);
        setIsHeroFading(false);
      }, 400);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const currentHeroText = heroTextBlocks[heroTextIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      {/* Hero */}
      <section className="relative h-[85vh] overflow-hidden">
        <img src={heroImage} alt="Luxury watch" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/40 to-transparent" />
        <div className="relative container h-full flex items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl lg:max-w-3xl">
            <motion.h1
              variants={fadeUp}
              className={`hero-title font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight fade-text ${isHeroFading ? 'fade-out' : 'fade-in'}`}
            >
              {currentHeroText.line1}
              <br />
              <span className="text-gold-light">{currentHeroText.line2}</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className={`font-body text-primary-foreground/70 mt-6 text-lg max-w-md fade-text ${isHeroFading ? 'fade-out' : 'fade-in'}`}
            >
              {currentHeroText.line3}
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                to="/shop"
                className="inline-block mt-8 bg-primary text-primary-foreground px-10 py-4 text-xs font-body font-semibold tracking-widest hover:bg-accent transition-colors"
              >
                SHOP NOW
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-card border-y border-border">
        <div className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'FREE SHIPPING', desc: 'On all orders over $100' },
            { icon: Award, title: '2 YEARS WARRANTY', desc: 'Worldwide Guarantee' },
            { icon: RotateCcw, title: 'EASY RETURNS', desc: '30-Day Returns' },
            { icon: Shield, title: 'SECURE PAYMENT', desc: '100% Protected' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 justify-center">
              <Icon className="w-6 h-6 text-accent flex-shrink-0" />
              <div>
                <p className="text-[10px] font-body font-bold tracking-wider text-foreground">{title}</p>
                <p className="text-[10px] font-body text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="container py-20"
      >
        <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 tracking-wide">
          SHOP BY CATEGORY
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <Link to={`/shop?category=${cat.slug}`} className="group block text-center">
                <div className="overflow-hidden rounded-full aspect-square mx-auto max-w-[200px] mb-4 bg-muted">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-body text-sm font-semibold tracking-wider text-foreground uppercase">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 italic font-body">
                  {cat.product_count} items
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="bg-card py-20"
      >
        <div className="container">
          <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold text-center mb-4 tracking-wide">
            FEATURED PRODUCTS
          </motion.h2>
          <motion.div variants={fadeUp} className="flex justify-center gap-8 mb-12">
            <span className="text-xs font-body font-medium tracking-wider pb-2 border-b-2 border-primary text-foreground">
              NEW ARRIVALS
            </span>
            <Link to="/shop" className="text-xs font-body font-medium tracking-wider text-accent hover:text-primary transition-colors">
              VIEW ALL
            </Link>
          </motion.div>
          {featured.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-muted animate-pulse aspect-square" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Sale Banner */}
      <section className="relative h-[400px] overflow-hidden">
        <img src={saleBanner} alt="Exclusive collection" loading="lazy" className="absolute inset-0 w-full h-full object-cover" width={1920} height={640} />
        <div className="absolute inset-0 bg-espresso/50" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative container h-full flex flex-col items-center justify-center text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-body text-gold-light tracking-widest mb-2">
            UP TO 30% OFF
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
            Exclusive Collection
          </motion.h2>
          <motion.div variants={fadeUp}>
            <Link
              to="/shop"
              className="inline-block mt-8 bg-accent text-accent-foreground px-10 py-3 text-xs font-body font-semibold tracking-widest hover:bg-primary transition-colors"
            >
              SHOP THE SALE
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;

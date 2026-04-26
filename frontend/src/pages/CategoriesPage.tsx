import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { categories, products } from "@/data/products";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6 } }),
};

const sqlCategoryImageMap: Record<string, string> = {
  "men-watches": "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop",
  "women-watches": "https://plus.unsplash.com/premium_photo-1728012217493-b0bfdc0c389a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Um9zZSUyMEdvbGQlMjBEaWFtb25kJTIwRGlhbHxlbnwwfHwwfHx8M",
  "accessories": "https://i0.wp.com/garoboyadjian.com/wp-content/uploads/2024/11/GM22-2-scaled.jpg?resize=800%2C1052&ssl=1",
  "accessories-for-women": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRltuH8XgejgsHxmW07_Axmn3tRxeoikxITFHZCiDvcoR6Fv456klhbdO1oZCYNZlWRHCCRrVA3GrpqFkDz6kttoBPr5fqZe9lA1We3f64iIl_YAu5NR6SN9QLH06vtngOIYJuibzo_&usqp=CAc",
};

const sqlFeaturedProductImagesMap: Record<string, string[]> = {
  "men-watches": [
    "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=600&h=600&fit=crop",
  ],
  "women-watches": [
    "https://plus.unsplash.com/premium_photo-1728012217493-b0bfdc0c389a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Um9zZSUyMEdvbGQlMjBEaWFtb25kJTIwRGlhbHxlbnwwfHwwfHx8M",
    "https://images.unsplash.com/photo-1708006257965-b571a67d2a63?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8R29sZCUyMEJyYWNlbGV0JTIwUXVhcnR6fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1621179106364-f68b7452dafc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8RGlhbW9uZCUyMEJlemVsJTIwTHV4dXJ5fGVufDB8fDB8fHww",
  ],
};

const CategoriesPage = () => {
  const getCategoryProducts = (slug: string) => products.filter((p) => p.category === slug);
  const visibleCategories = categories;
  const getCategoryCoverImage = (slug: string, fallbackImage: string) => {
    if (sqlCategoryImageMap[slug]) {
      return sqlCategoryImageMap[slug];
    }

    const firstProductWithImage = products.find((p) => p.category === slug && p.images.length > 0);
    return firstProductWithImage?.images[0] ?? fallbackImage;
  };

  const getFeaturedProductImage = (slug: string, index: number, fallbackImage: string) => {
    return sqlFeaturedProductImagesMap[slug]?.[index] ?? fallbackImage;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      {/* Hero */}
      <section className="relative overflow-hidden text-primary-foreground py-16 md:py-24">
        <img
          src="https://www.watches.com/cdn/shop/files/archetype-archer-automatic-ARC-1177-06L-03-web_3024x.jpg?v=1776105690"
          alt="Luxury watch collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-heading text-4xl md:text-6xl font-bold mb-4"
          >
            Our Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-lg text-primary-foreground/80 max-w-xl mx-auto"
          >
            Explore our curated categories of luxury timepieces and accessories
          </motion.p>
        </div>
      </section>

      {/* Category Cards */}
      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8">
          {visibleCategories.map((cat, i) => {
            const catProducts = getCategoryProducts(cat.slug);
            const priceRange = catProducts.length
              ? `$${Math.min(...catProducts.map((p) => p.price))} – $${Math.max(...catProducts.map((p) => p.price))}`
              : "";

            return (
              <motion.div
                key={cat.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group block relative h-[350px] md:h-[420px] rounded-lg overflow-hidden shadow-lg"
                >
                  <img
                    src={getCategoryCoverImage(cat.slug, cat.image)}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
                    <h3 className="font-heading text-2xl md:text-3xl font-bold mb-1">{cat.name}</h3>
                    <p className="text-sm text-white/70 mb-2">{catProducts.length} products {priceRange && `· ${priceRange}`}</p>
                    <span className="inline-flex items-center text-sm font-body tracking-wider text-gold-light group-hover:underline">
                      EXPLORE COLLECTION →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured from each category */}
      {visibleCategories.map((cat) => {
        const catProducts = getCategoryProducts(cat.slug).slice(0, 3);
        if (!catProducts.length) return null;
        return (
          <section key={cat.id} className="container pb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{cat.name}</h2>
              <Link to={`/shop?category=${cat.slug}`} className="text-sm font-body text-primary hover:underline tracking-wider">
                VIEW ALL →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {catProducts.map((product, index) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                    <img
                      src={getFeaturedProductImage(cat.slug, index, product.images[0])}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider px-3 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-sm text-muted-foreground font-body">${product.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <Footer />
    </div>
  );
};

export default CategoriesPage;

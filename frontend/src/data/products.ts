export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  description: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
}

export const categories: Category[] = [
  { id: "1", name: "Men Watches", slug: "men-watches", image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=400&fit=crop", count: 48 },
  { id: "2", name: "Women Watches", slug: "women-watches", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", count: 36 },
  { id: "3", name: "accessories for man", slug: "accessories", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop", count: 18 },
  { id: "4", name: "accessories for women", slug: "accessories-for-women", image: "https://images.unsplash.com/photo-1515562141589-67f0d569b3a3?w=400&h=400&fit=crop", count: 24 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Brown Leather",
    price: 299.00,
    category: "men-watches",
    brand: "ChronoLux",
    description: "A timeless piece that combines classic design with modern craftsmanship. Features a genuine leather strap, sapphire crystal glass, and Swiss-made automatic movement. Water resistant to 50 meters.",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=600&fit=crop",
    ],
    inStock: true,
    stockCount: 15,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Gold Luxury Watch",
    price: 599.00,
    category: "men-watches",
    brand: "ChronoLux",
    description: "Exquisite gold-plated timepiece with a refined mesh bracelet. Swiss quartz movement ensures precision. The perfect statement piece for the distinguished gentleman.",
    images: [
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=600&h=600&fit=crop",
    ],
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    isNew: true,
  },
  {
    id: "3",
    name: "Chronograph Black",
    price: 499.00,
    category: "men-watches",
    brand: "ChronoLux",
    description: "Bold chronograph with matte black finish. Features three subdials, tachymeter bezel, and scratch-resistant sapphire crystal. Built for those who demand performance and style.",
    images: [
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=600&h=600&fit=crop",
    ],
    inStock: true,
    stockCount: 12,
    isFeatured: true,
  },
  {
    id: "4",
    name: "Elegant Silver Gold",
    price: 399.00,
    category: "women-watches",
    brand: "ChronoLux",
    description: "A delicate blend of silver and gold tones creates this stunning timepiece. Mother of pearl dial with diamond hour markers. Swiss quartz movement.",
    images: [
      "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=600&fit=crop",
    ],
    inStock: true,
    stockCount: 20,
    isFeatured: true,
  },
  {
    id: "5",
    name: "Minimal Black Mesh",
    price: 349.00,
    category: "men-watches",
    brand: "ChronoLux",
    description: "Minimalist design meets modern elegance. Ultra-thin case with a sleek black mesh bracelet. Japanese quartz movement for reliable precision.",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop",
    ],
    inStock: true,
    stockCount: 25,
  },
  {
    id: "6",
    name: "Rose Gold Luxury",
    price: 549.00,
    category: "women-watches",
    brand: "ChronoLux",
    description: "Stunning rose gold finish with a sophisticated leather strap. Features a sunburst dial and date window. Perfect for any occasion.",
    images: [
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=600&fit=crop",
    ],
    inStock: true,
    stockCount: 6,
    isNew: true,
  },
  {
    id: "7",
    name: "Diamond Bezel Elite",
    price: 899.00,
    originalPrice: 1199.00,
    category: "women-watches",
    brand: "ChronoLux",
    description: "Luxurious diamond-set bezel with a mother of pearl dial. 18K gold-plated case with a genuine alligator leather strap.",
    images: [
      "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&h=600&fit=crop",
    ],
    inStock: true,
    stockCount: 3,
    isFeatured: true,
  },
  {
    id: "8",
    name: "Sport Titanium Pro",
    price: 699.00,
    category: "men-watches",
    brand: "ChronoLux",
    description: "Professional-grade titanium sports watch. 200m water resistance, rotating bezel, luminous hands. Built for adventure.",
    images: [
      "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=600&h=600&fit=crop",
    ],
    inStock: false,
    stockCount: 0,
  },
];

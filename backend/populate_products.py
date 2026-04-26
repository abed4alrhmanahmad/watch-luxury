"""
Populate database with 20 sample products per category
Safe insertion - does not modify or delete existing data
"""
import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chronolux.settings')
django.setup()

from store.models import Product, ProductImage, Category

# Product data templates by category
products_data = {
    1: {  # Men Watches
        "name_parts": [
            ("Elegant", "Chronograph"),
            ("Classic", "Automatic"),
            ("Modern", "Quartz"),
            ("Premium", "GMT"),
            ("Executive", "Diver"),
            ("Professional", "Navigator"),
            ("Minimalist", "Aviator"),
            ("Bold", "Pilot"),
            ("Sophisticated", "Explorer"),
            ("Timeless", "Gentleman"),
            ("Sport", "Professional"),
            ("Casual", "Dress"),
            ("Formal", "Sports"),
            ("Vintage", "Heritage"),
            ("Contemporary", "Anniversary"),
            ("Advanced", "Collection"),
            ("Steel", "Edition"),
            ("Leather", "Series"),
            ("Mesh", "Model"),
            ("Titanium", "Watch"),
        ],
        "brands": ["ChronoLux", "Luxora", "Tempus", "Horologium", "Elegance", "Precision", "Heritage", "Novum"],
        "base_prices": [299, 349, 399, 449, 499, 549, 599, 649, 699, 749],
        "images": [
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&h=600&fit=crop",
        ]
    },
    2: {  # Women Watches
        "name_parts": [
            ("Delicate", "Lady"),
            ("Elegant", "Romance"),
            ("Graceful", "Glamour"),
            ("Refined", "Radiance"),
            ("Luxurious", "Beauty"),
            ("Beautiful", "Elegance"),
            ("Stunning", "Crown"),
            ("Radiant", "Pearl"),
            ("Sparkling", "Diamond"),
            ("Charming", "Sapphire"),
            ("Diamond", "Emerald"),
            ("Rose", "Ruby"),
            ("Gold", "Collection"),
            ("Silver", "Edition"),
            ("Pearl", "Series"),
            ("Crystal", "Heritage"),
            ("Jeweled", "Vintage"),
            ("Feminine", "Classic"),
            ("Sophisticated", "Premium"),
            ("Timeless", "Model"),
        ],
        "brands": ["ChronoLux", "Luxora", "Elegance", "Sapphire", "Diamond", "Rose Gold", "Pearl", "Jewel"],
        "base_prices": [349, 399, 449, 499, 549, 599, 649, 699, 749, 799],
        "images": [
            "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1515562141589-67f0d569b3a3?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1585652215419-8d8fa6dd27aa?w=600&h=600&fit=crop",
        ]
    },
    3: {  # Jewelry
        "name_parts": [
            ("Exquisite", "Necklace"),
            ("Precious", "Bracelet"),
            ("Radiant", "Ring"),
            ("Sparkling", "Earrings"),
            ("Elegant", "Pendant"),
            ("Luxurious", "Choker"),
            ("Timeless", "Collar"),
            ("Classic", "Set"),
            ("Modern", "Collection"),
            ("Vintage", "Heritage"),
            ("Gold", "Edition"),
            ("Silver", "Series"),
            ("Diamond", "Premium"),
            ("Pearl", "Luxury"),
            ("Emerald", "Elegance"),
            ("Sapphire", "Beauty"),
            ("Ruby", "Radiance"),
            ("Crystal", "Glamour"),
            ("Jeweled", "Crown"),
            ("Heritage", "Jewel"),
        ],
        "brands": ["Luxora", "Diamond", "Sapphire", "Pearl", "Gold", "Crystal", "Heritage", "Royal"],
        "base_prices": [199, 249, 299, 349, 399, 449, 499, 549, 599, 649],
        "images": [
            "https://images.unsplash.com/photo-1515562141589-67f0d569b3a3?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1585652215419-8d8fa6dd27aa?w=600&h=600&fit=crop",
        ]
    },
    4: {  # Accessories
        "name_parts": [
            ("Premium", "Belt"),
            ("Classic", "Wallet"),
            ("Elegant", "Bag"),
            ("Modern", "Scarf"),
            ("Luxury", "Tie"),
            ("Stylish", "Pocket Square"),
            ("Designer", "Sunglasses"),
            ("Exclusive", "Hat"),
            ("Limited", "Gloves"),
            ("Special", "Collection"),
            ("Leather", "Set"),
            ("Metal", "Bundle"),
            ("Canvas", "Edition"),
            ("Silk", "Series"),
            ("Wool", "Premium"),
            ("Cotton", "Heritage"),
            ("Denim", "Vintage"),
            ("Suede", "Classic"),
            ("Velvet", "Designer"),
            ("Satin", "Exclusive"),
        ],
        "brands": ["ChronoLux", "Luxora", "Premium", "Style", "Elite", "Designer", "Exclusive", "Signature"],
        "base_prices": [79, 99, 129, 149, 179, 199, 229, 249, 279, 299],
        "images": [
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1509941943102-1c69386d5bb3?w=600&h=600&fit=crop",
        ]
    },
    5: {  # yamazbne
        "name_parts": [
            ("Premium", "Edition"),
            ("Exclusive", "Series"),
            ("Special", "Premium"),
            ("Limited", "Exclusive"),
            ("Signature", "Limited"),
            ("Luxury", "Signature"),
            ("Elite", "Collection"),
            ("Deluxe", "Heritage"),
            ("Premium", "Vintage"),
            ("Collection", "Classic"),
            ("Heritage", "Item"),
            ("Vintage", "Piece"),
            ("Classic", "Product"),
            ("Modern", "Special"),
            ("Contemporary", "Unique"),
            ("Design", "Rare"),
            ("Art", "Original"),
            ("Craft", "Authentic"),
            ("Master", "Quality"),
            ("Collection", "Design"),
        ],
        "brands": ["yamazbne", "Premium", "Luxury", "Elite", "Exclusive", "Design", "Craft", "Special"],
        "base_prices": [149, 199, 249, 299, 349, 399, 449, 499, 549, 599],
        "images": [
            "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
        ]
    }
}

descriptions = [
    "Premium quality product with exceptional craftsmanship and attention to detail.",
    "Elegant design meets modern functionality in this stunning piece.",
    "Perfect for those who appreciate luxury and sophistication.",
    "A timeless classic that never goes out of style.",
    "Crafted with precision and passion for perfection.",
    "An investment piece that will last for years to come.",
    "Combining tradition with contemporary style.",
    "A statement piece that showcases your refined taste.",
    "Meticulously designed for the discerning customer.",
    "Exceptional quality at an unbeatable value.",
]

def populate_products():
    product_count = 0

    for category_id, data in products_data.items():
        category = Category.objects.get(id=category_id)
        print(f"\nProcessing category: {category.name}")

        for i in range(20):
            # Generate product name
            prefix, suffix = random.choice(data["name_parts"])
            product_name = f"{prefix} {suffix}"

            # Generate product details
            brand = random.choice(data["brands"])
            description = random.choice(descriptions)
            price = random.choice(data["base_prices"]) + random.randint(-20, 100)
            stock_count = random.randint(5, 50)
            is_featured = random.choice([True, False, False, False])
            is_new = random.choice([True, False, False, False])

            # Create product
            product = Product.objects.create(
                name=product_name,
                category_id=category_id,
                brand=brand,
                description=description,
                price=price,
                original_price=None,
                stock_count=stock_count,
                is_active=True,
                is_featured=is_featured,
                is_new=is_new,
            )

            # Add 2 product images
            images_to_add = random.sample(data["images"], k=min(2, len(data["images"])))
            for idx, img_url in enumerate(images_to_add):
                ProductImage.objects.create(
                    product=product,
                    image_url=img_url,
                    is_primary=(idx == 0),
                    order=idx
                )

            product_count += 1
            if (i + 1) % 5 == 0:
                print(f"   Created {i + 1}/20 products")

        print(f"   Completed {category.name}")

    return product_count

if __name__ == '__main__':
    print("\n" + "=" * 70)
    print("   DATABASE POPULATION - Adding Sample Products")
    print("=" * 70)

    try:
        count = populate_products()
        print("\n" + "=" * 70)
        print(f"   SUCCESS: Added {count} new products!")
        print(f"   All products have product images")
        print(f"   No existing data was modified or deleted")
        print(f"   Database integrity maintained")
        print("=" * 70 + "\n")
    except Exception as e:
        print(f"\n   ERROR: {e}")
        import traceback
        traceback.print_exc()

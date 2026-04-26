from rest_framework import serializers
from .models import Category, Product, ProductImage, Review


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image_url', 'description', 'product_count']


class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='get_url', read_only=True)

    class Meta:
        model = ProductImage
        fields = ['id', 'url', 'is_primary', 'order']


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'price', 'original_price',
            'category_name', 'category_slug', 'in_stock', 'stock_count',
            'is_featured', 'is_new', 'images', 'created_at',
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'description', 'price', 'original_price',
            'category', 'in_stock', 'stock_count',
            'is_featured', 'is_new', 'images', 'created_at',
        ]


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField(read_only=True)

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.email.split('@')[0]

    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user_name', 'created_at']

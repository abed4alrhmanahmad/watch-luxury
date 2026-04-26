from django.contrib import admin
from .models import Category, Product, ProductImage, Review


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image_url', 'image', 'is_primary', 'order']


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ['user', 'created_at']
    fields = ['user', 'rating', 'comment', 'created_at']
    can_delete = True


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'product_count']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'category', 'price', 'stock_count', 'is_active', 'is_featured', 'is_new']
    list_filter = ['category', 'brand', 'is_active', 'is_featured', 'is_new']
    search_fields = ['name', 'brand', 'description']
    list_editable = ['price', 'stock_count', 'is_active', 'is_featured', 'is_new']
    inlines = [ProductImageInline, ReviewInline]
    ordering = ['-created_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at', 'product']
    search_fields = ['product__name', 'user__email', 'comment']
    readonly_fields = ['user', 'product', 'created_at']
    ordering = ['-created_at']

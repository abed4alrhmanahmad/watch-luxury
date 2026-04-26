from django.contrib import admin
from .models import WishlistItem


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'created_at']
    list_filter = ['created_at', 'product__category']
    search_fields = ['product__name', 'user__email']
    readonly_fields = ['user', 'product', 'created_at']
    ordering = ['-created_at']

from django.contrib import admin
from .models import Coupon


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percentage', 'is_active', 'expiry_date', 'created_at')
    list_filter = ('is_active', 'created_at', 'expiry_date')
    list_editable = ('is_active',)
    search_fields = ('code',)
    date_hierarchy = 'created_at'

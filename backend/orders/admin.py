from django.contrib import admin
from .models import Order, OrderItem, Address


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']

    def subtotal(self, obj):
        if obj.unit_price and obj.quantity:
            return obj.unit_price * obj.quantity
        return '-'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'total', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_number', 'user__email', 'shipping_full_name']
    readonly_fields = ['subtotal', 'shipping_cost', 'tax', 'total', 'order_number']
    inlines = [OrderItemInline]
    ordering = ['-created_at']


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'user', 'city', 'country', 'is_default']
    search_fields = ['full_name', 'user__email']

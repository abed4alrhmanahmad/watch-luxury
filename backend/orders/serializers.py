from rest_framework import serializers
from .models import Order, OrderItem, Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'full_name', 'phone', 'address_line', 'city', 'state', 'zip_code', 'country', 'is_default']


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'unit_price', 'quantity', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display',
            'shipping_full_name', 'shipping_email', 'shipping_phone',
            'shipping_address', 'shipping_city', 'shipping_state',
            'shipping_zip', 'shipping_country',
            'subtotal', 'shipping_cost', 'tax', 'total',
            'items', 'created_at',
        ]


class CreateOrderSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    zip_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100, default='United States')
    items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        help_text='[{"product_id": 1, "quantity": 2}, ...]'
    )

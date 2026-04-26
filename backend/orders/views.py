import random
import string
from decimal import Decimal

from django.db import transaction
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from store.models import Product
from cart.models import Cart
from .models import Order, OrderItem, Address
from .serializers import OrderSerializer, CreateOrderSerializer, AddressSerializer
from coupons.serializers import validate_coupon


def _generate_order_number():
    return '#' + ''.join(random.choices(string.digits, k=6))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    serializer = CreateOrderSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    items_data = data.get('items', [])

    if not items_data:
        return Response({'error': 'Order must contain at least one item.'}, status=status.HTTP_400_BAD_REQUEST)

    # Resolve and validate products + stock in one query pass
    product_ids = [int(i['product_id']) for i in items_data]
    products_map = {p.id: p for p in Product.objects.filter(id__in=product_ids, is_active=True)}

    for item in items_data:
        pid = int(item['product_id'])
        qty = int(item['quantity'])
        product = products_map.get(pid)
        if not product:
            return Response({'error': f'Product ID {pid} not found.'}, status=status.HTTP_400_BAD_REQUEST)
        if product.stock_count < qty:
            return Response(
                {'error': f'Insufficient stock for "{product.name}". Available: {product.stock_count}.'},
                status=status.HTTP_400_BAD_REQUEST
            )

    with transaction.atomic():
        subtotal = Decimal('0.00')
        for item in items_data:
            p = products_map[int(item['product_id'])]
            subtotal += p.price * int(item['quantity'])

        shipping_cost = Decimal('0.00') if subtotal > Decimal('100.00') else Decimal('15.00')
        tax = (subtotal * Decimal('0.10')).quantize(Decimal('0.01'))
        total = subtotal + shipping_cost + tax

        order = Order.objects.create(
            user=request.user,
            order_number=_generate_order_number(),
            shipping_full_name=data['full_name'],
            shipping_email=data['email'],
            shipping_phone=data['phone'],
            shipping_address=data['address'],
            shipping_city=data['city'],
            shipping_state=data['state'],
            shipping_zip=data['zip_code'],
            shipping_country=data.get('country', 'United States'),
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            total=total,
        )

        for item in items_data:
            product = products_map[int(item['product_id'])]
            qty = int(item['quantity'])

            # Get primary image URL
            primary = product.images.filter(is_primary=True).first() or product.images.first()
            image_url = primary.get_url() if primary else ''

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_image=image_url,
                unit_price=product.price,
                quantity=qty,
            )

            # Deduct stock
            product.stock_count -= qty
            product.save(update_fields=['stock_count'])

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):
    """Mock payment checkout. Marks order as 'paid', clears cart, and returns success."""
    serializer = CreateOrderSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    items_data = data.get('items', [])

    if not items_data:
        return Response({'error': 'Order must contain at least one item.'}, status=status.HTTP_400_BAD_REQUEST)

    # Resolve and validate products + stock
    product_ids = [int(i['product_id']) for i in items_data]
    products_map = {p.id: p for p in Product.objects.filter(id__in=product_ids, is_active=True)}

    for item in items_data:
        pid = int(item['product_id'])
        qty = int(item['quantity'])
        product = products_map.get(pid)
        if not product:
            return Response({'error': f'Product ID {pid} not found.'}, status=status.HTTP_400_BAD_REQUEST)
        if product.stock_count < qty:
            return Response(
                {'error': f'Insufficient stock for "{product.name}". Available: {product.stock_count}.'},
                status=status.HTTP_400_BAD_REQUEST
            )

    with transaction.atomic():
        # Calculate pricing
        subtotal = Decimal('0.00')
        for item in items_data:
            p = products_map[int(item['product_id'])]
            subtotal += p.price * int(item['quantity'])

        shipping_cost = Decimal('0.00') if subtotal > Decimal('100.00') else Decimal('15.00')
        tax = (subtotal * Decimal('0.10')).quantize(Decimal('0.01'))
        discount_amount = Decimal('0.00')
        coupon_code = data.get('coupon_code', '').strip()

        # Apply coupon if provided
        if coupon_code:
            try:
                discount_info = validate_coupon(coupon_code, subtotal)
                discount_amount = discount_info['discount_amount']
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        total = subtotal + shipping_cost + tax - discount_amount

        # Create order with status='paid'
        order = Order.objects.create(
            user=request.user,
            order_number=_generate_order_number(),
            status='paid',
            shipping_full_name=data['full_name'],
            shipping_email=data['email'],
            shipping_phone=data['phone'],
            shipping_address=data['address'],
            shipping_city=data['city'],
            shipping_state=data['state'],
            shipping_zip=data['zip_code'],
            shipping_country=data.get('country', 'United States'),
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            discount_amount=discount_amount,
            coupon_code=coupon_code,
            total=total,
        )

        # Create order items
        for item in items_data:
            product = products_map[int(item['product_id'])]
            qty = int(item['quantity'])

            primary = product.images.filter(is_primary=True).first() or product.images.first()
            image_url = primary.get_url() if primary else ''

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_image=image_url,
                unit_price=product.price,
                quantity=qty,
            )

            # Deduct stock
            product.stock_count -= qty
            product.save(update_fields=['stock_count'])

        # Clear server-side cart
        try:
            cart = Cart.objects.get(user=request.user)
            cart.items.all().delete()
        except Cart.DoesNotExist:
            pass

    return Response({
        'status': 'success',
        'order_id': order.id,
        'order_number': order.order_number,
        'message': 'Payment completed successfully.',
        'order': OrderSerializer(order).data,
    }, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related('items')
        )


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


# ── Address CRUD ───────────────────────────────────────────────────────
class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by('-is_default', '-created_at')

    def perform_create(self, serializer):
        address = serializer.save(user=self.request.user)
        # Enforce single default
        if address.is_default:
            Address.objects.filter(user=self.request.user).exclude(pk=address.pk).update(is_default=False)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        address = serializer.save()
        if address.is_default:
            Address.objects.filter(user=self.request.user).exclude(pk=address.pk).update(is_default=False)

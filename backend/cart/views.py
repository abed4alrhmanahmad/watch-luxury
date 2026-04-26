from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from store.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer


def _get_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart = _get_cart(request.user)
    return Response(CartSerializer(cart).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    try:
        product = Product.objects.get(pk=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

    if quantity < 1:
        return Response({'error': 'Quantity must be at least 1.'}, status=status.HTTP_400_BAD_REQUEST)

    cart = _get_cart(request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        quantity = item.quantity + quantity

    if quantity > product.stock_count:
        return Response(
            {'error': f'Only {product.stock_count} unit(s) available.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    item.quantity = quantity
    item.save()
    return Response(CartSerializer(cart).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    cart = _get_cart(request.user)
    quantity = int(request.data.get('quantity', 1))

    try:
        item = CartItem.objects.get(pk=item_id, cart=cart)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)

    if quantity <= 0:
        item.delete()
    else:
        if quantity > item.product.stock_count:
            return Response(
                {'error': f'Only {item.product.stock_count} unit(s) available.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        item.quantity = quantity
        item.save()

    return Response(CartSerializer(cart).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    cart = _get_cart(request.user)
    CartItem.objects.filter(pk=item_id, cart=cart).delete()
    return Response(CartSerializer(cart).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    cart = _get_cart(request.user)
    cart.items.all().delete()
    return Response(CartSerializer(cart).data)

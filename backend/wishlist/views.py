from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from store.models import Product
from .models import WishlistItem
from .serializers import WishlistItemSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    items = WishlistItem.objects.filter(user=request.user).select_related('product')
    serializer = WishlistItemSerializer(items, many=True)
    return Response({
        'items': serializer.data,
        'count': items.count()
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_wishlist(request, product_id):
    try:
        product = Product.objects.get(pk=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

    item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)

    if not created:
        item.delete()
        wishlisted = False
    else:
        wishlisted = True

    count = WishlistItem.objects.filter(user=request.user).count()
    return Response({
        'wishlisted': wishlisted,
        'item_count': count
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_wishlist(request):
    WishlistItem.objects.filter(user=request.user).delete()
    return Response({'success': True})

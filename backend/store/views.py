from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg, Count
from .models import Category, Product, Review
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer, ReviewSerializer
from .filters import ProductFilter


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None


class ProductListView(generics.ListAPIView):
    queryset = (
        Product.objects
        .filter(is_active=True)
        .select_related('category')
        .prefetch_related('images')
    )
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'brand']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']


class ProductDetailView(generics.RetrieveAPIView):
    queryset = (
        Product.objects
        .filter(is_active=True)
        .select_related('category')
        .prefetch_related('images')
    )
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]


class ProductReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        product_pk = self.kwargs.get('product_pk')
        return Review.objects.filter(product_id=product_pk)

    def perform_create(self, serializer):
        product_pk = self.kwargs.get('product_pk')
        product = Product.objects.get(pk=product_pk)
        review, created = Review.objects.update_or_create(
            user=self.request.user,
            product=product,
            defaults={
                'rating': serializer.validated_data['rating'],
                'comment': serializer.validated_data.get('comment', '')
            }
        )
        self.created = created

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]


class ProductRatingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, product_pk):
        try:
            product = Product.objects.get(pk=product_pk)
            stats = product.reviews.aggregate(
                average_rating=Avg('rating'),
                total_reviews=Count('id')
            )
            return Response({
                'average_rating': round(stats['average_rating'], 1) if stats['average_rating'] else 0,
                'total_reviews': stats['total_reviews'] or 0
            })
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

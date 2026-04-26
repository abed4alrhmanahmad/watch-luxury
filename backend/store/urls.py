from django.urls import path
from .views import (
    CategoryListView, ProductListView, ProductDetailView,
    ProductReviewListCreateView, ProductRatingView
)

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('<int:product_pk>/reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
    path('<int:product_pk>/rating/', ProductRatingView.as_view(), name='product-rating'),
]

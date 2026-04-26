from django.urls import path
from .views import (
    dashboard_stats,
    AdminCategoryListCreateView, AdminCategoryDetailView,
    AdminProductListCreateView, AdminProductDetailView,
    AdminOrderListView, AdminOrderDetailView,
    AdminMessageListView, AdminMessageDetailView,
    AdminUserListView, AdminUserDetailView,
)

urlpatterns = [
    path('stats/',                    dashboard_stats,                    name='admin-stats'),
    path('categories/',               AdminCategoryListCreateView.as_view(), name='admin-categories'),
    path('categories/<int:pk>/',      AdminCategoryDetailView.as_view(),    name='admin-category-detail'),
    path('products/',                 AdminProductListCreateView.as_view(),  name='admin-products'),
    path('products/<int:pk>/',        AdminProductDetailView.as_view(),      name='admin-product-detail'),
    path('orders/',                   AdminOrderListView.as_view(),          name='admin-orders'),
    path('orders/<int:pk>/',          AdminOrderDetailView.as_view(),        name='admin-order-detail'),
    path('messages/',                 AdminMessageListView.as_view(),        name='admin-messages'),
    path('messages/<int:pk>/',        AdminMessageDetailView.as_view(),      name='admin-message-detail'),
    path('users/',                    AdminUserListView.as_view(),           name='admin-users'),
    path('users/<int:pk>/',           AdminUserDetailView.as_view(),         name='admin-user-detail'),
]

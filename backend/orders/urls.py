from django.urls import path
from .views import (
    create_order, checkout, OrderListView, OrderDetailView,
    AddressListCreateView, AddressDetailView,
)

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('create/', create_order, name='order-create'),
    path('checkout/', checkout, name='checkout'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('addresses/', AddressListCreateView.as_view(), name='address-list'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
]

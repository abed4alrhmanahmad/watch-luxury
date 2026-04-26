from django.urls import path
from .views import get_cart, add_to_cart, update_cart_item, remove_from_cart, clear_cart

urlpatterns = [
    path('', get_cart, name='cart-get'),
    path('add/', add_to_cart, name='cart-add'),
    path('items/<int:item_id>/', update_cart_item, name='cart-update-item'),
    path('items/<int:item_id>/remove/', remove_from_cart, name='cart-remove-item'),
    path('clear/', clear_cart, name='cart-clear'),
]

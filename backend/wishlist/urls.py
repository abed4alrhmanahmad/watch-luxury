from django.urls import path
from .views import get_wishlist, toggle_wishlist, clear_wishlist

urlpatterns = [
    path('', get_wishlist, name='wishlist-get'),
    path('toggle/<int:product_id>/', toggle_wishlist, name='wishlist-toggle'),
    path('clear/', clear_wishlist, name='wishlist-clear'),
]

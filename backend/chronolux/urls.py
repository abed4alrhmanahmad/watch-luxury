from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/products/', include('store.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/wishlist/', include('wishlist.urls')),
    path('api/coupons/', include('coupons.urls')),
    path('api/admin/', include('admin_api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

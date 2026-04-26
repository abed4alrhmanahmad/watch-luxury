from django.db import models
from django.conf import settings
from store.models import Product


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cart_cart'

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.select_related('product').all())

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    def __str__(self):
        return f'Cart — {self.user.email}'


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('cart', 'product')
        db_table = 'cart_item'

    @property
    def subtotal(self):
        return self.product.price * self.quantity

    def __str__(self):
        return f'{self.quantity}× {self.product.name}'

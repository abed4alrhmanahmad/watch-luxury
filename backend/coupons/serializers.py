from rest_framework import serializers
from decimal import Decimal
from datetime import date
from .models import Coupon


class ApplyCouponSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50, required=True)
    cart_total = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)

    def validate_code(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Coupon code is required.')
        return value.upper()

    def validate_cart_total(self, value):
        if value < 0:
            raise serializers.ValidationError('Cart total cannot be negative.')
        return value


def validate_coupon(code, cart_total):
    """Validate coupon and return discount info or raise ValidationError."""
    try:
        coupon = Coupon.objects.get(code=code.upper())
    except Coupon.DoesNotExist:
        raise serializers.ValidationError(f'Coupon code "{code}" not found.')

    if not coupon.is_active:
        raise serializers.ValidationError('This coupon is no longer active.')

    if coupon.expiry_date < date.today():
        raise serializers.ValidationError(
            f'This coupon expired on {coupon.expiry_date.strftime("%B %d, %Y")}.'
        )

    discount_amount = (cart_total * Decimal(coupon.discount_percentage) / Decimal('100')).quantize(Decimal('0.01'))
    final_price = cart_total - discount_amount

    return {
        'discount_percentage': coupon.discount_percentage,
        'discount_amount': float(discount_amount),
        'final_price': float(final_price),
    }

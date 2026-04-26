from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount_percentage = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    is_active = models.BooleanField(default=True)
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'coupons_coupon'

    def __str__(self):
        return f'{self.code} — {self.discount_percentage}% off'

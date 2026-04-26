import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug', lookup_expr='exact')
    brand = django_filters.CharFilter(lookup_expr='iexact')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    is_featured = django_filters.BooleanFilter()
    is_new = django_filters.BooleanFilter()

    class Meta:
        model = Product
        fields = ['category', 'brand', 'min_price', 'max_price', 'is_featured', 'is_new']

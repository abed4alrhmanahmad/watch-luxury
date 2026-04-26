from decimal import Decimal
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from accounts.models import User
from store.models import Category, Product
from orders.models import Order, OrderItem
from contact.models import ContactMessage

from .permissions import IsStaffUser
from .serializers import (
    AdminCategorySerializer, AdminProductSerializer,
    AdminOrderSerializer, AdminContactMessageSerializer, AdminUserSerializer,
)


# ── Dashboard Stats ────────────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsStaffUser])
def dashboard_stats(request):
    now = timezone.now()
    thirty_days_ago = now - timedelta(days=30)

    total_revenue = Order.objects.aggregate(rev=Sum('total'))['rev'] or Decimal('0')
    monthly_revenue = (
        Order.objects.filter(created_at__gte=thirty_days_ago)
        .aggregate(rev=Sum('total'))['rev'] or Decimal('0')
    )

    orders_by_status = dict(
        Order.objects.values('status').annotate(c=Count('id')).values_list('status', 'c')
    )

    low_stock = Product.objects.filter(is_active=True, stock_count__lte=5).count()

    top_products_qs = (
        OrderItem.objects
        .values('product_name')
        .annotate(total_qty=Sum('quantity'))
        .order_by('-total_qty')[:5]
    )
    top_selling_products = [
        {'name': row['product_name'], 'quantity': row['total_qty']}
        for row in top_products_qs
    ]

    recent_orders = Order.objects.select_related('user').prefetch_related('items')[:5]

    return Response({
        'total_revenue': float(total_revenue),
        'monthly_revenue': float(monthly_revenue),
        'total_orders': Order.objects.count(),
        'monthly_orders': Order.objects.filter(created_at__gte=thirty_days_ago).count(),
        'total_products': Product.objects.filter(is_active=True).count(),
        'total_users': User.objects.filter(is_staff=False).count(),
        'low_stock_count': low_stock,
        'orders_by_status': orders_by_status,
        'top_selling_products': top_selling_products,
        'recent_orders': AdminOrderSerializer(recent_orders, many=True).data,
    })


# ── Categories ─────────────────────────────────────────────────────────
class AdminCategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = AdminCategorySerializer
    permission_classes = [IsStaffUser]
    pagination_class = None


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = AdminCategorySerializer
    permission_classes = [IsStaffUser]


# ── Products ───────────────────────────────────────────────────────────
class AdminProductListCreateView(generics.ListCreateAPIView):
    queryset = (
        Product.objects
        .select_related('category')
        .prefetch_related('images')
        .order_by('-created_at')
    )
    serializer_class = AdminProductSerializer
    permission_classes = [IsStaffUser]
    search_fields = ['name', 'brand']
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search', '')
        category = self.request.query_params.get('category', '')
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(brand__icontains=search))
        if category:
            qs = qs.filter(category__slug=category)
        return qs


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related('category').prefetch_related('images')
    serializer_class = AdminProductSerializer
    permission_classes = [IsStaffUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


# ── Orders ─────────────────────────────────────────────────────────────
class AdminOrderListView(generics.ListAPIView):
    queryset = (
        Order.objects
        .select_related('user')
        .prefetch_related('items')
        .order_by('-created_at')
    )
    serializer_class = AdminOrderSerializer
    permission_classes = [IsStaffUser]

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get('status', '')
        search = self.request.query_params.get('search', '')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if search:
            qs = qs.filter(
                Q(order_number__icontains=search) |
                Q(shipping_full_name__icontains=search) |
                Q(shipping_email__icontains=search)
            )
        return qs


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.select_related('user').prefetch_related('items')
    serializer_class = AdminOrderSerializer
    permission_classes = [IsStaffUser]

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        new_status = request.data.get('status')
        valid = [s[0] for s in Order.STATUS_CHOICES]
        if new_status not in valid:
            return Response({'error': f'Invalid status. Choose from: {valid}'}, status=400)
        order.status = new_status
        order.save(update_fields=['status'])
        return Response(AdminOrderSerializer(order).data)


# ── Contact Messages ───────────────────────────────────────────────────
class AdminMessageListView(generics.ListAPIView):
    queryset = ContactMessage.objects.order_by('-created_at')
    serializer_class = AdminContactMessageSerializer
    permission_classes = [IsStaffUser]
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        read_filter = self.request.query_params.get('is_read', '')
        if read_filter in ('true', 'false'):
            qs = qs.filter(is_read=(read_filter == 'true'))
        return qs


class AdminMessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = AdminContactMessageSerializer
    permission_classes = [IsStaffUser]

    def partial_update(self, request, *args, **kwargs):
        msg = self.get_object()
        msg.is_read = request.data.get('is_read', True)
        msg.save(update_fields=['is_read'])
        return Response(AdminContactMessageSerializer(msg).data)


# ── Users ──────────────────────────────────────────────────────────────
class AdminUserListView(generics.ListCreateAPIView):
    queryset = User.objects.order_by('-created_at')
    serializer_class = AdminUserSerializer
    permission_classes = [IsStaffUser]
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search', '')
        if search:
            qs = qs.filter(Q(email__icontains=search) | Q(first_name__icontains=search))
        return qs


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.order_by('-created_at')
    serializer_class = AdminUserSerializer
    permission_classes = [IsStaffUser]

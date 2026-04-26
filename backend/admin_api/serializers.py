from rest_framework import serializers
from store.models import Category, Product, ProductImage
from orders.models import Order, OrderItem
from contact.models import ContactMessage
from accounts.models import User


# ── Category ──────────────────────────────────────────────────────────
class AdminCategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image_url', 'description', 'product_count']


# ── Product Images ─────────────────────────────────────────────────────
class AdminProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'is_primary', 'order']


# ── Product ────────────────────────────────────────────────────────────
class AdminProductSerializer(serializers.ModelSerializer):
    images = AdminProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    # Write-only: list of image URL strings e.g. ["url1", "url2"]
    image_urls = serializers.ListField(
        child=serializers.URLField(), write_only=True, required=False
    )
    # Write-only: uploaded image files
    image_files = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'description', 'price', 'original_price',
            'category', 'category_name', 'stock_count', 'is_active',
            'is_featured', 'is_new', 'images', 'image_urls', 'image_files', 'created_at',
        ]

    def create(self, validated_data):
        image_urls = validated_data.pop('image_urls', [])
        image_files = validated_data.pop('image_files', [])
        product = Product.objects.create(**validated_data)

        order = 0
        for i, url in enumerate(image_urls):
            ProductImage.objects.create(
                product=product, image_url=url,
                is_primary=(i == 0), order=i
            )
            order = i + 1

        for i, img in enumerate(image_files):
            ProductImage.objects.create(
                product=product,
                image=img,
                is_primary=(order + i == 0),
                order=order + i,
            )
        return product

    def update(self, instance, validated_data):
        image_urls = validated_data.pop('image_urls', None)
        image_files = validated_data.pop('image_files', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if image_urls is not None or image_files is not None:
            instance.images.all().delete()

            image_urls = image_urls or []
            image_files = image_files or []

            order = 0
            for i, url in enumerate(image_urls):
                ProductImage.objects.create(
                    product=instance, image_url=url,
                    is_primary=(i == 0), order=i
                )
                order = i + 1

            for i, img in enumerate(image_files):
                ProductImage.objects.create(
                    product=instance,
                    image=img,
                    is_primary=(order + i == 0),
                    order=order + i,
                )
        return instance


# ── Order ──────────────────────────────────────────────────────────────
class AdminOrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_image', 'unit_price', 'quantity', 'subtotal']


class AdminOrderSerializer(serializers.ModelSerializer):
    items = AdminOrderItemSerializer(many=True, read_only=True)
    customer_email = serializers.EmailField(source='user.email', read_only=True)
    customer_name = serializers.CharField(source='user.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display',
            'customer_email', 'customer_name',
            'shipping_full_name', 'shipping_email', 'shipping_phone',
            'shipping_address', 'shipping_city', 'shipping_state',
            'shipping_zip', 'shipping_country',
            'subtotal', 'shipping_cost', 'tax', 'total',
            'items', 'created_at',
        ]


# ── Contact Message ────────────────────────────────────────────────────
class AdminContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'is_read', 'created_at']


# ── User ───────────────────────────────────────────────────────────────
class AdminUserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    order_count = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'first_name', 'last_name',
                  'phone', 'is_active', 'is_staff', 'is_superuser', 'role',
                  'password', 'order_count', 'created_at']
        read_only_fields = ['id', 'created_at', 'order_count', 'full_name', 'role']

    def get_role(self, obj):
        if obj.is_superuser:
            return 'admin'
        if obj.is_staff:
            return 'staff'
        return 'customer'

    def get_order_count(self, obj):
        return obj.orders.count()

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

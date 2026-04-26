from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import ApplyCouponSerializer, validate_coupon


@api_view(['POST'])
@permission_classes([AllowAny])
def apply_coupon(request):
    serializer = ApplyCouponSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        discount_info = validate_coupon(
            serializer.validated_data['code'],
            serializer.validated_data['cart_total']
        )
        return Response(discount_info, status=status.HTTP_200_OK)
    except Exception as e:
        # Extract error message from ValidationError
        error_msg = str(e)
        if hasattr(e, 'detail') and isinstance(e.detail, list) and len(e.detail) > 0:
            error_msg = str(e.detail[0])
        return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)

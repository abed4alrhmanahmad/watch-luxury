from rest_framework.permissions import BasePermission


class IsStaffUser(BasePermission):
    """Only staff / superuser accounts can access admin endpoints."""
    message = 'Admin access required.'

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

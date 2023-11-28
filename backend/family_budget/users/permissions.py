from rest_framework import permissions

from budget.models import Family
from users.models import User


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False
        if request.user.role == 'admin':
            return True
        if request.user.is_staff or request.user.is_superuser:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        if request.user.is_staff or request.user.is_superuser:
            return True
        return False


class IsUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False
        if request.user.role == 'user':
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method == 'PATCH' or request.method == 'DELETE':
            if request.user == obj.author:
                return True
            return False
        return True


class IsAuth(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False
        return True

    def has_object_permission(self, request, view, obj):
        return True


class ReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return False


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class NonAuth(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_anonymous:
            return False


class IsFamilymember(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False
        if request.user.role == 'user':
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            if request.user in obj.members.all():
                return True
            return False
        if request.method == 'PATCH' or request.method == 'DELETE':
            if request.user in obj.members.all():
                return True
            return False
        return True


class IsAdminOrFamilyMember(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False

        if view.queryset.model == Family:
            if request.user.is_admin or request.user.is_superuser:
                view.queryset = Family.objects.all()
            else:
                view.queryset = Family.objects.filter(members=request.user)
        elif view.queryset.model == User:
            if request.user.is_admin or request.user.is_superuser:
                view.queryset = User.objects.all()
            else:
                families = Family.objects.filter(members=request.user)
                if families:
                    view.queryset = User.objects.filter(
                        families__in=families).distinct()
                else:
                    view.queryset = User.objects.filter(id=request.user.id)

        return True

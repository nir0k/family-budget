from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets

from budget.models import Family
from users.models import User

from .models import Account, Account_Type
from .serializers import (Account_TypeSerializer, AccountSerializer,
                          FamilyFinStateSerializer)


class Account_TypeViewSet(viewsets.ModelViewSet):
    queryset = Account_Type.objects.all()
    serializer_class = Account_TypeSerializer
    pagination_class = None


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    pagination_class = None
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['owner',]

    def get_queryset(self):
        queryset = super().get_queryset()
        user_families = Family.objects.filter(members=self.request.user)
        family_members = User.objects.filter(families__in=user_families
                                             ).distinct()

        queryset = queryset.filter(
            Q(owner__in=family_members) | Q(owner=self.request.user)
        )
        return queryset


class FamilyFinStateViewSet(viewsets.ModelViewSet):
    queryset = Family.objects.all()
    serializer_class = FamilyFinStateSerializer
    pagination_class = None

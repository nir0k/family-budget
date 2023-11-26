from django.db.models import Q
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

    def get_queryset(self):
        user_families = Family.objects.filter(members=self.request.user)
        family_members = User.objects.filter(
            families__in=user_families).distinct()
        return Account.objects.filter(
            Q(owner__in=family_members) | Q(owner=self.request.user)
        )


class FamilyFinStateViewSet(viewsets.ModelViewSet):
    queryset = Family.objects.all()
    serializer_class = FamilyFinStateSerializer
    pagination_class = None

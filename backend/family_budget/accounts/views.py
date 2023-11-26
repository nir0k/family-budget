from rest_framework import viewsets

from budget.models import Family

from .models import Account, Account_Type
from users.models import User
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
        families = Family.objects.filter(members=self.request.user)
        family_members = User.objects.filter(families__in=families).distinct()
        return Account.objects.filter(owner__in=family_members)


class FamilyFinStateViewSet(viewsets.ModelViewSet):
    queryset = Family.objects.all()
    serializer_class = FamilyFinStateSerializer
    pagination_class = None

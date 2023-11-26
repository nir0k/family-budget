from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from users.models import User
from users.permissions import IsAdminOrFamilyMember, IsUser

from .models import Budget, ExpenseItem, Family, IncomeItem
from .serializers import (BudgetSerializer, ExpenseItemSerializer,
                          FamilySerializer, IncomeItemSerializer)


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsUser]

    def perform_create(self, serializer):
        family = Family.objects.get(members=self.request.user)
        serializer.save(family=family)

    def get_queryset(self):
        family = Family.objects.get(members=self.request.user)
        return Budget.objects.filter(family=family)


class ExpenseItemViewSet(viewsets.ModelViewSet):
    queryset = ExpenseItem.objects.all()
    serializer_class = ExpenseItemSerializer
    permission_classes = [IsUser]


class IncomeItemViewSet(viewsets.ModelViewSet):
    queryset = IncomeItem.objects.all()
    serializer_class = IncomeItemSerializer
    permission_classes = [IsUser]


class FamilyViewSet(viewsets.ModelViewSet):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer
    permission_classes = [IsAdminOrFamilyMember]
    pagination_class = None

    def remove_member(self, request, family_id, member_id):
        try:
            family = Family.objects.get(pk=family_id)
            family.members.remove(member_id)
            return Response({'detail': 'Member removed successfully.'},
                            status=status.HTTP_200_OK)
        except Family.DoesNotExist:
            return Response({'detail': 'Family not found.'},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='add-member')
    def add_member(self, request, pk=None):
        family = self.get_object()
        email = request.data.get('email')

        if not email:
            return Response({'detail': 'Email is required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            family.members.add(user)
            return Response({'detail': 'Member added successfully.'})
        except User.DoesNotExist:
            return Response({'detail': 'User with this email does not exist.'},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

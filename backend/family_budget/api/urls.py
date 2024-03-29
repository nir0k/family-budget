from django.urls import include, path
from rest_framework import routers

from accounts.views import (Account_TypeViewSet, AccountViewSet,
                            FamilyFinStateViewSet)
from budget.views import (BudgetViewSet, ExpenseItemViewSet, FamilyViewSet,
                          IncomeItemViewSet)
from currency.views import CurrencyViewSet, ExchangeRateViewSet
from transactions.views import (CategoryViewSet, Transaction_TypeViewSet,
                                TransactionViewSet)
from users.views import (ProfileView, TelegramAuthView, UserViewSet,
                         change_password)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'transaction', TransactionViewSet)
router.register(r'transaction-type', Transaction_TypeViewSet)
router.register(r'budget', BudgetViewSet)
router.register(r'incomeitem', IncomeItemViewSet)
router.register(r'expenseitem', ExpenseItemViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'account', AccountViewSet)
router.register(r'account-type', Account_TypeViewSet)
router.register(r'family', FamilyViewSet)
router.register(r'family-state', FamilyFinStateViewSet)
router.register(r'currency', CurrencyViewSet)
router.register(r'exchange-rate', ExchangeRateViewSet)

urlpatterns = [
    path('v1/auth/telegram/',
         TelegramAuthView.as_view(),
         name='telegram_auth'),
    path('v1/auth/', include('djoser.urls.authtoken')),
    path('users/set_password', change_password, name='set_password'),
    path('v1/users/me/', ProfileView.as_view(), name='profile'),
    path('v1/family/<int:family_id>/members/<int:member_id>/',
         FamilyViewSet.as_view({'delete': 'remove_member'}),
         name='remove-family-member'),
    path('v1/', include(router.urls)),
]

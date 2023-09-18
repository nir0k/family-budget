from rest_framework import routers

from django.urls import include, path

from users.views import UserViewSet
from transactions.views import (
    TransactionViewSet,
    Transaction_TypeViewSet,
    CategoryViewSet
)
from accounts.views import Account_TypeViewSet, AccountViewSet


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'transaction', TransactionViewSet)
router.register(r'transaction-type', Transaction_TypeViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'account', AccountViewSet)
router.register(r'account-type', Account_TypeViewSet)

urlpatterns = [
    path('v1/', include(router.urls)),
]

from rest_framework import routers

from django.urls import include, path

from users.views import UserViewSet
from transactions.views import (
    TransactionViewSet,
    Transaction_TypeViewSet,
    CategoryViewSet
)


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'transaction', TransactionViewSet)
router.register(r'transaction-type', Transaction_TypeViewSet)
router.register(r'category', CategoryViewSet)

urlpatterns = [
    path('v1/', include(router.urls)),
]

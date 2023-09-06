from rest_framework import routers

from django.urls import include, path

from users.views import UserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('v1/', include(router.urls)),
]

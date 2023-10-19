from django.contrib import admin
from django.urls import path, include
from transactions.views import (
    index,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', index, name='index'),
    path('transactions/', include('transactions.urls')),
    path('budgets/', include('budget.urls')),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

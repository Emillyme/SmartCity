from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Colocamos 'api/' para que seja possivel acessar as rotas da api do api_rest
    path('api/', include('api_rest.urls'), name='api_rest_urls'),
]

from django.urls import path, include
from . import views
from .views import UserRegisterView, UserLoginView

urlpatterns = [
    path('', views.abre_index, name='abre_index'),
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
]

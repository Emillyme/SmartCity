from django.urls import path, include
from . import views
from .views import UserRegisterView, UserLoginView, PasswordResetRequestView, PasswordResetConfirmView, SensorListView, SensorDetailView

urlpatterns = [
    path('', views.abre_index, name='abre_index'),
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('password_reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password_reset_confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('sensores/', views.SensorListView.as_view(), name='sensores'),
    path('sensores/<int:pk>/', views.SensorDetailView.as_view(), name='sensores_detail'),
]

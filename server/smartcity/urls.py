from django.urls import path, include
from . import views
from .views import (
    UserRegisterView, UserLoginView, PasswordResetRequestView,
    PasswordResetConfirmView, SensorListView, SensorDetailView,
    TemperaturaView, TemperaturaDetailView, UmidadeView, UmidadeDetailView,
    LuminosidadeView, LuminosidadeDetailView
)

urlpatterns = [
    path('', views.abre_index, name='abre_index'),
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('password_reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password_reset_confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('sensores/', views.SensorListView.as_view(), name='sensores'),
    path('sensores/<int:pk>/', views.SensorDetailView.as_view(), name='sensores_detail'),
    path('temperatura/', views.TemperaturaView.as_view(), name='temperatura'),
    path('temperatura/<int:pk>/', views.TemperaturaDetailView.as_view(), name='temperatura_detail'), 
    path('umidade/', views.UmidadeView.as_view(), name='umidade'),
    path('umidade/<int:pk>/', views.UmidadeDetailView.as_view(), name='umidade_detail'),
    path('luminosidade/', views.LuminosidadeView.as_view(), name='luminosidade'),
    path('luminosidade/<int:pk>/', views.LuminosidadeDetailView.as_view(), name='luminosidade_detail'),
    path('contadores/', views.ContadorView.as_view(), name='contadores'),
    path('contadores/<int:pk>/', views.ContadorDetailView.as_view(), name='contadores_detail'),
    path('get_user/', views.GetUser.as_view(), name='Dados Usuario'),
]

from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('users', views.get_users, name='get_all_users'),
    path('user/<str:nickname>', views.get_by_nickname, name='get_by_nickname'),
    path('data/', views.user_manage, name='user_manage'),
]

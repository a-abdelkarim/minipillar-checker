from django.urls import path
from django.urls import path, include
from . import views

urlpatterns = [
    # ex: /dashboard/
    path('', views.dashboard, name='dashboard'),
    path('users/', views.manage_users, name='manage_users'),
    
]


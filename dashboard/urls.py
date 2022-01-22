from django.urls import path
from django.urls import path, include
from . import views

urlpatterns = [
    # ex: /dashboard/
    path('', views.dashboard, name='dashboard'),
    path('users/', views.manage_users, name='manage_users'),
    path('users/<pk>/activate/', views.user_activate, name='user_activate'),
    path('users/<pk>/deactivate/', views.user_deactivate, name='user_deactivate'),
    # minipillars
    path('minipillar/list/', views.minipillar_checked_list, name='minipillar_checked_list'),
    path('minipillar/<id>/', views.minipillar_details, name='minipillar_details'),
    
]


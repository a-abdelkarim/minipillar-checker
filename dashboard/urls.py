from django.urls import path
from django.urls import path, include
from . import views

urlpatterns = [
    # ex: /dashboard/
    path('', views.dashboard, name='dashboard'),
    path('user/list/', views.user_list, name='user_list'),
    path('user/<pk>/activate', views.user_activate, name='user_activate'),
    path('user/<pk>/deactivate', views.user_deactivate, name='user_deactivate'),
    path('user/activity/list', views.user_activity_list, name='user_activity_list'),
    path('user/<pk>/checked/list', views.user_checked_list, name='user_checked_list'),
    # minipillars
    path('minipillar/list/', views.minipillar_checked_list, name='minipillar_checked_list'),
    path('minipillar/<id>/', views.minipillar_details, name='minipillar_details'),
    
]


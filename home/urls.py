from django.urls import path
from home.views import index

urlpatterns = [
    path('login', index, name='index'),
    path('admin/<str:pass>', index, name='index'),
    path('map', index, name='index'),
]

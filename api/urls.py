from django.urls import path
from rest_framework.authtoken import views
from api.views import *

urlpatterns = [
    # auth
    path('login', auth.as_view({'post': 'login'})),
    path('logout', auth.as_view({'get': 'logout'})),
    path('changePassword', auth.as_view({'post': 'changePassword'})),
    path('updateUserInfo', auth.as_view({'put': 'updateUserInfo'})),

    # map
    # path('features', features.as_view({'get': 'locations'})),


    # users
    path('users/create', users.as_view({'post': 'create'})),
    path('users/records', users.as_view({'get': 'records'})),
    path('users/<str:id>', users.as_view({'get': 'record'})),
    path('users/<str:id>/delete', users.as_view({'delete': 'delete'})),
    path('users/<str:id>/update', users.as_view({'put': 'update'})),

    # devices
    path('devices/history', devices.as_view({'post': 'history'})),
    path('devices/records', devices.as_view({'get': 'records'})),
    path('devices/<str:id>', devices.as_view({'get': 'record'})),
    path('devices/<str:id>/delete', devices.as_view({'delete': 'delete'})),
    path('devices/<str:id>/update', devices.as_view({'put': 'update'})),
    path('devices/<str:id>/activate', devices.as_view({'put': 'activate'})),
   

    # user devices
    path('user/device/create', Operations.as_view({'post': 'deviceCreate'})),
    
    # mini pillars #
    # import shp
    path('minipillar/import', Operations.as_view({'post': 'minipilar_import'}), name = 'minipillar-import'),
    # records
    path('minipillar/records', MiniPillarList.as_view(), name = 'minipillar'),
    # record
    path('minipillar/<str:id>/record', MiniPillarRecord.as_view(), name = 'minipillar-record'),
    # update
    path('minipillar/<str:id>/update', UpdateMiniPillar.as_view(), name = 'minipillar-update'),
    # nearest minipillar
    path('minipillar/nearest_minipillar', NearestMiniPillar.as_view(), name = 'nearest_minipillar'),

]

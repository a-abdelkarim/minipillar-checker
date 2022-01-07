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
    path('features', features.as_view({'get': 'locations'})),


    # users
    path('users/create', users.as_view({'post': 'create'})),
    path('users/records', users.as_view({'get': 'records'})),
    path('users/<str:id>', users.as_view({'get': 'record'})),
    path('users/<str:id>/delete', users.as_view({'delete': 'delete'})),
    path('users/<str:id>/update', users.as_view({'put': 'update'})),

    # groups
    path('groups/create', groups.as_view({'post': 'create'})),
    path('groups/records', groups.as_view({'get': 'records'})),
    path('groups/list', groups.as_view({'get': 'list'})),
    path('groups/<str:id>', groups.as_view({'get': 'record'})),
    path('groups/<str:id>/delete', groups.as_view({'delete': 'delete'})),
    path('groups/<str:id>/update', groups.as_view({'put': 'update'})),

    # areas
    path('areas/create', areas.as_view({'post': 'create'})),
    path('areas/records', areas.as_view({'get': 'records'})),
    path('areas/<str:id>', areas.as_view({'get': 'record'})),
    path('areas/<str:id>/delete', areas.as_view({'delete': 'delete'})),
    path('areas/<str:id>/update', areas.as_view({'put': 'update'})),

    # devices
    path('devices/history', devices.as_view({'post': 'history'})),
    path('devices/records', devices.as_view({'get': 'records'})),
    path('devices/<str:id>', devices.as_view({'get': 'record'})),
    path('devices/<str:id>/delete', devices.as_view({'delete': 'delete'})),
    path('devices/<str:id>/update', devices.as_view({'put': 'update'})),
    path('devices/<str:id>/activate', devices.as_view({'put': 'activate'})),
   

    # user devices
    path('user/device/create', Operations.as_view({'post': 'deviceCreate'})),
    path('user/location/create',
         Operations.as_view({'post': 'locationCreate'})),

    # mini pillars #
    # import shp
    path('minipillar/import', Operations.as_view({'post': 'minipilar_import'}), name = 'minipillar-import'),
    # records
    path('minipillar/records', MiniPillarList.as_view(), name = 'minipillar'),
    # update
    path('minipillar/<str:id>/update', UpdateMiniPillar.as_view(), name = 'minipillar-update'),

]

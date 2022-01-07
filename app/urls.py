from django.contrib import admin
from django.urls import path, include
from app.router import router
from rest_framework.authtoken import views
from django.views.generic import TemplateView
# swagger
from rest_framework_swagger.views import get_swagger_view
from django.urls import path, re_path, include
# drf_yasg
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from home.views import index

schema_view = get_schema_view(
    openapi.Info(
        title="Transit API",
        default_version='v1',
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
# ends here
urlpatterns = [
    # swagger
    re_path(r'^doc(?P<format>\.json|\.yaml)$', schema_view.without_ui(
        cache_timeout=0), name='schema-json'),
    path('doc/', schema_view.with_ui('swagger',
                                     cache_timeout=0),  name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc',
                                       cache_timeout=0), name='schema-redoc'),
    # apis
    path("api/", include("api.urls")),
    path("users/", index, name='index'),
    path("login/", index, name='index'),
    path("admin/<str:path>", index, name='index'),
    path("admin/<str:path>/<str:uuid>", index, name='index'),
    path("", index, name='index'),

]

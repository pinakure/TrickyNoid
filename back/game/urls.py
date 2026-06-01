from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.urls import path, reverse_lazy
from django.views.generic import RedirectView
from allauth.socialaccount.providers.oauth2.views import OAuth2LoginView

urlpatterns = [
    path('admin/login/', RedirectView.as_view(url='/accounts/oidc/keycloak/login/')),
    path('admin/', admin.site.urls),
    path('accounts/'        , include('allauth.urls')               ),
]

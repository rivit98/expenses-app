from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

API_VERSION = "v1"

urlpatterns = [
    path(f"{API_VERSION}/login/", TokenObtainPairView.as_view()),
    path(f"{API_VERSION}/refresh/", TokenRefreshView.as_view()),
]

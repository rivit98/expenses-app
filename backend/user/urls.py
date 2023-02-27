from django.urls import path

from user.views import UserView

API_VERSION = "v1"

urlpatterns = [
    path(f"{API_VERSION}/me/", UserView.as_view()),
]

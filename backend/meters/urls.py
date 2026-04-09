from django.urls import path

from meters.views import CategoriesView, MetersView, MeterView

API_VERSION = "v1"

urlpatterns = [
    path(f"{API_VERSION}/categories/", CategoriesView.as_view()),
    path(f"{API_VERSION}/meters/", MetersView.as_view()),
    path(f"{API_VERSION}/meters/<int:id>/", MeterView.as_view()),
]

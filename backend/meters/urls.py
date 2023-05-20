from django.urls import path

from meters.views import CategoriesView, ExpensesView, ExpenseView

API_VERSION = "v1"

urlpatterns = [
    path(f"{API_VERSION}/categories/", CategoriesView.as_view()),
    path(f"{API_VERSION}/meters/", ExpensesView.as_view()),
    path(f"{API_VERSION}/meters/<int:id>/", ExpenseView.as_view()),
]

from django.urls import path

from expenses.views import CategoriesView, ExpensesView, ExpenseView

API_VERSION = "v1"

urlpatterns = [
    path(f"{API_VERSION}/categories/", CategoriesView.as_view()),
    path(f"{API_VERSION}/expenses/", ExpensesView.as_view()),
    path(f"{API_VERSION}/expenses/<int:id>/", ExpenseView.as_view()),
]

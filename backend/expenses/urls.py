from django.urls import path

from expenses.views import (
    CategoriesView,
    ExpensesSummaryView,
    ExpensesView,
    ExpenseView,
    ExpenseViewByYearAndMonth,
)

API_VERSION = "v1"

urlpatterns = [
    path(f"{API_VERSION}/categories/", CategoriesView.as_view()),
    path(f"{API_VERSION}/expenses/", ExpensesView.as_view()),
    path(f"{API_VERSION}/expenses/<int:id>/", ExpenseView.as_view()),
    path(f"{API_VERSION}/expenses/<int:year>/<int:month>/", ExpenseViewByYearAndMonth.as_view()),
    path(f"{API_VERSION}/expenses/summary/", ExpensesSummaryView.as_view()),
]

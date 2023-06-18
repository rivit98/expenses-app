from django.db.models import Sum
from django.db.models.functions import TruncMonth
from rest_framework import filters, generics, mixins
from rest_framework.permissions import IsAuthenticated

from expenses.models import Category, Expense
from expenses.serializers import (
    CategorySerializer,
    ExpenseSerializer,
    ExpenseSummarySerializer,
)


class ExpenseViewByYearAndMonth(
    generics.ListCreateAPIView,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExpenseSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering = ("-date", "-id")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def get_queryset(self):
        year = self.kwargs.get("year")
        month = self.kwargs.get("month")
        queryset = Expense.objects.filter(user=self.request.user)
        queryset = queryset.filter(date__year=year)
        queryset = queryset.filter(date__month=month)
        return queryset


class ExpensesView(
    generics.ListCreateAPIView,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExpenseSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering = ("-date", "-id")

    def post(self, request, *args, **kwargs):
        request.data.update({"user": self.request.user.id})
        return self.create(request, *args, **kwargs)

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)


class ExpensesSummaryView(generics.ListAPIView, mixins.ListModelMixin):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExpenseSummarySerializer
    filter_backends = (filters.OrderingFilter,)
    ordering = ("-date", "category")

    def get_queryset(self):
        return (
            Expense.objects.filter(user=self.request.user)
            .values("category")
            .annotate(date=TruncMonth("date"), total=Sum("amount"))
        )


class ExpenseView(
    generics.RetrieveUpdateDestroyAPIView,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExpenseSerializer
    lookup_field = "id"

    def put(self, request, *args, **kwargs):
        request.data.update({"user": self.request.user.id})
        return self.update(request, *args, **kwargs)

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)


class CategoriesView(
    generics.ListAPIView,
    mixins.ListModelMixin,
):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

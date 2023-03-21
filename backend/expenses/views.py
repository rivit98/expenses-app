from django.db.models import Sum
from rest_framework import filters, generics, mixins
from rest_framework.permissions import IsAuthenticated

from expenses.models import Category, Expense
from expenses.serializers import (
    CategorySerializer,
    ExpenseSerializer,
    ExpenseSummarySerializer,
)


class ExpenseViewByYearAndMonth(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
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


class ExpensesView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExpenseSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering = ("-date", "-id")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        request.data.update({"user": self.request.user.id})
        return self.create(request, *args, **kwargs)

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)


class ExpensesSummaryView(generics.GenericAPIView, mixins.ListModelMixin):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExpenseSummarySerializer
    filter_backends = (filters.OrderingFilter,)
    ordering = ("-date__year", "-date__month", "category")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def get_queryset(self):
        return (
            Expense.objects.filter(user=self.request.user)
            .values("date__year", "date__month", "category")
            .annotate(total=Sum("amount"))
        )


class ExpenseView(
    generics.GenericAPIView,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExpenseSerializer
    lookup_field = "id"

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        request.data.update({"user": self.request.user.id})
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)


class CategoriesView(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

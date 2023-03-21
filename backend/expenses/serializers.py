from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer

from expenses.models import Category, Expense


class ExpenseSerializer(ModelSerializer):
    comment = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Expense
        fields = "__all__"


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ExpenseSummarySerializer(Serializer):
    total = serializers.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    category = serializers.IntegerField(required=True)
    date = serializers.DateField(required=True, format="%m-%Y")

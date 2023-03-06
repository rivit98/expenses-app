from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from expenses.models import Category, Expense


class ExpenseSerializer(ModelSerializer):
    comment = serializers.CharField(required=False)

    class Meta:
        model = Expense
        fields = "__all__"


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

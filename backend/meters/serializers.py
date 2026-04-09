from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from meters.models import Category, Meter


class MeterSerializer(ModelSerializer):
    read = serializers.DecimalField(max_digits=6, decimal_places=2, min_value=0)

    class Meta:
        model = Meter
        fields = "__all__"
        read_only_fields = ("user",)


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

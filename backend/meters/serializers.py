from rest_framework.serializers import ModelSerializer

from meters.models import Category, Meter


class MeterSerializer(ModelSerializer):
    class Meta:
        model = Meter
        fields = "__all__"


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


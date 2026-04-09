from rest_framework import filters, generics
from rest_framework.permissions import IsAuthenticated

from meters.models import Category, Meter
from meters.serializers import CategorySerializer, MeterSerializer


class MetersView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MeterSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering = ("-date", "-id")

    def get_queryset(self):
        return Meter.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MeterView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MeterSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Meter.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class CategoriesView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

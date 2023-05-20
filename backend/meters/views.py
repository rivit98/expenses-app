from rest_framework import filters, generics, mixins
from rest_framework.permissions import IsAuthenticated

from meters.models import Category, Meter
from meters.serializers import (
    CategorySerializer,
    MeterSerializer,
)


class ExpensesView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MeterSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering = ("-date", "-id")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        request.data.update({"user": self.request.user.id})
        return self.create(request, *args, **kwargs)

    def get_queryset(self):
        return Meter.objects.filter(user=self.request.user)


class ExpenseView(
    generics.GenericAPIView,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = (IsAuthenticated,)
    serializer_class = MeterSerializer
    lookup_field = "id"

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        request.data.update({"user": self.request.user.id})
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def get_queryset(self):
        return Meter.objects.filter(user=self.request.user)


class CategoriesView(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

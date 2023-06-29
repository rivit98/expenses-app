from rest_framework import filters, generics, mixins
from rest_framework.permissions import IsAuthenticated

from meters.models import Category, Meter
from meters.serializers import CategorySerializer, MeterSerializer


class ExpensesView(generics.ListCreateAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    permission_classes = (IsAuthenticated,)
    serializer_class = MeterSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering = ("-date", "-id")

    def post(self, request, *args, **kwargs):
        request.data.update({"user": self.request.user.id})
        return self.create(request, *args, **kwargs)

    def get_queryset(self):
        return Meter.objects.filter(user=self.request.user)


class ExpenseView(
    generics.RetrieveUpdateDestroyAPIView,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = (IsAuthenticated,)
    serializer_class = MeterSerializer
    lookup_field = "id"

    def put(self, request, *args, **kwargs):
        request.data.update({"user": self.request.user.id})
        return self.update(request, *args, **kwargs)

    def get_queryset(self):
        return Meter.objects.filter(user=self.request.user)


class CategoriesView(generics.ListAPIView, mixins.ListModelMixin):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

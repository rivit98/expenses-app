from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated

from expenses.models import Category, Expense
from expenses.serializers import CategorySerializer, ExpenseSerializer


class ExpensesView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExpenseSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        request.data.update({"user": self.request.user.id})
        return self.create(request, *args, **kwargs)

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)


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

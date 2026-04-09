import datetime

from django.contrib.auth import get_user_model
from django.db.models import (
    CASCADE,
    PROTECT,
    BigAutoField,
    CharField,
    DateField,
    DecimalField,
    ForeignKey,
    Model,
)


class Category(Model):
    id = BigAutoField(primary_key=True)
    name = CharField(max_length=32, null=False, unique=True)

    def __str__(self):
        return f"{self.name}"


class Expense(Model):
    id = BigAutoField(primary_key=True)
    user = ForeignKey(get_user_model(), on_delete=CASCADE, related_name="user_expenses")
    amount = DecimalField(max_digits=8, decimal_places=2, null=False)
    comment = CharField(max_length=128, null=True, blank=True)
    category = ForeignKey(Category, on_delete=PROTECT, related_name="expense_category")
    date = DateField(blank=True, default=datetime.date.today, db_index=True)

    def __str__(self):
        return f"{self.user.username} paid {self.amount} for {self.category} ({self.comment})"

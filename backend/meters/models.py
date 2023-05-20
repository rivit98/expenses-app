import datetime

from django.contrib.auth import get_user_model
from django.db.models import (
    CASCADE,
    BigAutoField,
    CharField,
    DateField,
    DecimalField,
    ForeignKey,
    Model,
)


class Category(Model):
    id = BigAutoField(primary_key=True)
    name = CharField(max_length=32, null=False)
    unit = CharField(max_length=8, null=False)

    def __str__(self):
        return f"{self.name}"


class Meter(Model):
    id = BigAutoField(primary_key=True)
    user = ForeignKey(get_user_model(), on_delete=CASCADE, related_name="user_meters")
    read = DecimalField(max_digits=6, decimal_places=2, null=False)
    category = ForeignKey(Category, on_delete=CASCADE, related_name="meter_category")
    date = DateField(blank=True, default=datetime.date.today)

    def __str__(self):
        return f"{self.user.username} paid {self.read} for {self.category}"

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework.fields import CharField
from rest_framework.serializers import ModelSerializer


class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = ("name",)


class UserSerializer(ModelSerializer):
    groups = GroupSerializer(read_only=True, many=True)
    password = CharField(write_only=True)

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
        )

        return user

    class Meta:
        model = get_user_model()
        fields = ("id", "username", "password")

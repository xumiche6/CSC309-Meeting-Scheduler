from rest_framework import serializers
from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ["id", "name", "email", "user"]
        extra_kwargs = {"user": {"read_only": True}}

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

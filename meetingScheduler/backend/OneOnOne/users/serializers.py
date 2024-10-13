from .models import User
from rest_framework import serializers
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )

    class Meta:
        model = User
        fields = ("id", "username", "password", "email", "confirm_password")
        extra_kwargs = {
            "password": {"write_only": True, "required": False, "allow_blank": True},
            "id": {"read_only": True},
        }

        def validate_email(self, value):
            if self.instance:
                if self.instance.email != value:
                    if User.objects.filter(email=value).exists():
                        raise serializers.ValidationError(
                            "This email is already in use."
                        )
            else:
                if User.objects.filter(email=value).exists():
                    raise serializers.ValidationError("This email is already in use.")
            return value

    def validate(self, data):
        if not self.instance:
            if not data.get("password"):
                raise serializers.ValidationError(
                    {"password": "Password is required for creating a new user."}
                )
            if not data.get("confirm_password"):
                raise serializers.ValidationError(
                    {"confirm_password": "Confirm password is required."}
                )
            if data["password"] != data.get("confirm_password"):
                raise serializers.ValidationError(
                    {"confirm_password": "Password fields didn't match."}
                )
        else:
            if data.get("password") or data.get("confirm_password"):
                if data.get("password") != data.get("confirm_password"):
                    raise serializers.ValidationError(
                        {"confirm_password": "Password fields didn't match."}
                    )
                if not data.get("password"):
                    data.pop("password")
                    data.pop("confirm_password", None)

        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password", None)
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        validated_data.pop("confirm_password", None)

        password = validated_data.pop("password", None)
        if password:
            instance.set_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data["username"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid username/password.")
        return user

from rest_framework import serializers
from .models import ReceiverAvail


class ReceiverAvailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceiverAvail
        fields = '__all__'

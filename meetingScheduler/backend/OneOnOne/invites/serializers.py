from .models import Invite
from rest_framework import serializers

class InviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invite
        exclude = ['sender', 'receiver_avail']

class ReminderSerializer(serializers.Serializer):
    receiver = serializers.IntegerField()
    schedule = serializers.IntegerField()
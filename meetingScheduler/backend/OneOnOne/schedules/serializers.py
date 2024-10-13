from rest_framework import serializers
from .models import Schedule, Meeting


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        exclude = ['owner']


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        exclude = []

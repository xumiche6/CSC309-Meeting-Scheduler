from rest_framework import serializers
from .models import RecommendedSchedule

class RecommendedScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendedSchedule
        fields = ['overlapping_time']


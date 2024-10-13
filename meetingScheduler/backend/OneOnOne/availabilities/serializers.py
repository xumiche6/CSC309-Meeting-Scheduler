from rest_framework import serializers
from .models import Availabilities


class AvailabilitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Availabilities
        fields = '__all__'
        # exclude = ['corresponding_user', 'availability_type', 'corresponding_contact']

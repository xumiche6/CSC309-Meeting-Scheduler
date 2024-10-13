from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import RecommendedScheduleSerializer
from .meeting_scheduler import find_meeting_options


class RecommendedSchedulesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        sender_availabilities = request.data.get('sender_availabilities', [])
        invitees_availability = request.data.get('invitees_availabilities', {})

        # Find meeting options
        meeting_options = find_meeting_options(sender_availabilities, invitees_availability)
        serializer = RecommendedScheduleSerializer(data={'overlapping_time': meeting_options})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Get the instance after saving
        instance = serializer.instance

        # Serialize the instance data
        serialized_data = RecommendedScheduleSerializer(instance).data

        return Response(serialized_data, status=status.HTTP_200_OK)

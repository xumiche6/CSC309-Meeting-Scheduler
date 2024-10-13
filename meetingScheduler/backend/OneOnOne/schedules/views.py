from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Schedule, Meeting
from .serializers import ScheduleSerializer, MeetingSerializer
from django.core.exceptions import ObjectDoesNotExist


class ScheduleCreateView(generics.CreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleDetailView(generics.RetrieveAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer


class ScheduleListView(generics.ListAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        return Schedule.objects.filter(owner=user_id)


class MeetingCreateView(generics.CreateAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            schedule_id = self.kwargs.get('schedule_id')
            corresponding_schedule = Schedule.objects.get(id=schedule_id, owner=self.request.user)
        except ObjectDoesNotExist:
            return Response({"error": "Schedule matching query does not exist"},
                            status=status.HTTP_404_NOT_FOUND)

        if serializer.is_valid():
            meeting = serializer.save(inviter=self.request.user, corresponding_schedule=corresponding_schedule)
            corresponding_schedule.meetings.add(meeting)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeetingDetailView(generics.RetrieveAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer


class MeetingListView(generics.ListAPIView):
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        schedule_id = self.kwargs['schedule_id']
        return Meeting.objects.filter(corresponding_schedule__id=schedule_id)


class MeetingUpdateView(generics.UpdateAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.confirmed = True  # Update the confirmation status to True
        instance.save()
        return Response(self.get_serializer(instance).data)


class MeetingUpdateInviteeResponseView(generics.UpdateAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.isInviteeResponseReceived = True  # Update the isInviteeResponseReceived status to True
        instance.save()
        return Response(self.get_serializer(instance).data)

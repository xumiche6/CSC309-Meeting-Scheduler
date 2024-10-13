from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import AvailabilitiesSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import Availabilities

class AvailabilitiesViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilitiesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Extract availability_type from the URL
        availability_type = self.kwargs.get('availability_type', None)

        # Check if availability_type is valid and adjust queryset accordingly
        if availability_type in ['sender', 'invitee']:
            if availability_type == 'sender':
                return Availabilities.objects.filter(
                    availability_type=availability_type,
                    corresponding_user=self.request.user
                )
            else:
                return Availabilities.objects.filter(
                    availability_type=availability_type,
                    corresponding_contact__user=self.request.user
                )
        else:
            return Availabilities.objects.none()

    def perform_create(self, serializer):
        # Extract availability_type from the URL provided
        availability_type = self.kwargs.get('availability_type', None)
        if serializer.is_valid():
            # Check if availability_type is valid and set corresponding_user or corresponding_contact accordingly
            if availability_type in ['sender', 'invitee']:
                if availability_type == 'sender':
                    serializer.save(
                        corresponding_user=self.request.user,
                        availability_type=availability_type
                    )
                else:
                    # Assuming that Contact model has a 'user' field
                    serializer.save(
                        corresponding_contact=self.request.user,
                        availability_type=availability_type
                    )
            else:
                return Response(
                    {'error': 'Invalid availability_type'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
        except status.HTTP_404_NOT_FOUND:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update_confirmation(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.confirmed = True  # Update confirmation status
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


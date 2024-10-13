from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ReceiverAvail
from .serializers import ReceiverAvailSerializer
from rest_framework import generics
from rest_framework import status

class ListAvails(APIView):
    """
    Lists all the receiver availabilities
    """
    def get(self, request, format=None):
        avails = ReceiverAvail.objects.all()
        serializer = ReceiverAvailSerializer(avails, many=True)
        return Response(serializer.data)

class CreateAvail(generics.CreateAPIView):
    """
    Creates a receiver availability
    """
    queryset = ReceiverAvail.objects.all()
    serializer_class = ReceiverAvailSerializer

    def perform_create(self, serializer):
        serializer.save()

class UpdateAvail(APIView):
    """
    Updates a receiver availability
    """
    def put(self, request, pk, format=None):
        try:
            avail = ReceiverAvail.objects.get(pk=pk)
        except ReceiverAvail.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ReceiverAvailSerializer(avail, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteAvail(APIView):
    """
    Deletes a receiver availability
    """
    def delete(self, request, pk, format=None):
        try:
            avail = ReceiverAvail.objects.get(pk=pk)
        except ReceiverAvail.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"message": "Availability not found."})
        avail.delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data={"message": "Availability deleted."})
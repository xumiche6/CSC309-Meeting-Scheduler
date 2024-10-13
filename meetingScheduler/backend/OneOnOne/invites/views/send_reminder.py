from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..serializers import ReminderSerializer
from django.conf import settings
from django.core.mail import send_mail
import sys
sys.path.append("...")
from contacts.models import Contact

class SendReminder(APIView):
    """
    Send a reminder email to the specified contact about the specified meeting
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = ReminderSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            """
            I can't seem to get this to work
            
            """
            subject = 'Reminder to submit your availabilities for a meeting'
            contact_id = self.request.data['receiver']
            schedule_id = self.request.data['schedule']
            message = f'Hello, this is a reminder to submit your availabilites for your meeting. Please follow the link below to submit your availabilities: \nhttps://csc309-p3-five.vercel.app/receiver_avail?contact={contact_id}&schedule={schedule_id}'
            email_from = settings.EMAIL_HOST_USER
            email = Contact.objects.get(id=int(request.data['receiver'])).email
            recipient_list = [email]
            send_mail( subject, message, email_from, recipient_list )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.urls import reverse_lazy
from django.shortcuts import redirect
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from ..models import Invite
from rest_framework import generics
from ..serializers import InviteSerializer

from django.conf import settings
from django.core.mail import send_mail
import sys
sys.path.append("...")
from contacts.models import Contact
from availabilities.models import Availabilities

class CreateInviteView(generics.CreateAPIView):
    queryset = Invite.objects.all()
    serializer_class = InviteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        subject = "You've been invited to a meeting!"
        username = self.request.user.username
        contact_id = self.request.data['receiver']
        schedule_id = self.request.data['schedule']

        avails = Availabilities.objects.filter(corresponding_user=self.request.user)

        message = f'You have been invited to a meeting by {username}, please follow the link to specify when you will be available for the meeting: \nhttps://csc309-p3-five.vercel.app/receiver_avail?contact={contact_id}&schedule={schedule_id}'
        message += '\nHere are the times that the sender is available:'
        for i in range(len(avails)):
            message +=  '\n' + str(avails[i])

        email_from = settings.EMAIL_HOST_USER
        email = Contact.objects.get(id=int(self.request.data['receiver'])).email
        recipient_list = [email]
        send_mail( subject, message, email_from, recipient_list )
        serializer.save(
            sender=self.request.user,
            date_sent=datetime.today().strftime('%Y-%m-%d'),
            receiver_avail=None,
        )
from django.db import models
from django.conf import settings
from contacts.models import Contact
from availabilities.models import Availabilities
from schedules.models import Schedule
from datetime import datetime

class Invite(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    receiver = models.ForeignKey(Contact, on_delete=models.CASCADE)
    date_sent = models.DateField(default=datetime.today().strftime('%Y-%m-%d'))
    
    confirmation = models.BooleanField(default=False)
    receiver_avail = models.ForeignKey(Availabilities, on_delete=models.CASCADE, null=True, blank=True)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, null=True, blank=True)
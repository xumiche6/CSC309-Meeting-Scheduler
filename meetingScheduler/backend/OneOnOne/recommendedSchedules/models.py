from django.db import models
from availabilities.models import Availabilities
from django.forms import JSONField


class RecommendedSchedule(models.Model):
    sender_availability = models.ManyToManyField(Availabilities, related_name='sender_schedule')
    invitee_availability = JSONField()
    overlapping_time = models.JSONField(blank=True, null=True)

    def __str__(self):
        return str(self.overlapping_times)

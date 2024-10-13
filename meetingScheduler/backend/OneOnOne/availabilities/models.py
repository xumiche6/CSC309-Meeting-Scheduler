from django.db import models
from django.conf import settings
from contacts.models import Contact


class Availabilities(models.Model):
    DAY_CHOICES = [
        ('Mon', 'Monday'),
        ('Tue', 'Tuesday'),
        ('Wed', 'Wednesday'),
        ('Thu', 'Thursday'),
        ('Fri', 'Friday'),
        ('Sat', 'Saturday'),
        ('Sun', 'Sunday'),
    ]

    PRIORITY_CHOICES = [
        (1, "HIGH"),
        (2, "MEDIUM"),
        (3, "LOW"),
    ]

    AVAILABILITY_TYPE_CHOICES = [
        ('sender', 'Sender'),
        ('invitee', 'Invitee'),
    ]

    day = models.CharField(max_length=3, choices=DAY_CHOICES)
    start_time = models.TimeField()
    duration = models.IntegerField()
    priority = models.IntegerField(choices=PRIORITY_CHOICES)
    availability_type = models.CharField(max_length=10, choices=AVAILABILITY_TYPE_CHOICES)

    # Using a ForeignKey to both User and Contact
    corresponding_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='availabilities_as_sender',
        null=True, blank=True,
        on_delete=models.CASCADE
    )

    corresponding_contact = models.ForeignKey(
        Contact,
        related_name='availabilities_as_invitee',
        null=True, blank=True,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.get_day_display()} - {self.start_time}"

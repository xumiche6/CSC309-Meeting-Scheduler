from django.db import models
from contacts.models import Contact
from schedules.models import Schedule


class ReceiverAvail(models.Model):
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

    day = models.CharField(max_length=3, choices=DAY_CHOICES)
    start_time = models.TimeField()
    duration = models.IntegerField()
    priority = models.IntegerField(choices=PRIORITY_CHOICES)

    # Foreign keys to both contact and schedule

    corresponding_contact = models.ForeignKey(
        Contact,
        related_name='temp1',
        null=True, blank=True,
        on_delete=models.CASCADE
    )

    corresponding_schedule = models.ForeignKey(
        Schedule,
        related_name='temp1',
        null=True, blank=True,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.get_day_display()} - {self.start_time}"

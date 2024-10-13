# # from django.db import models
# # from contacts.models import Contact
# # from django.conf import settings
# # import datetime
# #
# #
# # class Schedule(models.Model):
# #     owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
# #     invited_contacts = models.ManyToManyField(Contact)
# #     meetings = models.ManyToManyField('Meeting', blank=True)
# #     duration_weeks = models.PositiveIntegerField()
# #     name = models.CharField(max_length=100, default="")
# #
# #
# # class Meeting(models.Model):
# #     DAY_CHOICES = [
# #         ('Mon', 'Monday'),
# #         ('Tue', 'Tuesday'),
# #         ('Wed', 'Wednesday'),
# #         ('Thu', 'Thursday'),
# #         ('Fri', 'Friday'),
# #         ('Sat', 'Saturday'),
# #         ('Sun', 'Sunday'),
# #     ]
# #     confirmed = models.BooleanField(default=False)
# #     inviter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
# #     day = models.CharField(max_length=3, choices=DAY_CHOICES)
# #     time = models.TimeField()
# #     title = models.CharField(max_length=100)
# #     corresponding_schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
# #     duration = models.PositiveIntegerField(default=60)
# #     isInviteeResponseReceived = models.BooleanField(default=False)
#
# from django.db import models
# from contacts.models import Contact
# from django.conf import settings
# import datetime
# import random
# from django.utils import timezone
# from datetime import timedelta
#
# class Schedule(models.Model):
#     owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     invited_contacts = models.ManyToManyField(Contact)
#     meetings = models.ManyToManyField('Meeting', blank=True)
#     duration_weeks = models.PositiveIntegerField()
#     name = models.CharField(max_length=100, default="")
#     start_date = models.DateField(default=datetime.date.today)
#     isArchived = models.BooleanField(default=False)
#
#     @property
#     def is_archived(self):
#         end_date = self.start_date + timedelta(weeks=self.duration_weeks)
#         return timezone.now().date() > end_date
#
# class Meeting(models.Model):
#     DAY_CHOICES = [
#         ('Mon', 'Monday'),
#         ('Tue', 'Tuesday'),
#         ('Wed', 'Wednesday'),
#         ('Thu', 'Thursday'),
#         ('Fri', 'Friday'),
#         ('Sat', 'Saturday'),
#         ('Sun', 'Sunday'),
#     ]
#     confirmed = models.BooleanField(default=False)
#     inviter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     day = models.CharField(max_length=3, choices=DAY_CHOICES)
#     time = models.TimeField()
#     title = models.CharField(max_length=100)
#     corresponding_schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
#     duration = models.PositiveIntegerField(default=60)
#     isInviteeResponseReceived = models.BooleanField(default=False)
#
#     date = models.DateField(default=datetime.date.today)  # Start recurring time
#     invitee = models.ForeignKey(Contact, on_delete=models.CASCADE, default=1)
#     color = models.CharField(max_length=20, blank=True, null=True)  # Color
#
#     def save(self, *args, **kwargs):
#         if not self.color:
#             self.color = self.generate_light_color()
#         super().save(*args, **kwargs)
#
#     def generate_light_color(self):
#         # Generate a light color in hexadecimal format
#         random.seed(self.id)  # Seed the random number generator with the meeting's ID
#         r = random.randint(180, 255)  # Red component
#         g = random.randint(180, 255)  # Green component
#         b = random.randint(180, 255)  # Blue component
#         return '#{:02x}{:02x}{:02x}'.format(r, g, b)

from django.db import models
from contacts.models import Contact
from django.conf import settings
import datetime
import random
from django.utils import timezone
from datetime import timedelta

class Schedule(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    invited_contacts = models.ManyToManyField(Contact)
    meetings = models.ManyToManyField('Meeting', blank=True)
    duration_weeks = models.PositiveIntegerField()
    name = models.CharField(max_length=100, default="")
    start_date = models.DateField(default=datetime.date.today)
    isArchived = models.BooleanField(default=False)
    color = models.CharField(max_length=20, blank=True, null=True)  # Color

    @property
    def is_archived(self):
        end_date = self.start_date + timedelta(weeks=self.duration_weeks)
        return timezone.now().date() > end_date

    def save(self, *args, **kwargs):
        if not self.color:
            # Generate a random light color if color is not provided
            self.color = self.generate_light_color()
        super().save(*args, **kwargs)

    def generate_light_color(self):
        # Generate a light color in hexadecimal format
        random.seed(self.id)  # Seed the random number generator with the schedule's ID
        r = random.randint(180, 255)  # Red component
        g = random.randint(180, 255)  # Green component
        b = random.randint(180, 255)  # Blue component
        return '#{:02x}{:02x}{:02x}'.format(r, g, b)

class Meeting(models.Model):
    DAY_CHOICES = [
        ('Mon', 'Monday'),
        ('Tue', 'Tuesday'),
        ('Wed', 'Wednesday'),
        ('Thu', 'Thursday'),
        ('Fri', 'Friday'),
        ('Sat', 'Saturday'),
        ('Sun', 'Sunday'),
    ]
    confirmed = models.BooleanField(default=False)
    inviter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    day = models.CharField(max_length=3, choices=DAY_CHOICES)
    time = models.TimeField()
    title = models.CharField(max_length=100)
    corresponding_schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
    duration = models.PositiveIntegerField(default=60)
    isInviteeResponseReceived = models.BooleanField(default=False)
    date = models.DateField(default=datetime.date.today)  # Start recurring time
    invitee = models.ForeignKey(Contact, on_delete=models.CASCADE, default=1)
    color = models.CharField(max_length=20, blank=True, null=True)  # Color

    def save(self, *args, **kwargs):
        if not self.color:
            # Set the color based on the corresponding schedule's color
            self.color = self.corresponding_schedule.color
        super().save(*args, **kwargs)

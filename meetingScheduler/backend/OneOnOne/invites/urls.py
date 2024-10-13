from django.urls import path
from .views.view_invites import ListInvites
from .views.send_invite import CreateInviteView
from .views.send_reminder import SendReminder

app_name = 'invites'
urlpatterns = [
    path('overview/', ListInvites.as_view(), name='list_invites'),
    path('send/', CreateInviteView.as_view(), name='send'),
    path('reminder/', SendReminder.as_view(), name='reminder'),
]
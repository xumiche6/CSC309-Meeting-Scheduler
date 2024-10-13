from django.urls import path
from .views import (
    ScheduleCreateView,
    ScheduleDetailView,
    ScheduleListView,
    MeetingCreateView,
    MeetingDetailView,
    MeetingListView,
    MeetingUpdateView,
    MeetingUpdateInviteeResponseView
)

urlpatterns = [
    path('add/', ScheduleCreateView.as_view(), name='create_schedule'),
    path('all/', ScheduleListView.as_view(), name='schedule_list'),
    path('<int:pk>/details/', ScheduleDetailView.as_view(), name='schedule_details'),
    path('<int:schedule_id>/meetings/add/', MeetingCreateView.as_view(), name='create_meeting'),
    path('meeting/<int:pk>/details/', MeetingDetailView.as_view(), name='meeting_details'),
    path('<int:schedule_id>/meetings/all/', MeetingListView.as_view(), name='meeting_list'),
    path('meeting/<int:pk>/update_confirmation/', MeetingUpdateView.as_view(), name='update_confirmation'),
    path('meeting/<int:pk>/update_invitee_response/', MeetingUpdateInviteeResponseView.as_view(), name='update_invitee_response'),
]

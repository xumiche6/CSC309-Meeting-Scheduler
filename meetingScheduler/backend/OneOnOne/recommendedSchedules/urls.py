# urls.py in the "schedule" app
from django.urls import path
from .views import RecommendedSchedulesView

urlpatterns = [
    path('recommendedSchedules/', RecommendedSchedulesView.as_view(), name='recommend_schedules'),
]

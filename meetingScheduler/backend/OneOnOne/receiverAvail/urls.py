from django.urls import path
from .views import ListAvails, CreateAvail, UpdateAvail, DeleteAvail

app_name = 'receiver_avails'
urlpatterns = [
    path('overview/', ListAvails.as_view(), name='list_avails'),
    path('create/', CreateAvail.as_view(), name='create'),
    path('<int:pk>/update/', UpdateAvail.as_view(), name='update'),
    path('<int:pk>/delete/', DeleteAvail.as_view(), name='delete'),
]
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AvailabilitiesViewSet

router = DefaultRouter()
router.register('availabilities', AvailabilitiesViewSet, basename='availabilities')

urlpatterns = [
    path('<str:availability_type>/availability/create/', AvailabilitiesViewSet.as_view({'post': 'create'}), name='create_availability'),
    path('<str:availability_type>/availability/list/', AvailabilitiesViewSet.as_view({'get': 'list'}), name='list_availabilities'),
    path('<str:availability_type>/availability/delete/<int:pk>/', AvailabilitiesViewSet.as_view({'delete': 'destroy'}), name='delete_availabilities'),
]

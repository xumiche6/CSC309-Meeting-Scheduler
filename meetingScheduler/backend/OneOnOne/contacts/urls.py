from django.urls import path
from .views import ContactList, ContactCreate, ContactUpdate, ContactDelete

urlpatterns = [
    path("list/", ContactList.as_view(), name="contact-list"),
    path("create/", ContactCreate.as_view(), name="contact-create"),
    path('<int:pk>/update/', ContactUpdate.as_view(), name='contact-update'),
    path('<int:pk>/delete/', ContactDelete.as_view(), name='contact-delete'),
]

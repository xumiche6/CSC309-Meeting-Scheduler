from django.urls import path
from .views import UserCreate, UserDetail, LoginView, LogoutView, UserEditView

urlpatterns = [
    path("register/", UserCreate.as_view(), name="user-register"),
    path("me/", UserDetail.as_view(), name="user-detail"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("edit/", UserEditView.as_view(), name="user-edit"),
]

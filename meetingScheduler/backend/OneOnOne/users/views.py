from django.shortcuts import render, get_object_or_404
from rest_framework import status, generics, permissions, views
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, LoginSerializer
from django.contrib.auth.models import update_last_login
from rest_framework.permissions import IsAuthenticated
from .models import User


class UserCreate(APIView):
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            response = Response(
                {
                    "user": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
            response.set_cookie(
                "refresh_token",
                str(refresh),
                httponly=True,
                secure=True,
                samesite="None",
            )
            response.set_cookie(
                "access_token",
                str(refresh.access_token),
                httponly=True,
                secure=True,
                samesite="None",
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetail(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class LoginView(views.APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        update_last_login(None, user)

        response = Response(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                },
            },
            status=status.HTTP_200_OK,
        )
        response.set_cookie(
            "refresh_token", str(refresh), httponly=True, secure=True, samesite="Lax"
        )
        response.set_cookie(
            "access_token",
            str(refresh.access_token),
            httponly=True,
            secure=True,
            samesite="None",
        )

        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response(
            {"detail": "Successfully logged out."}, status=status.HTTP_200_OK
        )
        response.delete_cookie("refresh_token")
        response.delete_cookie("access_token")
        return response


class UserEditView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        # Overriding this method to return the current user
        # Ensures a user can only update their own information
        user = get_object_or_404(User, pk=self.request.user.pk)
        return user

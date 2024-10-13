from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Contact
from .serializers import ContactSerializer


class ContactList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        contacts = Contact.objects.filter(user=request.user)
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)


class ContactCreate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = ContactSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContactUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk, format=None):
        try:
            contact = Contact.objects.get(pk=pk, user=request.user)
        except Contact.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ContactSerializer(contact, data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ContactDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, format=None):
        try:
            contact = Contact.objects.get(pk=pk, user=request.user)
        except Contact.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"message": "Contact not found."})
        contact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data={"message": "Contact deleted."})
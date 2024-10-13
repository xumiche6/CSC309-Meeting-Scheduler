from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import Invite
from ..serializers import InviteSerializer
from rest_framework.permissions import IsAuthenticated

class ListInvites(APIView):
    """
    Lists all the invites of the currently logged in user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        invites = Invite.objects.filter(sender=request.user.id)
        serializer = InviteSerializer(invites, many=True)
        return Response(serializer.data)

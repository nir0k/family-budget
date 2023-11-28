from django.contrib.auth import update_session_auth_hash
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import IsAdmin, IsAdminOrFamilyMember

from .models import User
from .serializers import (ChangePasswordSerializer, ProfileSerializers,
                          UserSerializer)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = None
    permission_classes = [IsAdminOrFamilyMember]


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializers(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileSerializers(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        serializer = ProfileSerializers(request.user,
                                        data=request.data,
                                        partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method == 'POST':
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data.get('current_password')):
                user.set_password(serializer.data.get('new_password'))
                user.save()
                update_session_auth_hash(request, user)
                return Response({'message': 'Password changed successfully.'},
                                status=status.HTTP_200_OK)
            return Response({'error': 'Incorrect current password.'},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TelegramAuthView(APIView):
    permission_classes = [IsAdmin,]

    def post(self, request, *args, **kwargs):
        telegram_userid = request.data.get("telegram_userid")

        try:
            user = User.objects.get(telegram_userid=telegram_userid)
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        except User.DoesNotExist:
            return Response({"error": "User not found"},
                            status=status.HTTP_404_NOT_FOUND)

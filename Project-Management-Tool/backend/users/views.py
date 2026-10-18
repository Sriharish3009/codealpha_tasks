from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):

    serializer_class = RegisterSerializer

    permission_classes = [AllowAny]



class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.all().order_by('username')
        username = self.request.query_params.get('username')

        if username:
            queryset = queryset.filter(username__iexact=username)

        return queryset

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(
            recipient=self.request.user
        )

    def perform_update(self, serializer):
        notification = self.get_object()

        if notification.recipient != self.request.user:
            raise PermissionDenied(
                "You can only update your own notifications."
            )

        serializer.save()

    def perform_destroy(self, instance):
        if instance.recipient != self.request.user:
            raise PermissionDenied(
                "You can only delete your own notifications."
            )

        instance.delete()
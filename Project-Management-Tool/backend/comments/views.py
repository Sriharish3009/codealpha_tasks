from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Comment
from .serializers import CommentSerializer
from projects.models import ProjectMember


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Comment.objects.filter(
            task__project__members=self.request.user
        )

        task_id = self.request.query_params.get('task')

        if task_id:
            queryset = queryset.filter(
                task_id=task_id
            )

        return queryset

    def perform_create(self, serializer):
        task = serializer.validated_data['task']

        is_member = ProjectMember.objects.filter(
            project=task.project,
            user=self.request.user
        ).exists()

        if not is_member:
            raise ValidationError(
                "You must be a member of the project to comment."
            )

        serializer.save(
            user=self.request.user
        )

    def perform_update(self, serializer):
        comment = self.get_object()

        if comment.user != self.request.user:
            raise ValidationError(
                "You can only edit your own comments."
            )

        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise ValidationError(
                "You can only delete your own comments."
            )

        instance.delete()
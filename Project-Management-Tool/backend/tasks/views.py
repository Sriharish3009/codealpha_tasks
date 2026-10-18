from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, PermissionDenied

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Task
from .serializers import TaskSerializer
from projects.models import ProjectMember
from notifications.models import Notification

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(
            project__members=self.request.user
        )

        project_id = self.request.query_params.get('project')

        if project_id:
            queryset = queryset.filter(
                project_id=project_id
            )

        my_tasks = self.request.query_params.get('my_tasks')

        if my_tasks == 'true':
            queryset = queryset.filter(
                assigned_to=self.request.user
            )

        return queryset

    def perform_create(self, serializer):
        project = serializer.validated_data['project']

        is_member = ProjectMember.objects.filter(
            project=project,
            user=self.request.user
        ).exists()

        if not is_member:
            raise ValidationError(
                "You must be a member of the project to create a task."
            )

        assigned_to = serializer.validated_data.get('assigned_to')

        if assigned_to:
            assigned_member = ProjectMember.objects.filter(
                project=project,
                user=assigned_to
            ).exists()

            if not assigned_member:
                raise ValidationError(
                    "The assigned user must be a member of the project."
                )

        task = serializer.save()

        if assigned_to:
            notification = Notification.objects.create(
                recipient=assigned_to,
                message=f"You were assigned a new task: {task.title}",
                notification_type='task_assigned',
                task=task,
                project=project
            )
            print(
                "SENDING REAL-TIME NOTIFICATION TO:",
                f"user_{assigned_to.id}"
            )
            channel_layer = get_channel_layer()

            async_to_sync(
                channel_layer.group_send
            )(
                f"user_{assigned_to.id}",
                {
                    "type": "notification_message",
                    "message": notification.message,
                    "notification_type": notification.notification_type,
                    "task": task.id,
                    "project": project.id,
                }
            )

    def perform_update(self, serializer):
        old_task = serializer.instance
        old_project = old_task.project

        project = serializer.validated_data.get(
            'project',
            old_project
        )

        is_member = ProjectMember.objects.filter(
            project=project,
            user=self.request.user
        ).exists()

        if not is_member:
            raise PermissionDenied(
                "You must be a member of the project to update this task."
            )

        assigned_to = serializer.validated_data.get(
            'assigned_to',
            old_task.assigned_to
        )

        if assigned_to:
            assigned_member = ProjectMember.objects.filter(
                project=project,
                user=assigned_to
            ).exists()

            if not assigned_member:
                raise ValidationError(
                    "The assigned user must be a member of the project."
                )

        old_assigned_to = old_task.assigned_to

        task = serializer.save()

        if assigned_to and (
            old_assigned_to is None
            or old_assigned_to.id != assigned_to.id
        ):
            notification = Notification.objects.create(
                recipient=assigned_to,
                message=f"You were assigned a task: {task.title}",
                notification_type='task_assigned',
                task=task,
                project=project
            )

            channel_layer = get_channel_layer()

            async_to_sync(
                channel_layer.group_send
            )(
                f"user_{assigned_to.id}",
                {
                    "type": "notification_message",
                    "message": notification.message,
                    "notification_type": notification.notification_type,
                    "task": task.id,
                    "project": project.id,
                }
            )

    def perform_destroy(self, instance):
        instance.delete()
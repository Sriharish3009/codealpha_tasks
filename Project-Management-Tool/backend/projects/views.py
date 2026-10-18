from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from rest_framework.exceptions import PermissionDenied

from .models import Project, ProjectMember
from .serializers import ProjectSerializer, ProjectMemberSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(
            members=self.request.user
        )

    def perform_create(self, serializer):
        project = serializer.save(
            created_by=self.request.user
        )

        ProjectMember.objects.create(
            project=project,
            user=self.request.user,
            role='admin'
        )

    def _is_project_admin(self, project):
        return ProjectMember.objects.filter(
            project=project,
            user=self.request.user,
            role='admin'
        ).exists()

    def perform_update(self, serializer):
        project = self.get_object()

        if not self._is_project_admin(project):
            raise PermissionDenied(
                "Only project admins can update this project."
            )

        serializer.save()

    def perform_destroy(self, instance):
        if not self._is_project_admin(instance):
            raise PermissionDenied(
                "Only project admins can delete this project."
            )

        instance.delete()


class ProjectMemberViewSet(viewsets.ModelViewSet):
    queryset = ProjectMember.objects.all()
    serializer_class = ProjectMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProjectMember.objects.filter(
            project__members=self.request.user
        )

    def _is_project_admin(self, project):
        return ProjectMember.objects.filter(
            project=project,
            user=self.request.user,
            role='admin'
        ).exists()

    def perform_create(self, serializer):
        project = serializer.validated_data['project']

        if not self._is_project_admin(project):
            raise PermissionDenied(
                "Only project admins can add members."
            )

        serializer.save()

    def perform_update(self, serializer):
        membership = self.get_object()

        if not self._is_project_admin(
            membership.project
        ):
            raise PermissionDenied(
                "Only project admins can update members."
            )

        serializer.save()

    def perform_destroy(self, instance):
        if not self._is_project_admin(
            instance.project
        ):
            raise PermissionDenied(
                "Only project admins can remove members."
            )

        instance.delete()
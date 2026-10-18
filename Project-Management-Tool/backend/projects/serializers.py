from rest_framework import serializers
from .models import Project, ProjectMember


class ProjectMemberSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    project_name = serializers.CharField(
        source='project.name',
        read_only=True
    )

    class Meta:
        model = ProjectMember
        fields = [
            'id',
            'project',
            'project_name',
            'user',
            'username',
            'role',
            'joined_at',
        ]


class ProjectSerializer(serializers.ModelSerializer):

    created_by_username = serializers.CharField(
        source='created_by.username',
        read_only=True
    )

    members = ProjectMemberSerializer(
        source='project_members',
        many=True,
        read_only=True
    )

    tasks = serializers.SerializerMethodField()

    def get_tasks(self, obj):
        return list(
            obj.tasks.all().values(
                'id',
                'title',
                'description',
                'assigned_to',
                'status',
                'priority',
                'due_date',
                'created_at',
                'updated_at'
            )
        )

    class Meta:
        model = Project

        fields = [
            'id',
            'name',
            'description',
            'created_by',
            'created_by_username',
            'members',
            'tasks',
            'created_at',
        ]

        read_only_fields = [
            'created_by'
        ]
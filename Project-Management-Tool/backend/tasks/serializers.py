from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):

    assigned_to_username = serializers.CharField(
        source='assigned_to.username',
        read_only=True
    )

    class Meta:
        model = Task
        fields = [
            'id',
            'project',
            'title',
            'description',
            'assigned_to',
            'assigned_to_username',
            'status',
            'priority',
            'due_date',
            'created_at',
            'updated_at',
        ]
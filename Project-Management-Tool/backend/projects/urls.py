
from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet, ProjectMemberViewSet

router = DefaultRouter()

router.register(
    'members',
    ProjectMemberViewSet,
    basename='project-member'
)

router.register(
    '',
    ProjectViewSet,
    basename='project'
)

urlpatterns = router.urls

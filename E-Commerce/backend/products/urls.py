from django.urls import path
from .views import (
    ProductListCreateView,
    ProductDetailView,
    register_user,
    login_user,
    create_order,
    order_history
)
urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path("orders/", create_order, name="create-order"),
    path("orders/history/", order_history, name="order-history"),
]
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/", views.register),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", views.home, name="home"),
    path("products/", views.get_products, name="get_products"),
    path("products/<int:product_id>/", views.get_product_detail, name="get_product_detail"),
    path("category/", views.get_category, name="get_category"),
    path("cart/", views.get_cart, name="get_cart"),
    path("cart/add/", views.add_to_cart, name="add_to_cart"),
    path("cart/remove/", views.remove_from_cart, name="remove_from_cart"),
    path("cart/update-quantity/", views.update_cart_quantity, name="update_cart_quantity"),
    path("orders/create/", views.create_order, name="create_order"),
    path("orders/history/", views.order_history, name="order_history"),
]
from django.urls import path
from . import views

urlpatterns=[
    path('', views.home, name='home'),
    path('products/', views.get_products, name='get_products'),
    path('products/<int:product_id>/', views.get_product_detail, name='get_product_detail'),
    path('category/', views.get_category, name='get_category'),
    path('cart/', views.get_cart, name='get_cart'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/update-quantity/', views.update_cart_quantity, name='update_cart_quantity'),
    path('orders/create/', views.create_order, name='create_order'),
]
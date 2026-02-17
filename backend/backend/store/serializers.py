from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Product, Cart, CartItem, Order
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class ProductSerializer(serializers.ModelSerializer):
    category=CategorySerializer(read_only=True)
    class Meta:
        model = Product
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_name=serializers.CharField(source='product.name', read_only=True)
    product_price=serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image=serializers.ImageField(source='product.image', read_only=True)
    class Meta:
        model = CartItem
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):
    items=CartItemSerializer(many=True, read_only=True)
    total=serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    class Meta:
        model = Cart
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ["id", "product", "quantity", "total_price", "created_at"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password2']

    def validate(self, data):
        if data.get('password') != data.get('password2'):
            raise serializers.ValidationError("Password do not match")
        return data

    def create(self, validated_data):
        # Remove password2, it is only used for confirmation
        validated_data.pop('password2', None)
        username = validated_data.get('username')
        email = validated_data.get('email', '')
        password = validated_data.get('password')
        user = User.objects.create_user(username=username, email=email, password=password)
        return user
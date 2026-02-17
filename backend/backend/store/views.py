from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import Category, Product, Cart, CartItem, Order, OrderItem, UserProfile
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    CartSerializer,
    CartItemSerializer,
    UserSerializer,
    UserRegistrationSerializer,
    OrderSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status



def home(request):
    return JsonResponse({"message": "Welcome to the store API!"})

####Product Views
def get_products(request):
    products = list(Product.objects.values('id', 'name', 'description', 'price', 'created_at', 'image'))
    for p in products:
        p['image'] = (settings.MEDIA_URL + p['image']) if p.get('image') else None
    return JsonResponse(products, safe=False)


def get_category(request):
    categories = list(Category.objects.values('id', 'name', 'slug'))
    return JsonResponse(categories, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_product_detail(request, product_id):
    try:
       product=Product.objects.get(id=product_id)
       serializer=ProductSerializer(product)
       return Response(serializer.data)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)
    
####Cart Views - Helper function to get or create user for session
def get_or_create_session_user(request):
    """Get or create a user for anonymous sessions"""
    if request.user.is_authenticated:
        return request.user
    
    # For anonymous users, use session key to create/get a temporary user
    session_key = request.session.session_key
    if not session_key:
        request.session.create()
        session_key = request.session.session_key
    
    username = f'anonymous_{session_key[:8]}'
    user, created = User.objects.get_or_create(
        username=username,
        defaults={'email': '', 'is_active': True}
    )
    return user

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    try:
        user = get_or_create_session_user(request)
        cart, created = Cart.objects.get_or_create(user=user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    try:
        product = Product.objects.get(id=product_id)
        user = get_or_create_session_user(request)
        cart, created = Cart.objects.get_or_create(user=user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    product_id = request.data.get('product_id')
    try:
        product = Product.objects.get(id=product_id)
        user = get_or_create_session_user(request)
        cart = Cart.objects.get(user=user)
        cart_item = CartItem.objects.get(cart=cart, product=product)
        cart_item.delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except (Product.DoesNotExist, Cart.DoesNotExist, CartItem.DoesNotExist):
        return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response({'error': 'Item ID and quantity are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        item = CartItem.objects.get(id=item_id)
        quantity = int(quantity)
        if quantity < 1:
            item.delete()
            return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)

        item.quantity = quantity
        item.save()
        serializer = CartItemSerializer(item)
        return Response(serializer.data)
    except CartItem.DoesNotExist:
        return Response({'error': 'cart item not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    data = request.data
    name = data.get('name')
    address = data.get('address')
    phone = data.get('phone')
    payment_method = data.get('payment_method', 'COD')

    # Basic validation
    if not name or not address or not phone:
        return Response(
            {'error': 'Name, address and phone are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Validate phone number
    if not phone.isdigit() or len(phone) < 10:
        return Response({'error': 'Invalid phone number'}, status=status.HTTP_400_BAD_REQUEST)

    # Get the session user (works for both authenticated and anonymous users)
    user = get_or_create_session_user(request)

    # Update / create basic profile data
    UserProfile.objects.update_or_create(
        user=user,
        defaults={
            'address': address,
            'phone_number': phone,
        },
    )

    # Get user's cart
    cart, created = Cart.objects.get_or_create(user=user)
    if not cart.items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    created_orders = []

    # Create an Order entry for each cart item
    for item in cart.items.all():
        line_total = item.product.price * item.quantity
        order = Order.objects.create(
            user=user if user.is_authenticated else None,
            product=item.product,
            quantity=item.quantity,
            total_price=line_total,
        )
        created_orders.append(order.id)

    # Clear the cart after creating orders
    cart.items.all().delete()

    return Response(
        {
            'message': 'Order created successfully',
            'order_ids': created_orders,
            'payment_method': payment_method,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):
    """
    Return a list of orders for the authenticated user, most recent first.
    """
    orders = (
        Order.objects.filter(user=request.user)
        .select_related("product")
        .order_by("-created_at")
    )
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    User registration endpoint (JWT-compatible).

    Allows anonymous users to create an account and returns basic user data.
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user_serializer = UserSerializer(user)
        return Response(user_serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

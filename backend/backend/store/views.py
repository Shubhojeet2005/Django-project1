from django.conf import settings
from django.http import JsonResponse
from .models import Category, Product,Cart, CartItem
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CategorySerializer, ProductSerializer,CartSerializer, CartItemSerializer



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
def get_product_detail(request, product_id):
    try:
       product=Product.objects.get(id=product_id)
       serializer=ProductSerializer(product)
       return Response(serializer.data)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)
    
####Cart Views
@api_view(['GET'])
def get_cart(request):
    cart,created=Cart.objects.get_or_create(user=request.user)
    serializer=CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
def add_to_cart(request):
    product_id=request.data.get('product_id')
    quantity=request.data.get('quantity',1)
    try:
        product=Product.objects.get(id=product_id)
        cart,created=Cart.objects.get_or_create(user=request.user)
        cart_item,created=CartItem.objects.get_or_create(cart=cart, product=product)
        cart_item.quantity += quantity
        cart_item.save()
        serializer=CartSerializer(cart)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)
    
@api_view(['POST'])
def remove_from_cart(request):
    product_id=request.data.get('product_id')
    try:
        product=Product.objects.get(id=product_id)
        cart=Cart.objects.get(user=request.user)
        cart_item=CartItem.objects.get(cart=cart, product=product)
        cart_item.delete()
        serializer=CartSerializer(cart)
        return Response(serializer.data)
    except (Product.DoesNotExist, Cart.DoesNotExist, CartItem.DoesNotExist):
        return JsonResponse({'error': 'Item not found in cart'}, status=404)

@api_view(['POST'])
def update_cart_quantity(request):
    item_id=request.data.get('item_id')
    quantity=request.data.get('quantity')

    if not item_id or quantity is None:
        return Response({'error': 'Item ID and quantity are required'},status=400)

    try:
        item=CartItem.objects.get(id=item_id)
        if int(quantity)<1:
            item.delete()
            return Response({'error': 'Quantity must be at leat 1'},status=400)
        
        item.quantity=quantity
        item.save()
        serializer=CartItemSerializer(item)
        return Response(serializer.data)
    except CartItem.DoesNotExist:
        return Response({'error': 'cart item not found'},status=404)
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from rest_framework import generics

from .models import Product, Order, OrderItem
from .serializers import ProductSerializer


# =========================================
# PRODUCT API
# =========================================

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


# =========================================
# USER REGISTRATION
# =========================================

@csrf_exempt
def register_user(request):

    if request.method == "POST":

        try:
            data = json.loads(request.body)

            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            if not username or not email or not password:
                return JsonResponse({
                    "error": "All fields are required"
                }, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({
                    "error": "Username already exists"
                }, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({
                    "error": "Email already exists"
                }, status=400)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )

            return JsonResponse({
                "message": "Registration successful",
                "user_id": user.id
            }, status=201)

        except Exception as e:
            return JsonResponse({
                "error": str(e)
            }, status=400)

    return JsonResponse({
        "error": "Only POST requests are allowed"
    }, status=405)


# =========================================
# USER LOGIN
# =========================================

@csrf_exempt
def login_user(request):

    if request.method == "POST":

        try:
            data = json.loads(request.body)

            username = data.get("username")
            password = data.get("password")

            if not username or not password:
                return JsonResponse({
                    "error": "Username and password are required"
                }, status=400)

            user = authenticate(
                request,
                username=username,
                password=password
            )

            if user is not None:

                login(request, user)

                return JsonResponse({
                    "message": "Login successful",
                    "username": user.username
                })

            return JsonResponse({
                "error": "Invalid username or password"
            }, status=401)

        except Exception as e:
            return JsonResponse({
                "error": str(e)
            }, status=400)

    return JsonResponse({
        "error": "Only POST requests are allowed"
    }, status=405)


# =========================================
# CREATE ORDER
# =========================================

@csrf_exempt
def create_order(request):

    if request.method != "POST":
        return JsonResponse({
            "error": "Only POST requests are allowed"
        }, status=405)

    try:

        data = json.loads(request.body)

        username = data.get("username")
        full_name = data.get("full_name")
        email = data.get("email")
        phone = data.get("phone")
        address = data.get("address")
        city = data.get("city")
        pincode = data.get("pincode")
        items = data.get("items")

        # Check user
        if not username:
            return JsonResponse({
                "error": "User is required"
            }, status=400)

        user = User.objects.get(
            username=username
        )

        # Check cart
        if not items:
            return JsonResponse({
                "error": "Cart is empty"
            }, status=400)

        # =========================================
        # CALCULATE TOTAL
        # =========================================

        total_amount = 0

        for item in items:

            total_amount += (
                float(item["price"]) *
                int(item["quantity"])
            )

        # =========================================
        # CHECK STOCK BEFORE CREATING ORDER
        # =========================================

        for item in items:

            product = Product.objects.get(
                id=item["id"]
            )

            quantity = int(
                item["quantity"]
            )

            if product.stock < quantity:

                return JsonResponse({
                    "error":
                    f"Not enough stock for {product.name}"
                }, status=400)

        # =========================================
        # CREATE ORDER
        # =========================================

        order = Order.objects.create(
            user=user,
            full_name=full_name,
            email=email,
            phone=phone,
            address=address,
            city=city,
            pincode=pincode,
            total_amount=total_amount
        )

        # =========================================
        # CREATE ORDER ITEMS
        # AND REDUCE STOCK
        # =========================================

        for item in items:

            product = Product.objects.get(
                id=item["id"]
            )

            quantity = int(
                item["quantity"]
            )

            # Reduce stock
            product.stock -= quantity
            product.save()

            # Create order item
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=item["price"]
            )

        # =========================================
        # SUCCESS RESPONSE
        # =========================================

        return JsonResponse({
            "message": "Order created successfully",
            "order_id": order.id
        }, status=201)

    # =========================================
    # USER NOT FOUND
    # =========================================

    except User.DoesNotExist:

        return JsonResponse({
            "error": "User not found"
        }, status=404)

    # =========================================
    # PRODUCT NOT FOUND
    # =========================================

    except Product.DoesNotExist:

        return JsonResponse({
            "error": "Product not found"
        }, status=404)

    # =========================================
    # OTHER ERRORS
    # =========================================

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        }, status=400)


# =========================================
# ORDER HISTORY
# =========================================

@csrf_exempt
def order_history(request):

    if request.method != "GET":

        return JsonResponse({
            "error": "Only GET requests are allowed"
        }, status=405)

    try:

        username = request.GET.get("username")

        if not username:

            return JsonResponse({
                "error": "Username is required"
            }, status=400)

        user = User.objects.get(
            username=username
        )

        orders = Order.objects.filter(
            user=user
        ).order_by("-created_at")

        order_list = []

        for order in orders:

            items = []

            for item in order.items.all():

                items.append({
                    "product_name":
                        item.product.name,

                    "quantity":
                        item.quantity,

                    "price":
                        float(item.price)
                })

            order_list.append({

                "id":
                    order.id,

                "full_name":
                    order.full_name,

                "total_amount":
                    float(order.total_amount),

                "status":
                    order.status,

                "created_at":
                    order.created_at.strftime(
                        "%d-%m-%Y %H:%M"
                    ),

                "items":
                    items
            })

        return JsonResponse(
            order_list,
            safe=False
        )

    except User.DoesNotExist:

        return JsonResponse({
            "error": "User not found"
        }, status=404)

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        }, status=400)
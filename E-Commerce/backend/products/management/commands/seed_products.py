from django.core.management.base import BaseCommand
from products.models import Product


class Command(BaseCommand):
    help = "Add sample products to the database"

    def handle(self, *args, **kwargs):

        products = [
            {
                "name": "Samsung Galaxy Smartphone",
                "description": "Modern smartphone with a high quality display and powerful performance.",
                "price": 24999,
                "category": "Mobiles",
                "stock": 20,
            },
            {
                "name": "Wireless Bluetooth Headphones",
                "description": "Comfortable wireless headphones with clear sound and long battery life.",
                "price": 1999,
                "category": "Audio",
                "stock": 35,
            },
            {
                "name": "HP Laptop",
                "description": "Powerful laptop suitable for students, work and everyday use.",
                "price": 54999,
                "category": "Laptops",
                "stock": 15,
            },
            {
                "name": "Apple iPad",
                "description": "Portable tablet with a high resolution display.",
                "price": 39999,
                "category": "Tablets",
                "stock": 12,
            },
            {
                "name": "Smart Watch",
                "description": "Smart watch with notifications, fitness tracking and multiple features.",
                "price": 2999,
                "category": "Wearables",
                "stock": 30,
            },
            {
                "name": "Mechanical Keyboard",
                "description": "Mechanical keyboard designed for comfortable typing and gaming.",
                "price": 2499,
                "category": "Computer Accessories",
                "stock": 25,
            },
            {
                "name": "Wireless Mouse",
                "description": "Ergonomic wireless mouse suitable for work and everyday use.",
                "price": 899,
                "category": "Computer Accessories",
                "stock": 40,
            },
            {
                "name": "USB-C Fast Charging Cable",
                "description": "Durable USB-C cable for charging and data transfer.",
                "price": 499,
                "category": "Accessories",
                "stock": 60,
            },
            {
                "name": "Running Shoes",
                "description": "Comfortable lightweight shoes suitable for running and everyday activities.",
                "price": 2999,
                "category": "Footwear",
                "stock": 25,
            },
            {
                "name": "Casual Cotton T-Shirt",
                "description": "Comfortable cotton T-shirt for casual everyday wear.",
                "price": 799,
                "category": "Fashion",
                "stock": 50,
            },
            {
                "name": "Denim Jeans",
                "description": "Classic denim jeans with a comfortable fit.",
                "price": 1599,
                "category": "Fashion",
                "stock": 30,
            },
            {
                "name": "Travel Backpack",
                "description": "Spacious backpack suitable for college, travel and daily use.",
                "price": 1299,
                "category": "Bags",
                "stock": 25,
            },
            {
                "name": "Smart LED TV",
                "description": "Large smart television with streaming and internet connectivity.",
                "price": 32999,
                "category": "Television",
                "stock": 10,
            },
            {
                "name": "Portable Bluetooth Speaker",
                "description": "Compact Bluetooth speaker with powerful audio output.",
                "price": 1499,
                "category": "Audio",
                "stock": 30,
            },
            {
                "name": "Power Bank",
                "description": "Portable power bank for charging smartphones and other devices.",
                "price": 1299,
                "category": "Accessories",
                "stock": 45,
            },
            {
                "name": "Gaming Controller",
                "description": "Wireless gaming controller compatible with supported devices.",
                "price": 2499,
                "category": "Gaming",
                "stock": 18,
            },
            {
                "name": "Office Chair",
                "description": "Comfortable ergonomic chair suitable for study and office work.",
                "price": 6999,
                "category": "Furniture",
                "stock": 8,
            },
            {
                "name": "Table Lamp",
                "description": "Modern LED table lamp suitable for study and workspace.",
                "price": 999,
                "category": "Home",
                "stock": 35,
            },
            {
                "name": "Coffee Maker",
                "description": "Compact coffee maker designed for convenient home use.",
                "price": 3499,
                "category": "Home Appliances",
                "stock": 12,
            },
            {
                "name": "Air Purifier",
                "description": "Home air purifier designed to help improve indoor air quality.",
                "price": 8999,
                "category": "Home Appliances",
                "stock": 10,
            },
    ]

        for product_data in products:
            product, created = Product.objects.get_or_create(
                name=product_data["name"],
                defaults=product_data,
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Added: {product.name}"
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"Already exists: {product.name}"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                "Product seeding completed successfully!"
            )
        )
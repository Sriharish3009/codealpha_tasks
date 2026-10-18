const API_URL = "http://127.0.0.1:8000/api/products/products/";

async function loadProduct() {
    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");

        if (!productId) {
            document.getElementById("product-details").innerHTML =
                "<h2>Product not found</h2>";
            return;
        }

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const products = await response.json();

        const product = products.find(
            product => product.id == productId
        );

        if (!product) {
            document.getElementById("product-details").innerHTML =
                "<h2>Product not found</h2>";
            return;
        }

        let imageHTML = "";

        if (product.image) {
            imageHTML = `
                <img
                    src="${product.image}"
                    alt="${product.name}"
                >
            `;
        } else {
            imageHTML = `
                <div class="no-image">
                    No Image
                </div>
            `;
        }

        document.getElementById("product-details").innerHTML = `
            <div class="details-image">
                ${imageHTML}
            </div>

            <div class="details-info">

                <h2>${product.name}</h2>

                <div class="details-price">
                    ₹${product.price}
                </div>

                <p>
                    <strong>Category:</strong>
                    ${product.category}
                </p>

                <p>
                    ${product.description}
                </p>

                <button
    class="add-cart-btn"
    onclick="addToCart(${product.id})"
>
    Add to Cart
</button>

            </div>
        `;

    } catch (error) {
        console.error("Error loading product:", error);

        document.getElementById("product-details").innerHTML =
            "<h2>Unable to load product</h2>";
    }
}

loadProduct();
function addToCart(productId) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = {
        image: document.querySelector(".details-image img")?.src || "",
        id: productId,
        name: document.querySelector(".details-info h2").textContent,
        price: document
            .querySelector(".details-price")
            .textContent
            .replace("₹", ""),
        category: document
            .querySelector(".details-info p")
            .textContent
            .replace("Category:", "")
            .trim(),
        quantity: 1
    };

    const existingProduct = cart.find(
        item => item.id == productId
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push(product);
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Product added to cart! 🛒");
}
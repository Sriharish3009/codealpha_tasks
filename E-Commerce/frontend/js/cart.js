let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayCart() {

    const cartContainer = document.getElementById("cart-items");
    const summary = document.getElementById("cart-summary");

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty 🛒</h3>

                <p>Add some products to your cart!</p>

                <a href="index.html">
                    Continue Shopping
                </a>
            </div>
        `;

        summary.innerHTML = `
            <h3>Total: ₹0</h3>
        `;

        return;
    }

    cartContainer.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        const price = parseFloat(item.price);

        const itemTotal = price * item.quantity;

        total += itemTotal;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-image">

                ${
                    item.image
                    ? `<img src="${item.image}" alt="${item.name}">`
                    : `<div class="no-image">No Image</div>`
                }

            </div>

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>
                    Category: ${item.category}
                </p>

                <p class="cart-item-price">
                    ₹${price.toFixed(2)}
                </p>

            </div>

            <div class="quantity-controls">

                <button onclick="decreaseQuantity(${index})">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>

            <div class="cart-item-total">

                <strong>
                    ₹${itemTotal.toFixed(2)}
                </strong>

                <button
                    class="remove-btn"
                    onclick="removeItem(${index})"
                >
                    Remove
                </button>

            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    summary.innerHTML = `

        <h3>
            Total: ₹${total.toFixed(2)}
        </h3>

        <button id="checkout-btn"
        onclick="window.location.href='checkout.html'">
            Proceed to Checkout
        </button>
    `;
}


function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();
}


function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }

    saveCart();
}


function removeItem(index) {

    cart.splice(index, 1);

    saveCart();
}


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


displayCart();
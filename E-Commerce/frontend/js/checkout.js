let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayCheckout() {

    const itemsContainer =
        document.getElementById("checkout-items");

    const totalElement =
        document.getElementById("checkout-total");

    if (cart.length === 0) {

        itemsContainer.innerHTML = `
            <p>Your cart is empty.</p>

            <a href="index.html">
                Continue Shopping
            </a>
        `;

        totalElement.textContent = "₹0";

        return;
    }

    let total = 0;

    itemsContainer.innerHTML = "";

    cart.forEach(item => {

        const price = parseFloat(item.price);

        const itemTotal =
            price * item.quantity;

        total += itemTotal;

        const itemElement =
            document.createElement("div");

        itemElement.className =
            "checkout-item";

        itemElement.innerHTML = `
            <div>
                <strong>${item.name}</strong>

                <p>
                    ₹${price.toFixed(2)}
                    ×
                    ${item.quantity}
                </p>
            </div>

            <strong>
                ₹${itemTotal.toFixed(2)}
            </strong>
        `;

        itemsContainer.appendChild(itemElement);
    });

    totalElement.textContent =
        `₹${total.toFixed(2)}`;
}


document
    .getElementById("checkout-form")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const username =
                localStorage.getItem("username");

            if (!username) {

                alert(
                    "Please login before checkout."
                );

                window.location.href =
                    "login.html";

                return;
            }

            if (cart.length === 0) {

                alert("Your cart is empty.");

                return;
            }


            // Get delivery details

            const deliveryDetails = {

                username: username,

                full_name:
                    document
                        .getElementById("name")
                        .value,

                email:
                    document
                        .getElementById("email")
                        .value,

                phone:
                    document
                        .getElementById("phone")
                        .value,

                address:
                    document
                        .getElementById("address")
                        .value,

                city:
                    document
                        .getElementById("city")
                        .value,

                pincode:
                    document
                        .getElementById("pincode")
                        .value
            };


            // Save delivery details temporarily

            localStorage.setItem(
                "deliveryDetails",
                JSON.stringify(
                    deliveryDetails
                )
            );


            // Go to demo payment

            window.location.href =
                "payment.html";
        }
    );


displayCheckout();
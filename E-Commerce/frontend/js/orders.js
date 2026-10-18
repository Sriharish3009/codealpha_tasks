const username = localStorage.getItem("username");

const ordersList = document.getElementById("orders-list");


// Check login
if (!username) {

    ordersList.innerHTML = `
        <p>Please login to view your orders.</p>

        <a href="login.html">
            Login
        </a>
    `;

} else {

    loadOrders();
}


// Load orders from Django API
async function loadOrders() {

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/api/products/orders/history/?username=${username}`
        );

        const orders = await response.json();


        if (!response.ok) {

            ordersList.innerHTML = `
                <p>${orders.error}</p>
            `;

            return;
        }


        if (orders.length === 0) {

            ordersList.innerHTML = `
                <div class="empty-orders">

                    <h2>
                        No Orders Yet 🛍️
                    </h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <a href="index.html">
                        Start Shopping
                    </a>

                </div>
            `;

            return;
        }


        ordersList.innerHTML = "";


        orders.forEach(order => {

            const orderCard =
                document.createElement("div");

            orderCard.className = "order-card";

            orderCard.style.cursor = "pointer";

orderCard.addEventListener("click", () => {
    window.location.href =
        `order-details.html?id=${order.id}`;
});


            let itemsHTML = "";


            order.items.forEach(item => {

                itemsHTML += `
                    <div class="order-item">

                        <span>
                            ${item.product_name}
                            × ${item.quantity}
                        </span>

                        <strong>
                            ₹${item.price.toFixed(2)}
                        </strong>

                    </div>
                `;

            });


            orderCard.innerHTML = `

                <div class="order-header">

                    <div>

                        <h2>
                            Order #${order.id}
                        </h2>

                        <p>
                            ${order.created_at}
                        </p>

                    </div>

                    <span class="order-status">
                        ${order.status}
                    </span>

                </div>


                <div class="order-items">

                    ${itemsHTML}

                </div>


                <div class="order-footer">

                    <strong>
                        Total: ₹${order.total_amount.toFixed(2)}
                    </strong>

                </div>

            `;


            ordersList.appendChild(orderCard);

        });

    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );

        ordersList.innerHTML = `
            <p>
                Unable to connect to the server.
            </p>
        `;

    }

}
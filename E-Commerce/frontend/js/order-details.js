const username = localStorage.getItem("username");

const orderDetails =
    document.getElementById("order-details");


// Get order ID from URL
const urlParams = new URLSearchParams(
    window.location.search
);

const orderId = urlParams.get("id");


// Check login
if (!username) {

    orderDetails.innerHTML = `
        <p>Please login to view your order.</p>

        <a href="login.html">
            Login
        </a>
    `;

}


// Check order ID
else if (!orderId) {

    orderDetails.innerHTML = `
        <p>Order ID not found.</p>

        <a href="orders.html">
            Back to My Orders
        </a>
    `;

}


// Load order
else {

    loadOrder();

}


async function loadOrder() {

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/api/products/orders/history/?username=${username}`
        );

        const orders = await response.json();


        if (!response.ok) {

            orderDetails.innerHTML = `
                <p>${orders.error}</p>
            `;

            return;
        }


        // Find requested order
        const order = orders.find(
            item => item.id == orderId
        );


        if (!order) {

            orderDetails.innerHTML = `
                <h2>Order not found</h2>

                <a href="orders.html">
                    Back to My Orders
                </a>
            `;

            return;
        }


        // Create order items HTML
        let itemsHTML = "";


        order.items.forEach(item => {

            const itemTotal =
                item.price * item.quantity;


            itemsHTML += `
                <div class="detail-item">

                    <div>

                        <h3>
                            ${item.product_name}
                        </h3>

                        <p>
                            Quantity: ${item.quantity}
                        </p>

                        <p>
                            Price: ₹${item.price.toFixed(2)}
                        </p>

                    </div>

                    <strong>
                        ₹${itemTotal.toFixed(2)}
                    </strong>

                </div>
            `;

        });


        // Display order details
        orderDetails.innerHTML = `

            <div class="order-detail-card">


                <!-- ORDER HEADER -->

                <div class="detail-header">

                    <div>

                        <h1>
                            Order #${order.id}
                        </h1>

                        <p>
                            Ordered on ${order.created_at}
                        </p>

                    </div>

                </div>


                <!-- ORDER STATUS TRACKING -->

                <div class="order-tracking">


                    <!-- PENDING -->

                    <div class="tracking-step ${
                        order.status === "Pending" ||
                        order.status === "Processing" ||
                        order.status === "Shipped" ||
                        order.status === "Delivered"
                            ? "active"
                            : ""
                    }">

                        <div class="tracking-circle">
                            ✓
                        </div>

                        <span>
                            Pending
                        </span>

                    </div>


                    <div class="tracking-line"></div>


                    <!-- PROCESSING -->

                    <div class="tracking-step ${
                        order.status === "Processing" ||
                        order.status === "Shipped" ||
                        order.status === "Delivered"
                            ? "active"
                            : ""
                    }">

                        <div class="tracking-circle">
                            ✓
                        </div>

                        <span>
                            Processing
                        </span>

                    </div>


                    <div class="tracking-line"></div>


                    <!-- SHIPPED -->

                    <div class="tracking-step ${
                        order.status === "Shipped" ||
                        order.status === "Delivered"
                            ? "active"
                            : ""
                    }">

                        <div class="tracking-circle">
                            ✓
                        </div>

                        <span>
                            Shipped
                        </span>

                    </div>


                    <div class="tracking-line"></div>


                    <!-- DELIVERED -->

                    <div class="tracking-step ${
                        order.status === "Delivered"
                            ? "active"
                            : ""
                    }">

                        <div class="tracking-circle">
                            ✓
                        </div>

                        <span>
                            Delivered
                        </span>

                    </div>


                </div>


                <!-- ORDER ITEMS -->

                <h2>
                    Order Items
                </h2>


                <div class="detail-items">

                    ${itemsHTML}

                </div>


                <!-- TOTAL -->

                <div class="detail-total">

                    <span>
                        Total Amount
                    </span>

                    <strong>
                        ₹${order.total_amount.toFixed(2)}
                    </strong>

                </div>


                <!-- BACK BUTTON -->

                <a
                    href="orders.html"
                    class="back-orders-btn"
                >
                    ← Back to My Orders
                </a>


            </div>

        `;

    }


    catch (error) {

       console.error(
            "Error loading order:",
            error
        );

        orderDetails.innerHTML = `
            <p>
                Unable to connect to the server.
            </p>
        `;

    }

}    
// =========================================
// PAYMENT PAGE
// =========================================

// Get cart from localStorage
const cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// Get delivery details from localStorage
const deliveryDetails =
    JSON.parse(
        localStorage.getItem("deliveryDetails")
    );


// Get HTML elements
const paymentTotal =
    document.getElementById("payment-total");

const paymentForm =
    document.getElementById("payment-form");


// =========================================
// CALCULATE TOTAL
// =========================================

function calculateTotal() {

    let total = 0;

    cart.forEach(item => {

        const price =
            parseFloat(item.price);

        const quantity =
            parseInt(item.quantity);

        total += price * quantity;

    });

    paymentTotal.textContent =
        `₹${total.toFixed(2)}`;

    return total;
}


// =========================================
// CHECK CART
// =========================================

if (cart.length === 0) {

    alert(
        "Your cart is empty."
    );

    window.location.href =
        "cart.html";
}


// =========================================
// CHECK DELIVERY DETAILS
// =========================================

if (!deliveryDetails) {

    console.error(
        "Delivery details not found."
    );

    paymentForm.innerHTML = `
        <p>
            Delivery session expired.
        </p>

        <a href="index.html">
            Return to Home
        </a>
    `;

}


// =========================================
// PAYMENT FORM
// =========================================

paymentForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        // =====================================
        // GET PAYMENT DETAILS
        // =====================================

        const cardName =
            document
                .getElementById("card-name")
                .value
                .trim();

        const cardNumber =
            document
                .getElementById("card-number")
                .value
                .trim();

        const expiry =
            document
                .getElementById("expiry")
                .value
                .trim();

        const cvv =
            document
                .getElementById("cvv")
                .value
                .trim();


        // =====================================
        // VALIDATE PAYMENT DETAILS
        // =====================================

        if (
            !cardName ||
            !cardNumber ||
            !expiry ||
            !cvv
        ) {

            alert(
                "Please fill all payment details."
            );

            return;
        }


        // Remove spaces from card number
        const cleanCardNumber =
            cardNumber.replace(/\s/g, "");


        // Check card number
        if (
            cleanCardNumber.length !== 16 ||
            !/^\d+$/.test(cleanCardNumber)
        ) {

            alert(
                "Enter a valid 16-digit demo card number."
            );

            return;
        }


        // Check CVV
        if (
            cvv.length !== 3 ||
            !/^\d+$/.test(cvv)
        ) {

            alert(
                "Enter a valid 3-digit demo CVV."
            );

            return;
        }


        // =====================================
        // CREATE TRANSACTION ID
        // =====================================

        const transactionId =
            "TXN" + Date.now();


        // =====================================
        // PREPARE ORDER DATA
        // =====================================

        const orderData = {

            username:
                deliveryDetails.username,

            full_name:
                deliveryDetails.full_name,

            email:
                deliveryDetails.email,

            phone:
                deliveryDetails.phone,

            address:
                deliveryDetails.address,

            city:
                deliveryDetails.city,

            pincode:
                deliveryDetails.pincode,

            items:
                cart

        };


        // =====================================
        // SEND ORDER TO DJANGO
        // =====================================

        try {

            const response =
                await fetch(
                    "http://127.0.0.1:8000/api/products/orders/",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                orderData
                            )
                    }
                );


            const data =
                await response.json();


            // =================================
            // ORDER CREATED SUCCESSFULLY
            // =================================
if (response.ok) {

    localStorage.setItem(
        "paymentStatus",
        "success"
    );

    localStorage.setItem(
        "transactionId",
        transactionId
    );

    localStorage.removeItem("cart");

    localStorage.removeItem(
        "deliveryDetails"
    );

    alert(
    `Payment successful! 🎉\n\n` +
    `Transaction ID: ${transactionId}\n` +
    `Order ID: #${data.order_id}`
);

setTimeout(function() {

    window.location.replace(
        "http://127.0.0.1:5500/frontend/orders.html"
    );

}, 100);
}
            

            


            // =================================
            // ORDER CREATION FAILED
            // =================================

            else {

                alert(
                    data.error ||
                    "Payment failed. Order was not created."
                );

            }

        }


        // =====================================
        // SERVER CONNECTION ERROR
        // =====================================

        catch (error) {

            console.error(
                "Payment error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        }

    }
);


// =========================================
// DISPLAY TOTAL
// =========================================

calculateTotal();
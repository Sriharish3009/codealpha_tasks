const API_URL = "http://127.0.0.1:8000/api/products/products/";
let allProducts = [];
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
async function loadProducts() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const products = await response.json();

console.log("Products received:", products);

allProducts = products;

loadCategories();

displayProducts(allProducts);

    } catch (error) {

        console.error("Error loading products:", error);

    }

}


function displayProducts(products) {

    const container = document.getElementById("product-container");

    container.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.style.cursor = "pointer";

card.addEventListener("click", () => {
    window.location.href = `product.html?id=${product.id}`;
});

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

        card.innerHTML = `
            <div class="product-image">
                ${imageHTML}
            </div>

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <div class="product-price">
                ₹${product.price}
            </div>

            <p>
                Category: ${product.category}
            </p>

            <button>
                Add to Cart
            </button>
        `;

        container.appendChild(card);

    });

}
function loadCategories() {

    const categories = [
        ...new Set(
            allProducts.map(product => product.category)
        )
    ];

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);

    });
}


function filterProducts() {

    const searchText = searchInput.value.toLowerCase();

    const selectedCategory = categoryFilter.value;

    const filteredProducts = allProducts.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    displayProducts(filteredProducts);
}


searchInput.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);

loadProducts();
function updateCartCount() {

    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }
}

updateCartCount();
function updateUserMenu() {
    const userMenu = document.getElementById("user-menu");

    if (!userMenu) return;

    const loggedIn = localStorage.getItem("loggedIn");
    const username = localStorage.getItem("username");

    if (loggedIn === "true" && username) {
        userMenu.innerHTML = `
            <span>Welcome, ${username}</span>
            <a href="#" onclick="logout()">Logout</a>
        `;
    } else {
        userMenu.innerHTML = `
            <a href="login.html">Login</a>
        `;
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");

    window.location.href = "index.html";
}

updateUserMenu();
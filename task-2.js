var cartIcon = document.querySelector('.bi-cart');
var sidebar = document.getElementById('sidebar');
var sidebarCloseBtn = document.querySelector('.sidebar-close');
var addToCartButtons = document.querySelectorAll('.add-to-cart');
var cartItemsContainer = document.querySelector('.cart-items');
var cartTotal = document.querySelector('.cart-total');
var buyNowButtons = document.querySelectorAll('.buy-now');
var cart = [];
function openSidebar() {
    sidebar.classList.add('open');
}
function closeSidebar() {
    sidebar.classList.remove('open');
}
function updateCart() {
    cartItemsContainer.innerHTML = '';
    cart.forEach(function (item, index) {
        var itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = "\n           <p><strong>".concat(item.name, "</strong> - $").concat(item.price.toFixed(2), " x ").concat(item.quantity, "</p>\n            <div class=\"cart-actions\">\n                <button class=\"decrease-btn\" data-index=\"").concat(index, "\">-</button>\n                <span>").concat(item.quantity, "</span>\n                <button class=\"increase-btn\" data-index=\"").concat(index, "\">+</button>\n                <button class=\"remove-btn\" data-index=\"").concat(index, "\">\n                    <i class=\"bi bi-trash\"></i>\n                </button>\n            </div>\n        ");
        cartItemsContainer.appendChild(itemElement);
    });
    var total = cart.reduce(function (acc, item) { return acc + item.price * item.quantity; }, 0);
    cartTotal.textContent = "$".concat(total.toFixed(2));
    cartItemsContainer.querySelectorAll('.increase-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            var index = parseInt(button.dataset.index || '0', 10);
            if (cart[index].quantity < cart[index].stock) {
                cart[index].quantity++;
                updateCart();
                alert("".concat(cart[index].name, " quantity increased!")); 
            }
            else {
                alert("".concat(cart[index].name, " is out of stock!"));
            }
        });
    });
    cartItemsContainer.querySelectorAll('.decrease-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            var index = parseInt(button.dataset.index || '0', 10);
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            }
            else {
                cart.splice(index, 1); // Remove item if quantity is 0
            }
            updateCart();
        });
    });
    cartItemsContainer.querySelectorAll('.remove-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            var index = parseInt(button.dataset.index || '0', 10);
            cart.splice(index, 1);
            updateCart();
        });
    });
}
// Function to add a product to the cart
function addToCart(productName, productPrice, stock, button) {
    var productInCart = false;
    // Check if the product is already in the cart
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === productName) {
            productInCart = true;
            if (cart[i].quantity < cart[i].stock) {
                cart[i].quantity++;
                updateCart();
                alert("".concat(productName, " quantity increased!")); 
            }
            else {
                alert("".concat(productName, " is out of stock!"));
            }
            return;
        }
    }
    // If the product is not in the cart, add it
    if (!productInCart) {
        cart.push({ name: productName, price: productPrice, stock: stock, quantity: 1 });
        alert("".concat(productName, " is added to cart!")); 
        updateCart();
    }
    // Disable button if stock becomes 0
    if (stock === 1) {
        button.disabled = true;
        button.style.backgroundColor = '#d3d3d3';
    }
}
addToCartButtons.forEach(function (button) {
    var _a, _b, _c;
    var productCard = button.closest('.card1, .card2, .card3, .card4');
    var productName = ((_a = productCard.querySelector('h4')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
    var productPrice = parseFloat(((_c = (_b = productCard.querySelector('p:nth-of-type(2)')) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.replace('$', '')) || '0');
    var stock = parseInt(productCard.dataset.stock || '3', 10); // Assume stock is 3 initially
    button.addEventListener('click', function () {
        if (stock > 0) {
            addToCart(productName, productPrice, stock, button);
        }
        else {
            alert("".concat(productName, " is out of stock!"));
        }
    });
});
buyNowButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        alert('Item successfully purchased!');
    });
});
cartIcon.addEventListener('click', openSidebar);
sidebarCloseBtn.addEventListener('click', closeSidebar);

const cartIcon = document.querySelector('.bi-cart') as HTMLElement;
const sidebar = document.getElementById('sidebar') as HTMLElement;
const sidebarCloseBtn = document.querySelector('.sidebar-close') as HTMLElement;
const addToCartButtons = document.querySelectorAll('.add-to-cart') as NodeListOf<HTMLButtonElement>;
const cartItemsContainer = document.querySelector('.cart-items') as HTMLElement;
const cartTotal = document.querySelector('.cart-total') as HTMLElement;
const buyNowButtons = document.querySelectorAll<HTMLButtonElement>('.buy-now');

interface Product {
    name: string;
    price: number;
    stock: number;
    quantity: number;
}

let cart: Product[] = [];

function openSidebar(): void {
    sidebar.classList.add('open');
}

function closeSidebar(): void {
    sidebar.classList.remove('open');
}

function updateCart(): void {
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        itemElement.innerHTML = `
           <p><strong>${item.name}</strong> - $${item.price.toFixed(2)} x ${item.quantity}</p>
            <div class="cart-actions">
                <button class="decrease-btn" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-btn" data-index="${index}">+</button>
                <button class="remove-btn" data-index="${index}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    cartItemsContainer.querySelectorAll('.increase-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const index = parseInt((button as HTMLButtonElement).dataset.index || '0', 10);
            if (cart[index].quantity < cart[index].stock) {
                cart[index].quantity++;
                updateCart();
                alert(`${cart[index].name} quantity increased!`); 
            } else {
                alert(`${cart[index].name} is out of stock!`);
            }
        });
    });

    cartItemsContainer.querySelectorAll('.decrease-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const index = parseInt((button as HTMLButtonElement).dataset.index || '0', 10);
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1); 
            }
            updateCart();
        });
    });

    cartItemsContainer.querySelectorAll('.remove-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const index = parseInt((button as HTMLButtonElement).dataset.index || '0', 10);
            cart.splice(index, 1);
            updateCart();
        });
    });
}


function addToCart(productName: string, productPrice: number, stock: number, button: HTMLButtonElement): void {
    let productInCart = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === productName) {
            productInCart = true;
            if (cart[i].quantity < cart[i].stock) {
                cart[i].quantity++;
                updateCart();
                alert(`${productName} quantity increased!`); 
            } else {
                alert(`${productName} is out of stock!`);
            }
            return;
        }
    }

    if (!productInCart) {
        cart.push({ name: productName, price: productPrice, stock, quantity: 1 });
        alert(`${productName} is added to cart!`);  
        updateCart();
    }
    if (stock === 1) {
        button.disabled = true;
        button.style.backgroundColor = '#d3d3d3';
    }
}

addToCartButtons.forEach((button) => {
    const productCard = button.closest('.card1, .card2, .card3, .card4') as HTMLElement;
    const productName = productCard.querySelector('h4')?.textContent || '';
    const productPrice = parseFloat(
        productCard.querySelector('p:nth-of-type(2)')?.textContent?.replace('$', '') || '0'
    );
    const stock = parseInt(productCard.dataset.stock || '3', 10); 

    button.addEventListener('click', () => {
        if (stock > 0) {
            addToCart(productName, productPrice, stock, button);
        } else {
            alert(`${productName} is out of stock!`);
        }
    });
});

buyNowButtons.forEach((button) => {
    button.addEventListener('click', () => {
        alert('Item successfully purchased!');
    });
});

cartIcon.addEventListener('click', openSidebar);
sidebarCloseBtn.addEventListener('click', closeSidebar);

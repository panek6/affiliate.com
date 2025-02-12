document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Thank you for contacting us!');
    // Here you can add code to handle form submission, e.g., sending the form data to a server
});

const cartItems = [];
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const buyNowButton = document.getElementById('buyNowButton');
const searchButton = document.getElementById('searchButton');
const cancelSearchButton = document.getElementById('cancelSearchButton');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const helpButton = document.getElementById('helpButton');
const helpModal = document.getElementById('helpModal');

// Close buttons for both modals
const closeModalButtons = document.querySelectorAll('.modal .close');

document.querySelectorAll('.addToCart').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.getAttribute('data-product');
        const price = parseFloat(this.getAttribute('data-price'));
        const existingItem = cartItems.find(item => item.product === product);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ product, price, quantity: 1 });
        }
        
        updateCart();
    });
});

cartButton.addEventListener('click', function() {
    cartModal.style.display = 'block';
    renderCartItems();
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

buyNowButton.addEventListener('click', function() {
    const buyLinks = cartItems.map(item => `affiliate_link_${item.product.split(' ')[1]}`).join(',');
    window.open(buyLinks, '_blank');
});

searchInput.addEventListener('input', debounce(function() {
    const searchTerm = searchInput.value.toLowerCase();
    const products = document.querySelectorAll('.product');
    const categories = document.querySelectorAll('.category');
    cancelSearchButton.style.display = searchTerm ? 'inline-block' : 'none';

    searchResults.innerHTML = '';

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productDescription = product.querySelector('p').textContent.toLowerCase();

        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.textContent = product.querySelector('h3').textContent;
            resultItem.addEventListener('click', () => {
                searchInput.value = product.querySelector('h3').textContent;
                searchResults.innerHTML = '';
                products.forEach(p => p.style.display = 'none');
                product.style.display = 'block';
                const category = product.closest('.category');
                categories.forEach(c => c.style.display = 'none');
                category.style.display = 'block';
            });
            searchResults.appendChild(resultItem);
        }
    });
}, 300));

searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const products = document.querySelectorAll('.product');
    const categories = document.querySelectorAll('.category');

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productDescription = product.querySelector('p').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });

    categories.forEach(category => {
        const categoryProducts = category.querySelectorAll('.product');
        const hasVisibleProducts = Array.from(categoryProducts).some(product => product.style.display === 'block');
        category.style.display = hasVisibleProducts ? 'block' : 'none';
    });
});

cancelSearchButton.addEventListener('click', function() {
    searchInput.value = '';
    searchResults.innerHTML = '';
    cancelSearchButton.style.display = 'none';
    const products = document.querySelectorAll('.product');
    const categories = document.querySelectorAll('.category');
    products.forEach(p => p.style.display = 'block');
    categories.forEach(c => c.style.display = 'block');
});

helpButton.addEventListener('click', function() {
    helpModal.style.display = 'block';
});

window.addEventListener('click', function(event) {
    if (event.target === helpModal) {
        helpModal.style.display = 'none';
    }
});

function updateCart() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems > 0 ? totalItems : '';
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    cartTotal.textContent = totalPrice > 0 ? totalPrice.toFixed(2) : '';
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="product${item.product.split(' ')[1]}.jpg" alt="${item.product}" class="cart-item-image">
            <span>${item.product}</span>
            <span>Price: $${item.price}</span>
            <span>Quantity: 
                <button class="quantity-decrease" data-product="${item.product}">-</button>
                ${item.quantity}
                <button class="quantity-increase" data-product="${item.product}">+</button>
            </span>
            <button class="removeItem" data-product="${item.product}">Remove</button>
        `;
        cartItem.querySelector('.quantity-decrease').addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const item = cartItems.find(item => item.product === product);
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCart();
                renderCartItems();
            }
        });
        cartItem.querySelector('.quantity-increase').addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const item = cartItems.find(item => item.product === product);
            if (item) {
                item.quantity++;
                updateCart();
                renderCartItems();
            }
        });
        cartItem.querySelector('.removeItem').addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const index = cartItems.findIndex(item => item.product === product);

            if (index !== -1) {
                cartItems.splice(index, 1);
                updateCart();
                renderCartItems();
            }
        });
        cartItemsContainer.appendChild(cartItem);
    });
}

// Debounce function to limit the rate of search input processing
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
    };
}



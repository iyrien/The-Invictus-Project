/* __          __  _    _     _______               _    _      _____ 
   \ \        / / | |  | |   |__   __|     /\      | \  | |   / ____|
    \ \  /\  / /  | |  | |      | |       /  \     |  \ | |  | |  __ 
     \ \/  \/ /   | |  | |      | |      / /\ \    | . ` |  | | |_ |
      \  /\  /    | |__| |      | |     / ____ \   | |\  |  | |__| |
       \/  \/      \____/       |_|    /_/    \_\  |_| \_|  \_____|  */

let cart = [];
let cartCount = 0;

function changeQuantity(button, change) {
    const input = button.parentElement.querySelector('.quantity-input');
    let currentValue = parseInt(input.value);
    let newValue = currentValue + change;
    if (newValue < 1) newValue = 1;
    input.value = newValue;
}

function addToCart(button) {
    const product = button.closest('.product');
    const name = product.querySelector('h4').textContent;
    const price = product.querySelector('.product-price').textContent;
    const size = product.querySelector('.size-selector select').value;
    const color = product.querySelector('.color-selector select').value;
    const quantity = parseInt(product.querySelector('.quantity-input').value);
    const imageSrc = product.querySelector('.front-image').src;

    const cartItem = {
        id: Date.now() + Math.random(),
        name: name,
        price: price,
        size: size,
        color: color,
        quantity: quantity,
        image: imageSrc
    };

    cart.push(cartItem);
    cartCount += quantity;
    updateCartUI();
    showNotification('Item added to cart!');
    
    // Reset quantity to 1
    product.querySelector('.quantity-input').value = 1;
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        cartCount -= cart[itemIndex].quantity;
        cart.splice(itemIndex, 1);
        updateCartUI();
        showNotification('Item removed from cart!');
    }
}

function updateCartUI() {
    // Update cart count badge
    document.getElementById('cartCount').textContent = cartCount;
    
    // Update cart sidebar
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        cartTotal.style.display = 'none';
    } else {
        let total = 0;
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const itemPrice = parseFloat(item.price.replace('$',''));
            const itemTotal = itemPrice * item.quantity;
            total += itemTotal;
            
            const cartItemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-details">Size: ${item.size}, Color: ${item.color}</div>
                        <div class="cart-item-details">Qty: ${item.quantity}</div>
                        <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });
        
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
        cartTotal.style.display = 'block';
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (cartSidebar.classList.contains('open')) {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('show');
    } else {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('show');
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function quickView(button) {
    const product = button.closest('.product');
    const name = product.querySelector('h4').textContent;
    const price = product.querySelector('.product-price').textContent;
    
    alert(`Quick View: ${name}\nPrice: ${price}\n\nThis would open a detailed product modal in a real store.`);
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => {
        return sum + (parseFloat(item.price.replace('$', '')) * item.quantity);
    }, 0);
    
    alert(`Checkout Summary:\n${cart.length} items\nTotal: $${total.toFixed(2)}\n\nThis would redirect to payment processing in a real store.`);
}

function applySorting() {
    const sortValue = document.getElementById('sortFilter').value;
    const allProducts = Array.from(document.querySelectorAll('.product'));
    
    allProducts.sort((a, b) => {
        switch (sortValue) {
            case 'price-low':
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            case 'price-high':
                return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
            case 'name':
                return a.dataset.name.localeCompare(b.dataset.name);
            default:
                return 0;
        }
    });
    
    // Reorder products in their respective categories
    const categories = ['tshirts', 'crewnecks', 'hoodies'];
    categories.forEach(category => {
        const categoryContainer = document.querySelector(`.products[data-category="${category}"]`);
        const categoryProducts = allProducts.filter(product => 
            product.closest(`.products[data-category="${category}"]`)
        );
        
        categoryProducts.forEach(product => {
            categoryContainer.appendChild(product);
        });
    });
}

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    // Show/hide categories
    const categoryContainers = document.querySelectorAll('.products');
    const categoryTitles = document.querySelectorAll('.category-title');
    
    categoryContainers.forEach((container, index) => {
        const category = container.dataset.category;
        const title = categoryTitles[index];
        
        if (categoryFilter === 'all' || categoryFilter === category) {
            container.style.display = 'grid';
            title.style.display = 'block';
        } else {
            container.style.display = 'none';
            title.style.display = 'none';
        }
    });
    
    // Filter by price
    const allProducts = document.querySelectorAll('.product');
    allProducts.forEach(product => {
        const price = parseFloat(product.dataset.price);
        let showProduct = true;
        
        if (priceFilter !== 'all') {
            const [min, max] = priceFilter.split('-').map(p => parseFloat(p) || Infinity);
            showProduct = price >= min && price <= max;
        }
        
        product.style.display = showProduct ? 'block' : 'none';
    });
}

// Initialize the store
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    
    // Add smooth scrolling for navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
});
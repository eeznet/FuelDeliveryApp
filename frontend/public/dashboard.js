// Check authentication
if (!localStorage.getItem('token')) {
    window.location.href = '/';
}

let currentUser = null;

// Initialize dashboard
async function initializeDashboard() {
    try {
        // Get user profile
        const response = await fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to get user profile');
        
        currentUser = await response.json();
        
        // Show user info
        document.getElementById('userInfo').textContent = `${currentUser.name} (${currentUser.role})`;
        
        // Show role-specific dashboard
        showRoleDashboard(currentUser.role);
        
        // Load role-specific data
        await loadDashboardData(currentUser.role);
    } catch (error) {
        console.error('Dashboard initialization failed:', error);
        handleLogout();
    }
}

function showRoleDashboard(role) {
    // Hide all dashboards
    document.querySelectorAll('.role-dashboard').forEach(el => el.style.display = 'none');
    
    // Show role-specific dashboard
    document.getElementById(`${role}Dashboard`).style.display = 'block';
}

async function loadDashboardData(role) {
    switch (role) {
        case 'client':
            await loadClientOrders();
            break;
        case 'driver':
            await loadDriverDeliveries();
            break;
        case 'admin':
            await loadAdminStats();
            break;
        case 'owner':
            await loadBusinessStats();
            break;
    }
}

// Client functions
async function loadClientOrders() {
    try {
        const response = await fetch('/api/invoice/client/' + currentUser.id, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load orders');
        
        const orders = await response.json();
        displayClientOrders(orders);
    } catch (error) {
        console.error('Failed to load client orders:', error);
    }
}

// Driver functions
async function loadDriverDeliveries() {
    try {
        const response = await fetch('/api/deliveries/driver', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load deliveries');
        
        const deliveries = await response.json();
        displayDriverDeliveries(deliveries);
    } catch (error) {
        console.error('Failed to load driver deliveries:', error);
    }
}

// Admin functions
async function loadAdminStats() {
    try {
        const response = await fetch('/api/admin/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load admin stats');
        
        const stats = await response.json();
        displayAdminStats(stats);
    } catch (error) {
        console.error('Failed to load admin stats:', error);
    }
}

// Owner functions
async function loadBusinessStats() {
    try {
        const response = await fetch('/api/owner/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load business stats');
        
        const stats = await response.json();
        displayBusinessStats(stats);
    } catch (error) {
        console.error('Failed to load business stats:', error);
    }
}

// Display functions
function displayClientOrders(orders) {
    const container = document.getElementById('clientOrders');
    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <h3>Order #${order.id}</h3>
            <p>Status: ${order.status}</p>
            <p>Amount: ${order.litersDelivered} liters</p>
            <p>Total: $${order.totalPrice}</p>
            <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
        </div>
    `).join('');
}

function displayDriverDeliveries(deliveries) {
    const activeContainer = document.getElementById('activeDeliveries');
    const completedContainer = document.getElementById('completedDeliveries');
    
    const activeDeliveries = deliveries.filter(d => d.status === 'pending');
    const completedDeliveries = deliveries.filter(d => d.status === 'completed');
    
    activeContainer.innerHTML = activeDeliveries.map(delivery => `
        <div class="delivery-card">
            <h3>Delivery #${delivery.id}</h3>
            <p>Address: ${delivery.address}</p>
            <p>Amount: ${delivery.liters_delivered} liters</p>
            <button onclick="updateDeliveryStatus(${delivery.id}, 'completed')">
                Mark as Completed
            </button>
        </div>
    `).join('');
    
    completedContainer.innerHTML = completedDeliveries.map(delivery => `
        <div class="delivery-card">
            <h3>Delivery #${delivery.id}</h3>
            <p>Address: ${delivery.address}</p>
            <p>Amount: ${delivery.liters_delivered} liters</p>
            <p>Completed: ${new Date(delivery.completed_at).toLocaleDateString()}</p>
        </div>
    `).join('');
}

function displayAdminStats(stats) {
    const container = document.getElementById('systemStats');
    container.innerHTML = `
        <div class="stat-card">
            <h3>Total Users</h3>
            <p>${stats.totalUsers}</p>
        </div>
        <div class="stat-card">
            <h3>Active Drivers</h3>
            <p>${stats.activeDrivers}</p>
        </div>
        <div class="stat-card">
            <h3>Total Orders</h3>
            <p>${stats.totalOrders}</p>
        </div>
        <div class="stat-card">
            <h3>Pending Deliveries</h3>
            <p>${stats.pendingDeliveries}</p>
        </div>
    `;
}

function displayBusinessStats(stats) {
    const container = document.getElementById('businessStats');
    container.innerHTML = `
        <div class="stat-card">
            <h3>Total Revenue</h3>
            <p>$${stats.totalRevenue || 0}</p>
        </div>
        <div class="stat-card">
            <h3>Monthly Revenue</h3>
            <p>$${stats.monthlyRevenue || 0}</p>
        </div>
        <div class="stat-card">
            <h3>Total Deliveries</h3>
            <p>${stats.totalDeliveries}</p>
        </div>
        <div class="stat-card">
            <h3>Active Orders</h3>
            <p>${stats.activeOrders}</p>
        </div>
    `;
}

function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

// Initialize dashboard when page loads
initializeDashboard();

// Event Listeners
document.getElementById('fuelRequestForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/api/invoice', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                litersDelivered: formData.get('liters'),
                address: formData.get('address')
            })
        });
        
        if (!response.ok) throw new Error('Failed to create order');
        
        alert('Order created successfully!');
        loadClientOrders();
        e.target.reset();
    } catch (error) {
        console.error('Failed to create order:', error);
        alert('Failed to create order. Please try again.');
    }
}); 
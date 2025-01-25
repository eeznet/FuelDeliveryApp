console.log('App loaded successfully');

// Function to handle login
async function loginUser(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful', data);
            // Store token in sessionStorage
            sessionStorage.setItem('authToken', data.token);
            window.location.href = '/dashboard'; // Redirect to dashboard after login
        } else {
            console.error('Login failed:', data.message);
            displayErrorMessage(data.message);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        displayErrorMessage('An error occurred during login. Please try again.');
    }
}

// Function to fetch user details after login
async function getUserDetails() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        console.error('User is not logged in');
        window.location.href = '/login'; // Redirect to login if no token found
        return;
    }

    try {
        const response = await fetch('/api/user/details', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            console.log('User details:', data);
            displayUserDetails(data);
        } else if (data.message === 'Token has expired. Please log in again.') {
            alert('Your session has expired. Please log in again.');
            sessionStorage.removeItem('authToken');
            window.location.href = '/login'; // Token expired, force login
        } else {
            console.error('Failed to fetch user details:', data.message);
            displayErrorMessage('Unable to fetch user details.');
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        displayErrorMessage('Error occurred while fetching details. Please try again.');
    }
}

// Function to display user details on the dashboard
function displayUserDetails(user) {
    const userDetailsDiv = document.getElementById('userDetails');
    userDetailsDiv.innerHTML = `
        <h3>Welcome, ${user.email}!</h3>
        <p>Role: ${user.role}</p>
    `;
    if (user.role === 'driver') {
        showDriverFeatures();
    } else if (user.role === 'owner') {
        showOwnerFeatures();
    } else if (user.role === 'client') {
        showClientFeatures();
    } else if (user.role === 'admin') {
        showAdminFeatures();  // Admin role added
    }
}

// Function to handle driver features
function showDriverFeatures() {
    const driverDiv = document.getElementById('driverFeatures');
    driverDiv.style.display = 'block';
    console.log('Displaying driver features');
}

// Function to handle owner features
function showOwnerFeatures() {
    const ownerDiv = document.getElementById('ownerFeatures');
    ownerDiv.style.display = 'block';
    console.log('Displaying owner features');
}

// Function to handle client features
function showClientFeatures() {
    const clientDiv = document.getElementById('clientFeatures');
    clientDiv.style.display = 'block';
    console.log('Displaying client features');
}

// Function to handle admin features
function showAdminFeatures() {
    const adminDiv = document.getElementById('adminFeatures');
    adminDiv.style.display = 'block';
    console.log('Displaying admin features');
}

// Function to logout user
function logoutUser() {
    sessionStorage.removeItem('authToken');
    console.log('User logged out');
    window.location.href = '/login'; // Redirect to login page after logout
}

// Event listeners for login and logout buttons (assuming they exist in the HTML)
document.getElementById('loginBtn')?.addEventListener('click', () => {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    loginUser(email, password);
});

document.getElementById('logoutBtn')?.addEventListener('click', logoutUser);

// Event listener for user details retrieval when the page loads (e.g., dashboard page)
window.onload = () => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        getUserDetails(); // Fetch user details if logged in
    } else {
        console.log('No user is logged in');
        window.location.href = '/login'; // Redirect to login if not logged in
    }
};

// Function to handle password reset (client-side validation example)
async function resetPassword(email) {
    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Password reset link sent to email');
            alert('Password reset link sent to your email');
        } else {
            console.error('Password reset failed:', data.message);
            displayErrorMessage('Failed to send password reset link');
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        displayErrorMessage('Error occurred during password reset. Please try again.');
    }
}

// Example: Add event listener for reset password button
document.getElementById('resetPasswordBtn')?.addEventListener('click', () => {
    const email = document.getElementById('emailInput').value;
    resetPassword(email);
});

// Display error messages in a user-friendly way
function displayErrorMessage(message) {
    const errorDiv = document.getElementById('errorMessages');
    errorDiv.innerHTML = `<p class="error">${message}</p>`;
    errorDiv.style.display = 'block'; // Make sure the error message is visible
    errorDiv.style.color = 'red';
    setTimeout(() => {
        errorDiv.style.display = 'none'; // Hide error message after 5 seconds
    }, 5000);
}

// Example: Styling errors (Add this style to your CSS)
// .error { color: red; font-weight: bold; text-align: center; }

console.log('🚀 App loaded');

async function loginUser(email, password) {
    try {
        // Client-side validation for email and password
        if (!email || !password) return displayErrorMessage('Please enter both email and password.');
        if (!isValidEmail(email)) return displayErrorMessage('Please enter a valid email address.');
        if (password.length < 8) return displayErrorMessage('Password must be at least 8 characters long.');

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Login successful');
            sessionStorage.setItem('authToken', data.token);
            window.location.href = '/dashboard';
        } else {
            console.error('❌ Login failed:', data.message);
            displayErrorMessage(data.message);
        }
    } catch (error) {
        console.error('⚠️ Error logging in:', error);
        displayErrorMessage('An unexpected error occurred. Please try again later.');
    }
}

function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function displayErrorMessage(message) {
    const errorDiv = document.getElementById('errorMessages');
    errorDiv.innerHTML = `<p class="error">${message}</p>`;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

document.getElementById('loginBtn')?.addEventListener('click', () => {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    loginUser(email, password);
});

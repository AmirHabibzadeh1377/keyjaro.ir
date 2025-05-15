// Authentication state
let currentUser = null;

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Verify token with backend
        fetch('/api/verify-token', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                currentUser = data.user;
                updateAuthUI();
            } else {
                logout();
            }
        })
        .catch(() => {
            logout();
        });
    }
}

// Update UI based on authentication state
function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    if (currentUser) {
        authButtons.innerHTML = `
            <span class="user-welcome">سلام ${currentUser.name}</span>
            <button class="btn btn-logout" onclick="logout()">خروج</button>
        `;
    } else {
        authButtons.innerHTML = `
            <a href="/login.html" class="btn btn-login">ورود</a>
            <a href="/register.html" class="btn btn-register">ثبت نام</a>
        `;
    }
}

// Login function
function login(email, password) {
    return fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            currentUser = data.user;
            updateAuthUI();
            return true;
        }
        throw new Error(data.message || 'خطا در ورود');
    });
}

// Register function
function register(userData) {
    return fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            currentUser = data.user;
            updateAuthUI();
            return true;
        }
        throw new Error(data.message || 'خطا در ثبت نام');
    });
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    currentUser = null;
    updateAuthUI();
    window.location.href = '/';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Form submission
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;
            const remember = document.querySelector('#remember').checked;

            // Here you would typically send the data to your server
            console.log('Login attempt:', { email, password, remember });
            
            // For demo purposes, show success message
            alert('ورود موفقیت‌آمیز بود!');
        });
    }

    // Check authentication status
    checkAuth();
}); 
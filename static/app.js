// API endpoint
const API_URL = '/.netlify/functions/api';

// Login form handling
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            
            // Redirect based on role
            switch(data.role) {
                case 'admin':
                    window.location.href = '/admin.html';
                    break;
                case 'management':
                    window.location.href = '/management.html';
                    break;
                case 'gate':
                    window.location.href = '/gate.html';
                    break;
                default:
                    showError('Invalid role');
            }
        } else {
            showError(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred. Please try again.');
    }
});

// Utility function to show error messages
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const form = document.getElementById('loginForm');
    form.insertBefore(alertDiv, form.firstChild);
}

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
        window.location.href = '/index.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/index.html';
}

// Initialize authentication check
checkAuth();
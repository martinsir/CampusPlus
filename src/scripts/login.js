document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed.');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const registerLink = document.getElementById('register-link');
    const backToLoginLink = document.getElementById('back-to-login');

    // Toggle between login and register pages
    registerLink.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Navigating to Register Page');
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('register-page').style.display = 'block';
    });

    backToLoginLink.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Navigating back to Login Page');
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    });

    // Handle login
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Login form submitted');

        const email = loginForm.elements['brugernavn'].value;
        const password = loginForm.elements['kodeord'].value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Login failed:', errorResponse.error || 'Unknown error');
                throw new Error(errorResponse.error || 'Login failed');
            }

            const result = await response.json();
            console.log('Login successful:', result);
            showMainContent(); // Call your function to display the main content
        } catch (error) {
            console.error('Error during login:', error.message);
            alert(`Login failed: ${error.message}`);
        }
    });

    // Handle registration
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Registration form submitted');
    
        const name = document.getElementById('register-brugernavn').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-kodeord').value.trim();
        const confirmPassword = document.getElementById('register-bekræft-kodeord').value.trim();
        const phoneNumber = document.getElementById('register-phone').value || null;
        const role = document.getElementById('register-role').value;
        const schoolId = parseInt(document.getElementById('register-school').value, 10);
    
        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);
    
        if (password !== confirmPassword) {
            console.error('Passwords do not match:', password, confirmPassword);
            alert('Passwords do not match!');
            return;
        }
        
    
        const userData = { name, email, password, role, phoneNumber, schoolId };
    
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
        
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text();
                console.error('Unexpected response format:', errorText);
                throw new Error('Unexpected server response');
            }
        
            const result = await response.json();
        
            if (!response.ok) {
                console.error('Registration failed:', result.error || 'Unknown error');
                throw new Error(result.error || 'Registration failed');
            }
        
            console.log('Registration successful:', result);
            alert('Registration successful! You can now log in.');
            document.getElementById('back-to-login').click();
        } catch (error) {
            console.error('Error during registration:', error.message);
            alert(error.message);
        }
        
    });
    

    // Show main content after login
    function showMainContent() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        console.log('Main content displayed');
    }
});

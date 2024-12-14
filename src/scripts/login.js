document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed.');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const registerLink = document.getElementById('register-link');
    const backToLoginLink = document.getElementById('back-to-login');
    const passwordInput = document.getElementById('register-kodeord');
    const registerButton = document.getElementById('register-button');
    const passwordRequirementsContainer = document.createElement('div');
    passwordRequirementsContainer.id = 'password-requirements';

    // Password requirements object
    const requirements = {
        length: { text: "At least 8 characters", valid: false },
        uppercase: { text: "At least 1 uppercase letter", valid: false },
        number: { text: "At least 1 number", valid: false },
        special: { text: "At least 1 special character", valid: false },
    };

    // Prevent duplicating the password requirements UI
    if (!document.getElementById('password-requirements')) {
        passwordRequirementsContainer.innerHTML = `
            <ul>
                ${Object.entries(requirements).map(([key, req]) =>
                    `<li id="${key}-req" class="invalid">${req.text}</li>`
                ).join('')}
            </ul>
        `;
        passwordInput.parentElement.appendChild(passwordRequirementsContainer);
    }

    // Real-time password validation
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;

        // Update requirement validation
        requirements.length.valid = password.length >= 8;
        requirements.uppercase.valid = /[A-Z]/.test(password);
        requirements.number.valid = /\d/.test(password);
        requirements.special.valid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        // Update the UI dynamically
        Object.entries(requirements).forEach(([key, req]) => {
            const element = document.getElementById(`${key}-req`);
            if (req.valid) {
                element.classList.add('valid');
                element.classList.remove('invalid');
            } else {
                element.classList.add('invalid');
                element.classList.remove('valid');
            }
        });

        // Enable the register button if all requirements are valid
        registerButton.disabled = !Object.values(requirements).every(req => req.valid);
    });

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
            showMainContent();
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
        const password = passwordInput.value.trim();
        const confirmPassword = document.getElementById('register-bekræft-kodeord').value.trim();
        const phoneNumber = document.getElementById('register-phone').value || null;
        const role = document.getElementById('register-role').value;
        const schoolId = parseInt(document.getElementById('register-school').value, 10);

        if (password !== confirmPassword) {
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

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Registration failed:', errorResponse.error || 'Unknown error');
                throw new Error(errorResponse.error || 'Registration failed');
            }

            const result = await response.json();
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

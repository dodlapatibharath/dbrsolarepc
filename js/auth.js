document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    const updateStatus = (elementId, message, isError = false) => {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.textContent = message;
        el.style.color = isError ? '#ff8d8d' : '#d4af37';
    };

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const payload = {
                fullName: signupForm.fullName.value.trim(),
                email: signupForm.email.value.trim(),
                phone: signupForm.phone.value.trim(),
                password: signupForm.password.value
            };

            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();

                if (!response.ok) {
                    updateStatus('signupStatus', data.message || 'Unable to create account.', true);
                    return;
                }

                updateStatus('signupStatus', data.message || 'Account created. Please log in.');
                signupForm.reset();
            } catch (error) {
                updateStatus('signupStatus', 'Network error while creating account.', true);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const payload = {
                email: loginForm.email.value.trim(),
                password: loginForm.password.value
            };

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();

                if (!response.ok) {
                    updateStatus('loginStatus', data.message || 'Invalid credentials.', true);
                    return;
                }

                localStorage.setItem('customerAuthToken', data.token);
                localStorage.setItem('customerProfile', JSON.stringify(data.customer));
                updateStatus('loginStatus', `Welcome ${data.customer.fullName}! Login successful.`);
                loginForm.reset();
            } catch (error) {
                updateStatus('loginStatus', 'Network error while logging in.', true);
            }
        });
    }
});

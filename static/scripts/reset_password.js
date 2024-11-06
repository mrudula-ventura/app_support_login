// Password generation function
function generatePassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < 12; i++) { 
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

// Toggle password visibility
function togglePasswordVisibility(passwordField, confirmPasswordField, isVisible) {
    passwordField.type = isVisible ? "text" : "password";
    confirmPasswordField.type = isVisible ? "text" : "password";
}

// Function to handle reset password logic
async function handleResetPassword() {
    const email = document.getElementById('eUsrMail').value;
    const newPassword = document.getElementById('newPswd').value;
    const confirmPassword = document.getElementById('newCPswd').value;

    // Clear previous error messages
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';

    // Input validation
    if (!email.trim()) {
        document.getElementById('email-error').textContent = "Please enter your email.";
        return;
    }

    if (!email.includes('@')) {
        document.getElementById('email-error').textContent = "Email must end with @venturasecurities.com.";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('email-error').textContent = "Please enter a valid email address.";
        return;
    }

    if (newPassword.length < 6) {
        document.getElementById('password-error').textContent = "Password must be at least 6 characters long.";
        return;
    }

    if (newPassword !== confirmPassword) {
        document.getElementById('password-error').textContent = "Passwords do not match. Please try again.";
        return;
    }

    const data = {
        email: email,
        newPassword: newPassword,
    };

    try {
        const response = await fetch('http://localhost:5000/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.error) {
            alert(result.error); // Display error from server
        } else {
            swal("Success!", result.message, "success"); // SweetAlert for success messages
        }
    } catch (error) {
        alert('An unexpected error occurred. Please try again.');
    }
}

// Generate Password Button functionality
document.getElementById('generatePswd').addEventListener('click', function () {
    const passwordField = document.getElementById('newPswd');
    const confirmPasswordField = document.getElementById('newCPswd');

    const randomPassword = generatePassword();
    passwordField.value = randomPassword;
    confirmPasswordField.value = randomPassword;

    togglePasswordVisibility(passwordField, confirmPasswordField, true);
});

// Add event listener to Reset button
document.getElementById('reset').addEventListener('click', handleResetPassword);

function goBack() {
    window.history.back();
}

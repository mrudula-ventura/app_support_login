document.getElementById('reset').addEventListener('click', async function () {
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

    if (!email.endsWith('@venturasecurities.com')) {
        document.getElementById('email-error').textContent = "Email must end with @xyz.com.";
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
        confirmPassword: confirmPassword
    };

    try {
        const response = await fetch('http://localhost:5000/reset-passwordclientId=${clientId}', {
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
});

function validateEmail(email) {
    const domain = "@venturasecurities.com";
    return email.endsWith(domain);
}

function generatePassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < 12; i++) { 
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

function togglePasswordVisibility(passwordField, confirmPasswordField, isVisible) {
    passwordField.type = isVisible ? "text" : "password";
    confirmPasswordField.type = isVisible ? "text" : "password";
}

document.getElementById('addUser').addEventListener('click', function () {
    const email = document.getElementById('newUsrMail').value.trim();
    const password = document.getElementById('newUserPswd').value;
    const confirmPassword = document.getElementById('newUserCPswd').value;
    const isSuperuser = document.getElementById('isSuperuser').checked;

    // Clear previous error messages
    document.getElementById('error-message').textContent = '';

    // Validate email
    if (!validateEmail(email)) {
        alert("Please enter a valid email with @venturasecurities.com.");
        return;
    }

    // Validate password
    if (password !== confirmPassword) {
        document.getElementById('error-message').textContent = "Passwords do not match. Please try again.";
        return;
    }

    const userData = {
        email: email,
        password: password,
        isSuperuser: isSuperuser
    };

    fetch('https://your-backend-api.com/add-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json().then(data => {
        if (!response.ok) {
            // Show the error message from the server
            throw new Error(data.error || "Error adding user.");
        }
        return data; // Otherwise, return the data for success
    }))
    .then(data => {
        alert("User added successfully.");
        window.location.href = "user_management.html";
    })
    .catch(error => {
        console.error(error);
        document.getElementById('error-message').textContent = error.message; // Display error message
    });
});

document.getElementById('generatePswd').addEventListener('click', function () {
    const passwordField = document.getElementById('newUserPswd');
    const confirmPasswordField = document.getElementById('newUserCPswd');

    const randomPassword = generatePassword();
    passwordField.value = randomPassword;
    confirmPasswordField.value = randomPassword;

    togglePasswordVisibility(passwordField, confirmPasswordField, true);
});

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
    const username = document.getElementById('newUsrNm').value.trim();
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
        username: username,
        email: email,
        password: password,
        isSuperuser: isSuperuser
    };

    fetch('http://localhost:5000/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(async response => {
        if (response.ok) { 
            const result_1 = await response.json();
            const a = document.getElementById('error-message').textContent = result_1.message;
            alert("User added successfully.", a);
            window.location.href = "superuser.html";
        } else {
            const result_2 = await response.json();
            let errorMessage;
            if (response.status === 401) {
                errorMessage = result_2.message || "User already exists.";
            } else if (response.status >= 500) {
                errorMessage = result_2.message || "Error adding user. Please try again later.";
            } else {
                errorMessage = "An unexpected error occurred.";
            }
            const errorDiv = document.getElementById('error-message');
            if (errorDiv) {
                errorDiv.textContent = errorMessage; 
            }
            // alert(errorMessage);
        }
    })
    .catch(error => {
        console.error("Network error:", error); 
        errorDiv.textContent = '"There was an error processing your request: " + error.message'; 
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


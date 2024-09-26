
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
}


function generatePassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < 12; i++) { // Generate a password of length 12
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

function togglePasswordVisibility(passwordField, confirmPasswordField, isVisible) {
    if (isVisible) {
        passwordField.type = "text";
        confirmPasswordField.type = "text";
    } else {
        passwordField.type = "password";
        confirmPasswordField.type = "password";
    }
}


document.getElementById('addUser').addEventListener('click', function () {
    const username = document.getElementById('newUsrNm').value;
    const email = document.getElementById('newUsrMail').value;
    const password = document.getElementById('newUserPswd').value;
    const confirmPassword = document.getElementById('newUserCPswd').value;
    const isSuperuser = document.getElementById('isSuperuser').checked;


    if (!validateEmail(email)) {
        alert("Please enter a valid email.");
        return;
    }


    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }


    const userData = {
        username: username,
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
        .then(response => {
            if (response.ok) {
                alert("User added successfully.");
                // Optionally, redirect to another page after successful addition
                window.location.href = "user_management.html";
            } else {
                throw new Error("Error adding user.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("There was an error adding the user.");
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


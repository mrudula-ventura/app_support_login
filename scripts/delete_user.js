document.getElementById('dltUser').addEventListener('click', function () {
    const email = document.getElementById('usrEmail').value.trim();

 
    document.getElementById('error-message').textContent = '';

   
    if (!email) {
        document.getElementById('error-message').textContent = "Please Enter Email.";
        return;
    }

   
    if (!validateEmail(email)) {
        alert("Please enter a valid email address ending with @venturasecurities.com.");
        return;
    }

    const userData = {
  
        email: email
    };

  
    fetch('http://localhost:5000/delete-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                throw new Error(data.error || "Error deleting user.");
            }
            return data; 
        });
    })
    .then(data => {
        alert("User deleted successfully.");
    })
    .catch(error => {
        console.error(error);
        document.getElementById('error-message').textContent = error.message; 
    });
});

function validateEmail(email) {
    const domain = "@venturasecurities.com";
    return email.endsWith(domain);
}

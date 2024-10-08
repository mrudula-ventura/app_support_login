document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = { 
        username: username,
        password: password
    };

    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(err => {
                throw new Error(err.message || 'Invalid Credentials hai bhai');
            });
        }
    })
    .then(result => {
        console.log('Success:', result);
         if (result.is_super_user && result.is_active) {
            console.log('Superuser logged in:', result);
            document.getElementById('error-message').textContent = result.message || "Superuser logged in successfully.";
            window.location.href = 'superuser.html'; 
        } else if (!result.is_super_user && result.is_active) {
            console.log('Normal user logged in:', result);
            document.getElementById('error-message').textContent = result.message || "Normal user logged in successfully.";
            window.location.href = 'user.html'; 
        } else {
            document.getElementById('error-message').textContent = "This user account is deactivated.";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = error.message || "Please check your VPN connection or contact support.";
    });
});

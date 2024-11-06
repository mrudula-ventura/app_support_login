document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = { 
        username: username,
        password: password
    };
    const token = localStorage.getItem('token');

    if (!token) {
        console.log('No token found. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
        if (result.is_active) {
            // Store the token in localStorage
            localStorage.setItem('token', result.token);

            // Redirect based on user type
            if (result.is_super_user) {
                window.location.href = 'superuser.html'; 
            } else {
                window.location.href = 'user.html'; 
            }
        } else {
            document.getElementById('error-message').textContent = "This user account is deactivated.";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = error.message || "Please check your VPN connection or contact support.";
    });
});

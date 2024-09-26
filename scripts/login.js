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
        console.log('Response:', response);
        return response.json();
    })
    .then(result => {
        console.log('Success:', result);
        if (result.error) {
            document.getElementById('error-message').textContent = result.error;  
        } else if (result.is_super_user) {
            console.log('Superuser logged in:', result);
            window.location.href = 'superuser.html';  
        } else {
            console.log('Normal user logged in:', result);
            window.location.href = 'user.html';  
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

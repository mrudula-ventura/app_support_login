document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // // example users
    // const users = [
    //     { username: "user1@example.com", password: "password123", is_superuser: false },
    //     { username: "admin@example.com", password: "adminpass", is_superuser: true }
    // ];

    // const user = users.find(user => user.username === username && user.password === password);

    document.getElementById("login").addEventListener("click", function() {
        const data = { 
            username:username,
            passsword: password
        };

        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    
    let response = {};
    if (user) {
        response.success = true;
        response.is_superuser = user.is_superuser; 
    } else {
        response.success = false;
        response.message = "Invalid username or password.";
    }

   
    setTimeout(() => {
        if (response.success) {
           
            if (response.is_superuser) {
               
                window.location.href = 'superuser.html';
            } else {
                
                window.location.href = 'user.html';
            }
        } else {
           
            document.getElementById('error-message').textContent = response.message;
        }
    }, 500); 
});

















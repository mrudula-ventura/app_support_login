document.getElementById('dltUser').addEventListener('click', function () {
    const email = document.getElementById('eUsrMail').value.trim();

 
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
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Error deleting user.");
        }
        return data;
    })
    .then(data => {
        alert("Removed access for the user successfully");
    })
    .catch(error => {
        console.error(error);
        document.getElementById('error-message').textContent = error.message; 
    });
});

function validateEmail(email) {
    return email.includes('@');
}


function goBack() {
    window.history.back();
}
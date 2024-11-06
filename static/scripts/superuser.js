document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
     
   
    const submitButton = document.getElementById('submit-btn');
    const clientIdInput = document.getElementById('client-id');
    const manageUserButton = document.getElementById('manageUser');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const getClientIdButton=document.getElementById('get-client-id');
    console.log('submitButton:', submitButton);
    console.log('clientIdInput:', clientIdInput);

    if (!submitButton || !clientIdInput) {
        console.error('Element not found');
        return;
    }

    function isValidEmail(email) {
        return email.includes('@');
    }
    

    function isValidPhoneNumber(phone) {
        const regex = /^\d{10}$/; 
        return regex.test(phone);
    }

    
    async function searchClientId() {
        const emailOrPhone = document.getElementById('email-mobile').value;
        const errorMessageElement = document.getElementById('error-message'); // Get the error message element
        const token = localStorage.getItem('token');

        if (!token) {
            console.log('No token found. Please log in.');
            window.location.href = 'login.html';
            return;
        }
        // Clear any previous error message
        errorMessageElement.textContent = '';
    
        if (!emailOrPhone) {
            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.textContent = 'Please enter email address or phone number.';
            return;
        }
    
        if (isValidEmail(emailOrPhone) || isValidPhoneNumber(emailOrPhone)) {
            try {
                const response = await fetch('http://localhost:5000/get-client-id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ emailOrPhone }),
                });
    
                const data = await response.json();
    
                if (response.ok && response.status === 200) {
                    const clientId = data.clientId;
    
                    if (clientId) {
                        clientIdInput.value = clientId; 
                        window.location.href = `client_page.html?clientId=${clientId}`; 
                    } else {
                        // Display backend error message if clientId is null
                        errorMessageElement.textContent = data.message || "Client ID not found.";
                    }
                } else if (response.status === 401) {
                    // If unauthorized, redirect to login page
                    window.location.href = 'login.html';
                } else {
                    errorMessageElement.textContent = "Client ID not found.";
                }
            } catch (error) {
                console.error("Network error:", error);
                errorMessageElement.textContent = 'Error checking Client ID from the server';
            }
        } else {
            errorMessageElement.textContent = 'Please enter a valid email address or a valid 10-digit phone number.';
        }
    }
    

    document.getElementById('get-client-id').addEventListener('click', function () {
        
        console.log("Get Client ID button clicked");
        searchClientId(); // Call the searchClientId function
    });

    async function submitClientId() {
        const clientId = clientIdInput.value.trim();
        const errorMessageElement = document.getElementById('error-message'); // Get the error message element
        const token = localStorage.getItem('token');

        if (!token) {
            console.log('No token found. Please log in.');
            window.location.href = 'login.html';
            return;
        }
        // Clear any previous error message
        errorMessageElement.textContent = '';
    
        if (clientId) {
            try {
                const response = await fetch('http://localhost:5000/submit-client-id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ clientId }),
                });
    
                const result = await response.json();
    
                if (response.ok && response.status === 200) {
                    console.log(result);
                    window.location.href = `client_page.html?clientId=${clientId}`;
                } else if (response.status === 400) {
                    
                    errorMessageElement.textContent = result.message || "Client ID not found.";
                }
                else if (response.status === 401) {
                    // If unauthorized, redirect to login page
                    window.location.href = 'login.html';
                } else {
                    errorMessageElement.textContent = 'Client ID submission failed. Please try again.';
                }
    
            } catch (error) {
                console.error("Error submitting Client ID:", error);
                errorMessageElement.textContent = 'Error submitting Client ID to the server';
            }
        } else {
            errorMessageElement.textContent = 'Please enter a Client ID manually';
        }
    }
    

    submitButton.addEventListener('click', async function(event) {
        event.preventDefault();
        await submitClientId(); // Call the submitClientId function
    });

    if (manageUserButton && dropdownMenu) {
        manageUserButton.addEventListener('click', function() {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        window.onclick = function(event) {
            if (!event.target.matches('#manageUser')) {
                if (dropdownMenu.style.display === 'block') {
                    dropdownMenu.style.display = 'none';
                }
            }
        };
    }
});

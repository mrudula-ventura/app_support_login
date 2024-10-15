document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    const submitButton = document.getElementById('submit-btn');
    const clientIdInput = document.getElementById('client-id');
    const manageUserButton = document.getElementById('manageUser');
    const dropdownMenu = document.getElementById('dropdownMenu');

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
        const clientIdDisplay = document.getElementById('client-id-display');

        if (!emailOrPhone) {
            alert('Please enter an email or phone number');
            return;
        }
            // isValidEmail(emailOrPhone) || 
        if (isValidPhoneNumber(emailOrPhone)) {
            try {
                const response = await fetch('http://localhost:5000/get-client-id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ emailOrPhone }),
                });

                const data = await response.json();

                if (response.ok) {
                    const clientId = data.clientId;
                    // console.log(data);
                    if (clientId) {
                        clientIdInput.value = clientId; 
                        window.location.href = `client_page.html?clientId=${clientId}`; 
                    } else {
                        console.error("Client ID not found for the provided email/phone number.");
                        alert("Client ID not found.");
                    }
                } else {
                    console.error("Failed to fetch Client ID from the server.");
                    // alert("Error fetching Client ID from server.");
                }
            } catch (error) {
                console.error("Network error:", error);
                alert('Error checking Client ID from the server');
            }
        } else {
            alert('Please enter a valid email address ending with @venturasecurities.com or a valid 10-digit phone number.');
        }
    }

    document.getElementById('get-client-id').addEventListener('click', function () {
        console.log("Get Client ID button clicked");
        searchClientId(); // Call the searchClientId function
    });

    async function submitClientId() {
        const clientId = clientIdInput.value.trim();
        // console.log();
        if (clientId) {
            try {
                const response = await fetch('http://localhost:5000/submit-client-id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ clientId }),
                });

                


                const result = await response.json();

                if (response.ok && response.status === 200) {
                    console.log(result);  
                    window.location.href = `client_page.html?clientId=${clientId}`;
                } else if (response.status === 400) {
                    console.error("Client ID submission failed.");
                    alert("Client ID not found.");
                } else {
                    console.error("Client id submission failed.", response.status);
                    alert('Client id submission failed. Please try again.');
                }

            } catch (error) {
                console.error("Error submitting Client ID:", error);
                alert('Error submitting Client ID to the server');
            }
        } else {
            alert('Please enter a Client ID manually');
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

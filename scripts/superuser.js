document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    const submitButton = document.getElementById('submit-btn');
    const clientIdInput = document.getElementById('client-id');
    const manageUserButton = document.getElementById('manageUser');
    const dropdownMenu = document.getElementById('dropdownMenu');
   

    console.log('submitButton:', submitButton);
    console.log('clientIdInput:', clientIdInput);
 const emailOrPhone = document.getElementById('email-mobile').value;
    if (!submitButton || !clientIdInput) {
        console.error('Element not found');
        return;
    }

    /*getting clientid from email and mobile number*/

    
function searchClientId() {
    const emailOrPhone = document.getElementById('email-mobile').value;
    const clientIdDisplay = document.getElementById('client-id-display');

    if (emailOrPhone) {
        const clientId = clientDatabase[emailOrPhone];
        if (clientId) {
            clientIdDisplay.innerText = `Client ID: ${clientId}`;
        } else {
            clientIdDisplay.innerText = 'Client ID: ID not found';
        }
    } else {
        alert('Please enter an email or phone number');
    }
}

function submitClientId() {
    const clientId = document.getElementById('client-id').value;
    if (clientId) {
        window.location.href = `client_page.html?clientId=${clientId}`;
    } else {
        alert('Please enter a Client ID');
    }
}


    
    submitButton.addEventListener('click', async function(event) {
        event.preventDefault();  
        const clientId = clientIdInput.value.trim(); 
        if (clientId === "") {
            alert("Please enter a valid Client ID.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/get-client-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientIdField: clientId, emailOrPhone:emailOrPhone }),
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = `client_page.html?clientId=${clientId}`;
            } else {
                alert("Client ID not found.");
            }
        } catch (error) {
            console.error(error);
            alert('Error checking Client ID from the server');
        }
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

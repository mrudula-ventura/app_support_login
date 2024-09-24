const clientDatabase = {
    "user@example.com": "CLIENT123",
    "1234567890": "CLIENT456",
    "another@example.com": "CLIENT789"
};

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

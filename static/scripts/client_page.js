// Get Client ID from URL parameters
function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}

// Fetch client details from the backend
function fetchClientDetails(clientId) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found. Please log in.');
        window.location.href = 'login.html'; // Redirect to login page if no token
        return;
    }

    fetch(`http://localhost:5000/submit-client-id?clientId=${clientId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Send token in the header
        },
        body: JSON.stringify({ clientId }),
    })
    .then(response => {
        if (response.status === 401) {
            // Redirect to login page if unauthorized (invalid token)
            console.log('Token is invalid, redirecting to login page...');
            window.location.href = 'login.html';
            return; // Return early if token is invalid
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            // Display the fetched data on the page
            document.getElementById('client-id-display').innerText = data.client_id;
            document.getElementById('client-full-name').innerText = data.Full_Name;
            document.getElementById('client-email').innerText = data.Email;
            document.getElementById('client-mobile').innerText = data["Mobile_No."];

            // Store the data in localStorage for use on another page
            localStorage.setItem('clientData', JSON.stringify(data));
        }
    })
    .catch(error => console.error('Error fetching client details:', error));
}

// On page load, get client ID and fetch client details
window.onload = () => {
    const clientId = getClientId();
    if (clientId) {
        fetchClientDetails(clientId);
    } else {
        console.log('Client ID not found.');
    }
};

function goBack() {
    window.history.back();
}

// Function to open a new page and pass the client ID
function openPage(page) {
    const clientId = getClientId();
    if (clientId) {
        window.location.href = `${page}?clientId=${clientId}`;
    } else {
        window.location.href = `${page}`;
    }
}

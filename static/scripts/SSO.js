
// Function to display account information in a card
function displayAccountInfo(account) {
    const card = document.getElementById('account-card');
    

       // Extract the PLATFORM field, parse it as a proper array, and join the elements
       let platformDisplay = 'N/A';
       try {
           const platformArray = JSON.parse(account.PLATFORM.replace(/'/g, '"'));  // Replace single quotes with double quotes for JSON parsing
           platformDisplay = Array.isArray(platformArray) ? platformArray.join(', ') : 'N/A';
       } catch (error) {
           console.error('Error parsing platform:', error);
       }
    
    card.innerHTML = `
        <h3>Account Status: ${account.ACCOUNT_STATUS || 'N/A'}</h3>
        <p><strong>Created Date:</strong> ${account.CREATED_DTTM || 'N/A'}</p>
        <p><strong>Google Auth Enabled:</strong> ${account.GOOGLE_AUTH_ENABLED ? 'True' : 'False'}</p>
        <p><strong>Account Active:</strong> ${account.IS_ACTIVE ? 'True' : 'False'}</p>
        <p><strong>BAU Account:</strong> ${account.IS_BAU ? 'True' : 'False'}</p>
        <p><strong>Exclusive Account:</strong> ${account.IS_EXCLUSIVE ? 'True' : 'False'}</p>
        <p><strong>Migration Source:</strong> ${account.MIGRATION_SOURCE || 'N/A'}</p>
        <p><strong>PAN:</strong> ${account.PAN || 'N/A'}</p>
        <p><strong>Platform:</strong> ${platformDisplay}</p>
        <p><strong>Platform PIN Set:</strong> ${account.pin_set ? 'True' : 'False'}</p>
    `;
}


function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
  }
// Function to fetch account data using a GET request
async function fetchAccountData() {
  const clientId = getClientId();
    try {
        const response = await fetch(`http://localhost:5000/sso?clientId=${clientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Check if data contains account information
            if (data.data) {
                displayAccountInfo(data.data[0]);
                console.log(data.data[0])
            } else if (data.message) {
                showMessage(data.message);  // Display any message from the backend
            }
        } else {
            console.error('Failed to fetch account data.');
            showMessage('Failed to fetch account data.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Error fetching data.');
    } finally {

    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the data from localStorage
    const storedData = localStorage.getItem('clientData');
    
    if (storedData) {
        const clientData = JSON.parse(storedData);
        
        // Display the data on this page
        document.getElementById('client-id-display').innerText = clientData.client_id;
        document.getElementById('client-full-name').innerText = clientData.Full_Name;
        document.getElementById('client-email').innerText = clientData.Email;
        document.getElementById('client-mobile').innerText = clientData["Mobile_No."];
    } else {
        console.error('No data found in localStorage.');
    }
});







function goBack() {
    window.history.back();
}

// Call the fetch function when the page loads
document.addEventListener('DOMContentLoaded', fetchAccountData);

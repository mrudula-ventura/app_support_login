
// Function to display account information in a card
function displayClientInfo(client) {
    const card = document.getElementById('cob-card');
    


    
    card.innerHTML = `
        <h3>id_incr: ${client.id_incr || 'N/A'}</h3>
        <p><strong>Date of Birth :</strong> ${client.dob || 'N/A'}</p>
        <p><strong>Google Auth Enabled:</strong> ${client.age}</p>
        <p><strong>Account Active:</strong> ${client.pan}</p>
        <p><strong>BAU Account:</strong> ${client.pan_father_name}</p>
        <p><strong>Exclusive Account:</strong> ${client.mgmt}</p>
        <p><strong>Migration Source:</strong> ${client.platform || 'N/A'}</p>
        <p><strong>PAN:</strong> ${client.ocr_status || 'N/A'}</p>
        <p><strong>Platform:</strong> ${client.created_time}</p>
        <p><strong>Platform PIN Set:</strong> ${client.updated_time}</p>
    `;
}


function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
  }
// Function to fetch account data using a GET request
async function fetchClientData() {
  const clientId = getClientId();
    try {
        const response = await fetch(`http://localhost:5000/cob_details?clientId=${clientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Check if data contains account information
            if (data.data) {
                displayClientInfo(data.data[0]);
                console.log(data.data[0])
            } else if (data.message) {
                showMessage(data.message);  // Display any message from the backend
            }
        } else {
            console.error('Failed to fetch COB data.');
            showMessage('Failed to fetch COB data.');
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

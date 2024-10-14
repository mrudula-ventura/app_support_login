// Get Client ID from URL parameters
function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}

// Fetch client details from the backend
function fetchClientDetails(clientId) {
    fetch(`http://localhost:5000/submit-client-id?clientId=${clientId}`,{

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientId }),
            
        }
    )
        .then(response => response.json())
        .then(data => {
    // Display the fetched data on the page

    document.getElementById('client-id-display').innerText = data.client_id;
    document.getElementById('client-full-name').innerText = data.Full_Name;
    document.getElementById('client-email').innerText = data.Email;
    document.getElementById('client-mobile').innerText = data["Mobile_No."];

    // Store the data in localStorage for use on another page
    localStorage.setItem('clientData', JSON.stringify(data));
        })
        .catch(error => console.error('Error fetching client details:', error));
}

// On page load, get client ID and fetch client details
window.onload = () => {
    const clientId = getClientId();
    if (clientId) {
        fetchClientDetails(clientId);
    }
};

function goBack() {
    window.history.back();
}













// document.getElementById('client-id-display').innerText = getClientId();
//         // Get Client ID from URL parameters
//         function getClientId() {
//             const params = new URLSearchParams(window.location.search);
//             return params.get('clientId');
//         }
//         document.getElementById('client-id-display').innerText = getClientId();
//         function openPage(page) {
//     const clientId = getClientId();
//     if (clientId) {
//         window.location.href = `${page}?clientId=${clientId}`;
//     } else {
//         window.location.href = `${page}`;
//     }
// }
        // function sendClientIdToBackend(clientId) {
        //     fetch('http://localhost:5000/client', { 
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ clientId: clientId }),
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('Success:', data);
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });
        // }
        // window.onload = () => {
        //     const clientId = getClientId();
        //     if (clientId) {
        //         sendClientIdToBackend(clientId);
        //     }
        // };









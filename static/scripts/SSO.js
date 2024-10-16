
    // Sample Data from Backend (Simulated)
    const accountData = {
      "account_info": {
        "ACCOUNT_STATUS": "active",
        "CREATED_DTTM": "Fri, 19 Jul 2024 14:00:12 GMT",
        "GOOGLE_AUTH_ENABLED": true,
        "IS_ACTIVE": true,
        "IS_BAU": false,
        "IS_EXCLUSIVE": true,
        "MIGRATION_SOURCE": "COB",
        "PAN": "ABCDE1234F",
        "PLATFORMpin_set": true
      }
    };

    // Function to render account information in cards
    function renderAccountInfo(data) {
      const accountCards = document.getElementById('account-card');
      
      const accountInfo = data.account_info;

      // Create a card container
      const card = document.createElement('div');
      card.className = 'card';

      // Add the account details to the card
      card.innerHTML = `
        <h3>Account Status: ${accountInfo.ACCOUNT_STATUS}</h3>
        <p><strong>Created Date:</strong> ${new Date(accountInfo.CREATED_DTTM).toLocaleString()}</p>
        <p><strong>Google Auth Enabled:</strong> ${accountInfo.GOOGLE_AUTH_ENABLED ? 'Yes' : 'No'}</p>
        <p><strong>Account Active:</strong> ${accountInfo.IS_ACTIVE ? 'Yes' : 'No'}</p>
        <p><strong>BAU Account:</strong> ${accountInfo.IS_BAU ? 'Yes' : 'No'}</p>
        <p><strong>Exclusive Account:</strong> ${accountInfo.IS_EXCLUSIVE ? 'Yes' : 'No'}</p>
        <p><strong>Migration Source:</strong> ${accountInfo.MIGRATION_SOURCE}</p>
        <p><strong>PAN:</strong> ${accountInfo.PAN}</p>
        <p><strong>Platform PIN Set:</strong> ${accountInfo.PLATFORMpin_set ? 'Yes' : 'No'}</p>
      `;

      // Append the card to the container
      accountCards.appendChild(card);
    }

    // Simulate fetching data from the backend
    document.addEventListener('DOMContentLoaded', () => {
      renderAccountInfo(accountData);
    });





// // Function to show loader
// function showLoader() {
//     document.getElementById('loader').style.display = 'flex';
// }

// // Function to hide loader
// function hideLoader() {
//     document.getElementById('loader').style.display = 'none';
// }

// // Function to display a message
// function showMessage(message) {
//     const messageElement = document.getElementById('message');
//     messageElement.textContent = message;
//     messageElement.classList.remove('hidden');
// }

// // Function to display account information in a card
// function displayAccountInfo(account) {
//     const card = document.getElementById('account-card');
//     card.innerHTML = `
//         <h3>Account Status: ${account.ACCOUNT_STATUS}</h3>
//         <p><strong>Created Date:</strong> ${new Date(account.CREATED_DTTM).toLocaleString()}</p>
//         <p><strong>Google Auth Enabled:</strong> ${account.GOOGLE_AUTH_ENABLED ? 'Yes' : 'No'}</p>
//         <p><strong>Account Active:</strong> ${account.IS_ACTIVE ? 'Yes' : 'No'}</p>
//         <p><strong>BAU Account:</strong> ${account.IS_BAU ? 'Yes' : 'No'}</p>
//         <p><strong>Exclusive Account:</strong> ${account.IS_EXCLUSIVE ? 'Yes' : 'No'}</p>
//         <p><strong>Migration Source:</strong> ${account.MIGRATION_SOURCE}</p>
//         <p><strong>PAN:</strong> ${account.PAN}</p>
//         <p><strong>Platform PIN Set:</strong> ${account.PLATFORMpin_set ? 'Yes' : 'No'}</p>
//     `;
//     card.classList.remove('hidden');  // Show the card
// }

// // Function to fetch account data using a GET request
// async function fetchAccountData() {
//     showLoader();  // Show loader before fetching data
//     try {
//         const response = await fetch('https://your-backend-api.com/account-info', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();

//             // Check if data contains account information
//             if (data.account_info) {
//                 displayAccountInfo(data.account_info);
//             } else if (data.message) {
//                 showMessage(data.message);  // Display any message from the backend
//             }
//         } else {
//             console.error('Failed to fetch account data.');
//             showMessage('Failed to fetch account data.');
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         showMessage('Error fetching data.');
//     } finally {
//         hideLoader();  // Hide loader after data is fetched
//     }
// }

// // Call the fetch function when the page loads
// document.addEventListener('DOMContentLoaded', fetchAccountData);

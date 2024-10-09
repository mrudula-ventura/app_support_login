// Function to get the client ID from the URL
function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}


// Function to generate HTML for each bank card
function createBankCard(account) {
    return `
        <div class="bank-card">
            <h2>${account.bankName}</h2>
            <p><strong>Account No:</strong> ${(account.accountNumber)}</p>
            <p><strong>IFSC Code:</strong> ${account.ifscCode}</p>
            <p><strong>Added On:</strong> ${account.addedDate}</p>
            <p><strong>Status:</strong> <span class="${account.isActive ? 'status-active' : 'status-inactive'}">${account.status}</span></p>
            <p><strong>Currently Active:</strong> ${account.isActive ? 'true' : 'false'}</p>
            <p><strong>Primary Account:</strong> ${account.isPrimary ? 'true' : 'false'}</p>
            <p><strong>Verified:</strong> 
                <span class="badge ${account.isVerified ? 'true' : 'false'}">
                    ${account.isVerified ? 'true' : 'false'}
                </span>
            </p>
        </div>
    `;
}

// Function to display user information including name and address
function displayUserInfo(user) {
    const userInfoContainer = document.getElementById('userInfo');
    userInfoContainer.innerHTML = `
        <h2>${user.name}</h2>
        <p><strong>Address:</strong> ${user.address}</p>
    `;
}

// Function to render bank cards
function displayBankAccounts(bankAccounts) {
    const bankCardsContainer = document.getElementById('bankCards');
    bankCardsContainer.innerHTML = ''; 

    bankAccounts.forEach(account => {
        bankCardsContainer.innerHTML += createBankCard(account);
    });
}

// Function to fetch user and bank account data using POST request
async function fetchUserData(clientId) {
    try {
        
        const response = await fetch('https://your-backend-api.com/get-user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({clientId: clientId }),
        });

        // Check if the response is OK
        if (response.ok) {
            const data = await response.json();  
            // Display user info and bank accounts
            displayUserInfo(data.user);
            displayBankAccounts(data.accounts);
        } else {
            console.error('Failed to fetch user or bank account data.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


fetchUserData(clientId);


function goBack() {
    window.history.back();
}

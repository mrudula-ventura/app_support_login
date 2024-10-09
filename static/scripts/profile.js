// Function to get the client ID from the URL
function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}


// Function to generate HTML for each bank card
function createBankCard(account) {
    return `
        <div class="bank-card">
            <h2>${account.BANK_NAME}</h2>
            <p><strong>Account No:</strong> ${(account.ACCOUNT_NO)}</p>
            <p><strong>IFSC Code:</strong> ${account.IFSC_CODE}</p>
            <p><strong>Added On:</strong> ${account.BANK_ADDED_DATE}</p>
            <p><strong>Status:</strong> <span class="${account.BANK_ACCOUNT_STATUS ? 'status-active' : 'status-inactive'}">${account.status}</span></p>
            <p><strong>Currently Active:</strong> ${account.IS_BANK_CURRENTLY_ACTIVE ? 'true' : 'false'}</p>
            <p><strong>Primary Account:</strong> ${account.IS_BANK_PRIMARY ? 'true' : 'false'}</p>
            <p><strong>Verified:</strong> 
                <span class="badge ${account.IS_BANK_VERIFIED ? 'true' : 'false'}">
                    ${account.IS_BANK_VERIFIED ? 'true' : 'false'}
                </span>
            </p>
        </div>
    `;
}

// Function to display user information including name and address
function displayUserInfo(user) {
    const userInfoContainer = document.getElementById('userInfo');
    userInfoContainer.innerHTML = `
        <h2>${user.First_Name + ' ' + user.Last_Name}</h2>
        <p><strong>Address:</strong> ${user.add1 + '  ' + user.add2 + '  ' + user.add3}</p>
    `;
}

// Function to render bank cards
function displayBankAccounts(accounts) {
    const bankCardsContainer = document.getElementById('bankCards');
    bankCardsContainer.innerHTML = ''; 

    accounts.forEach(account => {
        bankCardsContainer.innerHTML += createBankCard(account);
    });
}

// Function to fetch user and bank account data using POST request
async function fetchUserData() {
    try {
        
        const clientId = getClientId();
        const response = await fetch(`http://localhost:5000/profile?clientId=${clientId}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
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


fetchUserData();


function goBack() {
    window.history.back();
}

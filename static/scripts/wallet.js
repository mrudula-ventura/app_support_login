let walletData = [];
const rowsPerPage = 12;
let currentPage = 1;

function displayWalletTable(filteredData = walletData) {
    const tableBody = document.querySelector('#wallet-table tbody');
    const tableHead = document.querySelector('#wallet-table');
    const loader = document.querySelector('.loader');
    const loadingText = document.querySelector('.loading-text');
    const noWalletMessage = document.querySelector('.noWalletMessage');

    // Clear the table content before updating it
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedWalletData = filteredData.slice(start, end);

    if (paginatedWalletData.length === 0) {
        // If no data, show the "No Wallet Data" message and hide the table
        noWalletMessage.style.display = 'block';
        tableHead.style.display = 'none';
        loader.style.display = 'none';
        loadingText.style.display = 'none';
        return;
    }

    paginatedWalletData.forEach(wallet => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${wallet['Timestamp']}</td>
           
            <td>${wallet['amount']}</td>
            <td>${wallet['Transaction type']}</td>
            <td>${wallet['Reference no']}</td>
            <td>${wallet['Bank Status']}</td>
            <td>${wallet['accord status']}</td>
            <td>${wallet['RS Status']}</td>
            <td>${wallet['final Status']}</td>
        `;
        tableBody.appendChild(row);
    });

    // Hide loader and loading text, show table when data is available
    loader.style.display = 'none';
    loadingText.style.display = 'none';
    tableHead.style.display = 'table';  // Show table once data is fetched

    updatePaginationControls(filteredData);
}

function updatePaginationControls(filteredData) {
    const paginationContainer = document.querySelector('#pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => {
            currentPage--;
            displayWalletTable(filteredData);
        };
        paginationContainer.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayWalletTable(filteredData);
        };
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        paginationContainer.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            currentPage++;
            displayWalletTable(filteredData);
        };
        paginationContainer.appendChild(nextButton);
    }
}

function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}

async function fetchWalletData() {
    const clientId = getClientId();

    const response = await fetch(`http://localhost:5000/wallet?clientId=${clientId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.ok) {
        const data = await response.json();
        walletData = data.walletData;

        if (walletData.length === 0) {
            // No data found, display the "No Wallet Data" message
            const noWalletMessage = document.querySelector('.noWalletMessage');
            noWalletMessage.style.display = 'block';
            document.querySelector('#wallet-table').style.display = 'none';
        } else {
            displayWalletTable();
        }
    } else {
        const noWalletMessage = document.querySelector('.noWalletMessage');
        noWalletMessage.style.display = 'block';
        document.querySelector('#wallet-table').style.display = 'none';
    }

    // Hide loader once data is fetched or on error
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.loading-text').style.display = 'none';
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

window.onload = fetchWalletData;

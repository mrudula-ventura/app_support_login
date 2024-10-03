let walletData = [];
const rowsPerPage = 10;
let currentPage = 1;


function displayIpoTable(filteredData = walletData) {
    const tableBody = document.querySelector('#wallet-table tbody');
    const tableHead = document.querySelector('#wallet-table');
    const loader = document.querySelector('.loader');
    console.log(tableHead)
    tableBody.innerHTML = '';


    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedWalletData = filteredData.slice(start, end);

    paginatedWalletData.forEach(wallet => {
        const row = document.createElement('tr');


        row.innerHTML = `
            <td>${wallet['client_code']}</td>
            <td>${wallet['Reference no']}</td>
            <td>${wallet['Transaction type']}</td>
            <td>${wallet['Bank Status']}</td>
            <td>${wallet['accord status']}</td>
            <td>${wallet['RS Status']}</td>
            <td>${wallet['final Status']}</td>
            <td>${wallet['amount']}</td>
            <td>${wallet['Timestamp']}</td>

        `;

        tableBody.appendChild(row);
    });


    loader.style.display = 'none';
    tableHead.style.display = 'table';

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
            displayIpoTable(filteredData);
        };
        paginationContainer.appendChild(prevButton);
    }


    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayIpoTable(filteredData);
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
            displayIpoTable(filteredData);
        };
        paginationContainer.appendChild(nextButton);
    }
}

function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}

async function fetchIPOData() {
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
        console.log(data);
        displayIpoTable();
    } else if(response.ok){
     

    }
    else {
        console.error('Error fetching wallet data:', await response.json());
    }
}

function filterwalletTable() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = walletData.filter(wallet =>
        wallet.name.toLowerCase().includes(searchValue) ||
        (wallet.applicationNo && wallet.applicationNo.toLowerCase().includes(searchValue))
    );

    currentPage = 1;
    displayIpoTable(filteredData);
}
window.onload = fetchIPOData;
let ipoData = [];
const rowsPerPage = 15;
let currentPage = 1;
let currentSortColumn = '';
let currentSortDirection = '';

// Function to load client data from localStorage
function loadClientData() {
    const clientData = JSON.parse(localStorage.getItem('clientData'));
    if (clientData) {
        document.getElementById('client-id-display').innerText = clientData.clientId;
        document.getElementById('client-full-name').innerText = clientData.fullName;
        document.getElementById('client-email').innerText = clientData.email;
        document.getElementById('client-mobile').innerText = clientData.mobile;
    } else {
        console.error('No client data found');
    }
}

// On page load, display the client data
window.onload = loadClientData;

function displayIpoTable(filteredData = ipoData) {
    const tableBody = document.querySelector('#ipo-table tbody');
    const loader = document.querySelector('.loader-container');
    const searchInput = document.getElementById('searchInput');
    const noIposMessage = document.querySelector('.no-ipos-message');
    const tableContainer = document.querySelector('.table-container');
    const noMatchesMessage = document.querySelector('.noMatchesMessage'); 
    
    tableBody.innerHTML = ''; // Clear the table body

    // Pagination setup
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedIpoData = filteredData.slice(start, end);

    // Populate the table with IPO data
    paginatedIpoData.forEach(ipo => {
        const row = document.createElement('tr');
        row.innerHTML = `
             <td>${ipo.name}</td>
            <td>${ipo.applyDate}</td>
            <td>${ipo.mandateSentDate}</td>
            <td>${ipo.paymentStatus}</td>
            <td>${ipo.sharesApplied}</td>
            <td>${ipo.lotsApplied}</td>
            <td>${ipo.allotment_status}</td>
            <td>${ipo.allotment_shares}</td>
        `;
        tableBody.appendChild(row);
    });

    // Hide the loader
    loader.style.display = 'none';

    // Always display search input and update the table and message visibility
    searchInput.style.display = 'block';
    if (filteredData.length > 0) {
        tableContainer.style.display = 'block';
        noMatchesMessage.style.display = 'none';
    } else {
        noMatchesMessage.style.display = 'block';
        tableContainer.style.display = 'none';
    }

    updatePaginationControls(filteredData);
}


// Function to update pagination controls
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

// Function to get the client ID from the URL
function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}

// Function to fetch IPO data from the backend
async function fetchIPOData() {
    const clientId = getClientId();
    const loader = document.querySelector('.loader-container');
    const noIposMessage = document.querySelector('.no-ipos-message');
    const tableContainer = document.querySelector('.table-container');
    const searchInput = document.getElementById('searchInput');
    const token = localStorage.getItem('token');

    if (!token) {
        console.log('No token found. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    // Hide table and search input during data fetch
    tableContainer.style.display = 'none';
    searchInput.style.display = 'none';
    loader.style.display = 'flex'; // Show loader

    try {
        const response = await fetch(`http://localhost:5000/ipo?clientId=${clientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            ipoData = data.ipoData;

            if (ipoData.length === 0) {
                noIposMessage.style.display = 'block'; // Show no IPOs message
                loader.style.display = 'none'; // Hide loader
            } else {
                displayIpoTable();  // Display IPO data if available
                loader.style.display = 'none';  // Hide loader after data loads
            }
        } else if (response.status === 401) {
            // If unauthorized, redirect to login page
            window.location.href = 'login.html';
        } else {
            loader.style.display = 'none';  // Hide loader on error
            noIposMessage.textContent = 'No IPOs available for this client ID.';
            noIposMessage.style.display = 'block';
        }
    } catch (error) {
        loader.style.display = 'none';  // Hide loader on error
        console.error('Error fetching IPO data:', error);
    }
}

// Function to filter IPO table by search input
function filterIpoTable() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = ipoData.filter(ipo =>
        ipo.name.toLowerCase().includes(searchValue)
    );

    currentPage = 1;
    displayIpoTable(filteredData);
}

// Sorting function for strings and mandate date
function sortTable(column, direction) {
    const filteredData = ipoData.slice();  // Create a copy of the ipoData array

    // Sort the ipoData array by column and direction
    filteredData.sort((a, b) => {
        let valueA = a[column] ? a[column].toLowerCase() : '';
        let valueB = b[column] ? b[column].toLowerCase() : '';

        if (column === 'mandateSentDate') {
            // Special handling for mandateSentDate (which is in date format)
            valueA = new Date(a[column]);
            valueB = new Date(b[column]);
        }

        if (direction === 'asc') {
            return valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
        } else {
            return valueA > valueB ? -1 : (valueA < valueB ? 1 : 0);
        }
    });

    displayIpoTable(filteredData);  // Re-render the table with sorted data
}

// Function to toggle arrow visibility
function toggleArrows(activeArrowId, inactiveArrowId) {
    document.getElementById(activeArrowId).style.display = 'none';
    document.getElementById(inactiveArrowId).style.display = 'inline';
}

// Event listeners for search input and sorting arrows
document.getElementById('searchInput').addEventListener('input', filterIpoTable);

document.getElementById('ipo-name-asc').addEventListener('click', () => {
    sortTable('name', 'asc');  // Sort by name in ascending order
    toggleArrows('ipo-name-asc', 'ipo-name-desc');
});

document.getElementById('ipo-name-desc').addEventListener('click', () => {
    sortTable('name', 'desc');  // Sort by name in descending order
    toggleArrows('ipo-name-desc', 'ipo-name-asc');
});

document.getElementById('mandate-date-asc').addEventListener('click', () => {
    sortTable('mandateSentDate', 'asc');  // Sort by mandateSentDate in ascending order
    toggleArrows('mandate-date-asc', 'mandate-date-desc');
});

document.getElementById('mandate-date-desc').addEventListener('click', () => {
    sortTable('mandateSentDate', 'desc');  // Sort by mandateSentDate in descending order
    toggleArrows('mandate-date-desc', 'mandate-date-asc');
});

    
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

// Load IPO data when the page is loaded
window.onload = fetchIPOData;

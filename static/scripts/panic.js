let ipoData = [];
const rowsPerPage = 15; 
let currentPage = 1;


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


// Function to display the panic table
function displayPanicTable(filteredData = ipoData) {
    const tableBody = document.querySelector('#panic-table tbody');
    const tableHead = document.querySelector('#panic-table');
    const loader = document.querySelector('.loader-container');
    const searchInput = document.getElementById('searchInput');
    const noDataMessage = document.querySelector('.no-data-message');
    const tableContainer = document.querySelector('.table-container');
    
    tableBody.innerHTML = ''; // Clear the table body

    // Pagination setup
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedIpoData = filteredData.slice(start, end); 

    // Populate the table with panic data
    paginatedIpoData.forEach(panic => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${panic.pageId}</td>
            <td>${panic.response}</td>
            <td>${panic.timestamp}</td>
            <td>${panic.latency}</td>
            <td>${panic.requestPayload}</td>
            <td>${panic.responsePayload}</td>
            <td>${panic.deviceType}</td>
            <td>${panic.section}</td>

`;
        tableBody.appendChild(row);
    });

    // Hide the loader, show the table and search input
     loader.style.display = 'none';
    if (filteredData.length > 0) {
        tableContainer.style.display = 'block';
        searchInput.style.display = 'block';
        noDataMessage.style.display = 'none'; 
    } else {
        noDataMessage.style.display = 'block'; 
        tableContainer.style.display = 'none';
        searchInput.style.display = 'none';
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
            displayPanicTable(filteredData);
        };
        paginationContainer.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayPanicTable(filteredData);
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




// Function to fetch panic data from the backend
async function fetchIPOData() {
    const clientId = getClientId();
    const loader = document.querySelector('.loader-container');
    const noIposMessage = document.querySelector('.no-ipos-message');

    try {
        const response = await fetch(`api`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            panicData = data.panicData;
            console.log(panicData);  // Check the fetched data in console

            loader.style.display = 'none';  // Ensure loader is hidden

            if (panicData.length === 0) {
                noDataMessage.style.display = 'block'; 
            } else {
                displayPanicTable();  
            }
        } else {
            loader.style.display = 'none';  // Ensure loader is hidden on error
            noDataMessage.textContent = 'No data available for this client ID.';
            noDataMessage.style.display = 'block';
            searchInput.style.display='none';
            document.querySelector('.table-container').style.display = 'none';
        }
    } catch (error) {
        loader.style.display = 'none';  // Hide loader on error
        console.error('Error fetching data:', error);
    }
}


// Function to filter the table based on search input
function filterPanicTable() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = panicData.filter(panic => 
        panic.name.toLowerCase().includes(searchValue) ||
        (panic.applicationNo && panic.applicationNo.toLowerCase().includes(searchValue))
    );

    currentPage = 1;

    // Always keep the search bar visible
    const searchInput = document.getElementById('searchInput');
    searchInput.style.display = 'block';

    if (filteredData.length === 0) {
      

        const noIposMessage = document.querySelector('.no-data-message');
        noIposMessage.textContent = 'No data match your search.';
        noIposMessage.style.display = 'block';
        
        
        const tableContainer = document.querySelector('.table-container');
        tableContainer.style.display = 'none';  // Hide the table if no matches
    } else {
       
        const noIposMessage = document.querySelector('.no-data-message');
        noIposMessage.style.display = 'none';
        
        displayIpoTable(filteredData); // Display filtered data
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


// Load IPO data when the page is loaded
window.onload = fetchIPOData;

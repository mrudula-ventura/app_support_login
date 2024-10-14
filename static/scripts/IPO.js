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


// Function to display the IPO table
function displayIpoTable(filteredData = ipoData) {
    const tableBody = document.querySelector('#ipo-table tbody');
    const tableHead = document.querySelector('#ipo-table');
    const loader = document.querySelector('.loader-container');
    const searchInput = document.getElementById('searchInput');
    const noIposMessage = document.querySelector('.no-ipos-message');
    const tableContainer = document.querySelector('.table-container');
    
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
            <td>${ipo.allocated}</td>
            <td>${ipo.allotment_status}</td>
            <td>${ipo.allotment_shares}</td>


        `;
        tableBody.appendChild(row);
    });

    // Hide the loader, show the table and search input
     loader.style.display = 'none';
    if (filteredData.length > 0) {
        tableContainer.style.display = 'block';
        searchInput.style.display = 'block';
        noIposMessage.style.display = 'none'; // Hide no IPO message if data exists
    } else {
        noIposMessage.style.display = 'block'; // Show no IPO message if no data exists
        tableContainer.style.display = 'none'; // Hide table and search input
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

    try {
        const response = await fetch(`http://localhost:5000/ipo?clientId=${clientId}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            ipoData = data.ipoData;
            console.log(ipoData);  // Check the fetched data in console

            loader.style.display = 'none';  // Ensure loader is hidden

            if (ipoData.length === 0) {
                noIposMessage.style.display = 'block'; // Show no IPOs message
            } else {
                displayIpoTable();  // Display IPO data if available
            }
        } else {
            loader.style.display = 'none';  // Ensure loader is hidden on error
            noIposMessage.textContent = 'No IPOs available for this client ID.';
            noIposMessage.style.display = 'block';
            document.querySelector('.table-container').style.display = 'none';
        }
    } catch (error) {
        loader.style.display = 'none';  // Hide loader on error
        console.error('Error fetching IPO data:', error);
    }
}


// Function to filter the IPO table based on search input
function filterIpoTable() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = ipoData.filter(ipo => 
        ipo.name.toLowerCase().includes(searchValue) ||
        (ipo.applicationNo && ipo.applicationNo.toLowerCase().includes(searchValue))
    );

    currentPage = 1;

    // Always keep the search bar visible
    const searchInput = document.getElementById('searchInput');
    searchInput.style.display = 'block';

    if (filteredData.length === 0) {
      

        const noIposMessage = document.querySelector('.no-ipos-message');
        noIposMessage.textContent = 'No IPOs match your search.';
        noIposMessage.style.display = 'block';
        
        
        const tableContainer = document.querySelector('.table-container');
        tableContainer.style.display = 'none';  // Hide the table if no matches
    } else {
       
        const noIposMessage = document.querySelector('.no-ipos-message');
        noIposMessage.style.display = 'none';
        
        displayIpoTable(filteredData); // Display filtered IPO data
    }
}



function goBack() {
    window.history.back();
}








// Load IPO data when the page is loaded
window.onload = fetchIPOData;

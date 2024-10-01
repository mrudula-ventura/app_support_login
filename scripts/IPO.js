let ipoData = [];
const rowsPerPage = 10; 
let currentPage = 1;

function displayIpoTable(filteredData = ipoData) {
    const tableContainer = document.querySelector('.table-container');
    const tableBody = document.querySelector('#ipo-table tbody');
    const noDataMessage = document.createElement('div');
    noDataMessage.style.textAlign = 'center';
    noDataMessage.style.margin = '20px';

    // Clear existing table data
    tableBody.innerHTML = ''; 

    if (filteredData.length === 0) {
        // Show message when no data is found
        noDataMessage.textContent = 'No IPO found for this client ID';
        tableContainer.innerHTML = ''; // Clear the table
        tableContainer.appendChild(noDataMessage); // Add the message
        return; // Exit early since there's no data to display
    }

    // Show the table headers
    const tableHeader = document.createElement('table');
    tableHeader.id = 'ipo-table';
    tableHeader.innerHTML = `
        <thead>
            <tr>
                <th>IPO name</th>
                <th>
                    Application date 
                    <span class="sort-arrows" onclick="sortTableByDate('applyDate', 'asc')">&#9650;</span>
                    <span class="sort-arrows" onclick="sortTableByDate('applyDate', 'desc')">&#9660;</span>
                </th>
                <th>
                    Mandate sent date 
                    <span class="sort-arrows" onclick="sortTableByDate('mandateSentDate', 'asc')">&#9650;</span>
                    <span class="sort-arrows" onclick="sortTableByDate('mandateSentDate', 'desc')">&#9660;</span>
                </th>
                <th>
                    Mandate approved date 
                    <span class="sort-arrows" onclick="sortTableByDate('mandateApproved', 'asc')">&#9650;</span>
                    <span class="sort-arrows" onclick="sortTableByDate('mandateApproved', 'desc')">&#9660;</span>
                </th>
                <th>Allocated</th>
                <th>No of lots applied</th>
                <th>No of lots allocated</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;
    tableContainer.appendChild(tableHeader); // Add table headers

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedIpoData = filteredData.slice(start, end); 

    paginatedIpoData.forEach(ipo => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${ipo.name}</td>
            <td>${ipo.applyDate}</td>
            <td>${ipo.mandateSentDate}</td>
            <td>${ipo.paymentStatus}</td>
            <td>${ipo.allocated}</td>
            <td>${ipo.applicationNo || 'N/A'}</td>
        `;

        tableBody.appendChild(row);
    });

    updatePaginationControls(filteredData);
}

function updatePaginationControls(filteredData) {
    const paginationContainer = document.querySelector('#pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    
    createPaginationButton(paginationContainer, 'Previous', currentPage > 1, () => {
        currentPage--;
        displayIpoTable(filteredData);
    });

    for (let i = 1; i <= totalPages; i++) {
        createPaginationButton(paginationContainer, i.toString(), i !== currentPage, () => {
            currentPage = i;
            displayIpoTable(filteredData);
        });
    }

    createPaginationButton(paginationContainer, 'Next', currentPage < totalPages, () => {
        currentPage++;
        displayIpoTable(filteredData);
    });
}

function createPaginationButton(container, text, enabled, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.disabled = !enabled;
    button.onclick = enabled ? onClick : null;
    container.appendChild(button);
}

function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}

async function fetchIPOData() {
    const clientId = getClientId();
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    // Show loading indicator
    loadingIndicator.style.display = 'block';

    try {
        const response = await fetch(`http://localhost:5000/api/ipos?clientId=${clientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        ipoData = data.ipoData || []; // Handle cases where ipoData might be undefined
        displayIpoTable(); 
    } catch (error) {
        console.error('Error fetching IPO data:', error);
    } finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    }
}

function filterIpoTable() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = ipoData.filter(ipo => 
        ipo.name.toLowerCase().includes(searchValue) ||
        (ipo.applicationNo && ipo.applicationNo.toLowerCase().includes(searchValue))
    );

    currentPage = 1; 
    displayIpoTable(filteredData); 
}

window.onload = fetchIPOData;

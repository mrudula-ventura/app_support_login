let currentPage = 1;
const rowsPerPage = 10; 
let panicData = []; 
let originalPanicData = []; 

// Function to get the client ID from the URL
function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}

// Function to fetch and display panic data
async function fetchAndDisplayPanicData() {
    try {
        const clientId = getClientId(); 
        if (!clientId) {
            throw new Error('Client ID not found in URL.');
        }

        document.getElementById('loader').style.display = 'flex'; 
        const response = await fetch(`http://localhost:5000/panic?clientId=${clientId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        panicData = data.data; // Adjust based on your API structure
        originalPanicData = [...panicData]; // Save a copy of the original data
        
       
        document.getElementById('loader').style.display = 'none'; 

        // Check if there's any panic data
        if (panicData.length === 0) {
            document.getElementById('no-data-message').style.display = 'block'; // Show no data message
            document.getElementById('table-container').style.display = 'none'; // Hide table
            return;
        }

        document.getElementById('no-data-message').style.display = 'none'; // Hide no data message
        document.getElementById('table-container').style.display = 'block'; // Show table

        // Populate the table with data for the current page
        displayPage(currentPage);
    } catch (error) {
        console.error('Failed to fetch panic data:', error);
    }
}

// Function to display the current page of panic data
function displayPage(page) {
    const tableBody = document.querySelector('#panic-table tbody');
    tableBody.innerHTML = ''; // Clear previous table content
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = panicData.slice(start, end);

    paginatedData.forEach(panic => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${panic.device_type}</td>
            <td>${panic.latency}</td>
            <td>${panic.page_id}</td>
            <td>${panic.request_payload}</td>
            <td>${panic.response_code}</td>
            <td>${panic.response_payload}</td>
            <td>${panic.section}</td>
            <td>${panic.timestamp}</td>
            <td>${panic.url}</td>
        `;
        tableBody.appendChild(row);
    });

    updatePaginationInfo(); // Update pagination info after displaying the current page
}

// Function to update pagination info
function updatePaginationInfo() {
    const totalPages = Math.ceil(panicData.length / rowsPerPage);
    const paginationDiv = document.getElementById('pagination');

    // Clear existing pagination content
    paginationDiv.innerHTML = '';

    // Create Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.addEventListener('click', () => changePage(-1));
        paginationDiv.appendChild(prevButton);
    }

    // Create page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.disabled = (i === currentPage); // Disable the button for the current page
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayPage(currentPage);
        });
        paginationDiv.appendChild(pageButton);
    }

    // Create Next button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.addEventListener('click', () => changePage(1));
        paginationDiv.appendChild(nextButton);
    }
}

// Function to change page based on direction
function changePage(direction) {
    currentPage += direction;
    displayPage(currentPage);
}

// Event listeners for search input
document.getElementById('searchInput').addEventListener('input', filterPanicTable);

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
    
    // Fetch data and populate table
    fetchAndDisplayPanicData();
});

// Function to filter panic table based on search input
function filterPanicTable() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const noMatchesMessage = document.getElementById('noMatchesMessage');
    
    // If search input is empty, restore the current page's original data
    if (input === '') {
        panicData = [...originalPanicData];
        displayPage(currentPage);
        noMatchesMessage.style.display = 'none';
        return;
    }

    // Filter only within the current page's data
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = originalPanicData.slice(start, end);

    const filteredData = paginatedData.filter(panic => {
        return (
            panic.device_type.toLowerCase().includes(input) ||
            panic.page_id.toString().includes(input) ||
            panic.section.toLowerCase().includes(input)
        );
    });

    if (filteredData.length > 0) {
        panicData = filteredData;
        noMatchesMessage.style.display = 'none';
        displayPage(currentPage);
    } else {
        noMatchesMessage.style.display = 'block';
        const tableBody = document.querySelector('#panic-table tbody');
        tableBody.innerHTML = ''; // Clear previous table content
    }
}

// Function to go back to the previous page
function goBack() {
    window.history.back();
}

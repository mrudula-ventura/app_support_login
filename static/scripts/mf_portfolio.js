document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#wallet-table tbody');
    const loader = document.querySelector('.loader-container');
    const noMfMessage = document.querySelector('.noMfMessage');
    const currentAmountElem = document.getElementById('crnt_amnt_value');
    const purchaseAmountElem = document.getElementById('prchs_amnt_value');
    const xirrElem = document.getElementById('xirr_value');
    const searchInput = document.getElementById('searchInput');
    const noMatchesMessage = document.querySelector('.noMatchesMessage');
    const tableContainer = document.querySelector('.table-container');

    let mfData = [];
    const rowsPerPage = 15; 
    let currentPage = 1; 

    function getClientId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('clientId');
    }

    async function fetchMFData() {
        const clientId = getClientId();
        try {
            const response = await fetch(`http://localhost:5000/mf?clientId=${clientId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();

                if (data.message) {
                    loader.style.display = 'none';
                    noMfMessage.style.display = 'block';
                    tableContainer.style.display = 'none';
                    searchInput.style.display = 'none';
                    console.log(data.message);
                    return;
                }

                loader.style.display = 'none';
                tableContainer.style.display = 'block';

                mfData = data.Data; // Store fetched data for pagination
                populateTable(); // Populate the table with the data

                currentAmountElem.innerText = `Current Amount: ₹${mfData[0].C_amnt || 0}`;
                purchaseAmountElem.innerText = `Purchase Amount: ₹${mfData[0].P_amt || 0}`;
                xirrElem.innerHTML = `XIRR : ${mfData[0].XIRR}%`;

            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching MF data:', error);
            tableContainer.style.display = 'none';
            alert('Error fetching data.');
        }
    }

    // Function to populate the table with data based on current page
    function populateTable() {
        tableBody.innerHTML = ''; // Clear the table before adding rows
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = mfData.slice(start, end); // Get the current page data

        paginatedData.forEach(mf => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mf.Scheme_name}</td>
                <td>${mf.Asset}</td>
                <td>${mf.Curent_amount}</td>
                <td>${mf.Purchase_amount}</td>
                <td>${mf.Units}</td>
                <td>${mf.Folio_Number}</td>
                <td>${mf.Nav}</td>
                <td>${mf.OnlineFlag}</td>
            `;
            tableBody.appendChild(row);
        });

        updatePaginationControls(); // Update pagination controls after populating the table
    }

    // Function to update pagination controls
    function updatePaginationControls() {
        const paginationContainer = document.querySelector('#pagination');
        paginationContainer.innerHTML = ''; // Clear existing pagination

        const totalPages = Math.ceil(mfData.length / rowsPerPage);

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.onclick = () => {
                currentPage--;
                populateTable();
            };
            paginationContainer.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.onclick = () => {
                currentPage = i;
                populateTable();
            };
            if (i === currentPage) {
                pageButton.disabled = true; // Disable the current page button
            }
            paginationContainer.appendChild(pageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.onclick = () => {
                currentPage++;
                populateTable();
            };
            paginationContainer.appendChild(nextButton);
        }
    }

    // Function to filter the table based on the search input
    function filterIpoTable() {
        const filter = searchInput.value.toLowerCase();
        const filteredData = mfData.filter(mf =>
            mf.Scheme_name.toLowerCase().includes(filter)
        );

        if (filteredData.length === 0) {
            tableContainer.style.display = 'none';
            noMatchesMessage.style.display = 'block';
        } else {
            tableContainer.style.display = 'block';
            noMatchesMessage.style.display = 'none';
            currentPage = 1; // Reset to the first page when filtering
            mfData = filteredData; // Update mfData with filtered data
            populateTable(); // Repopulate the table with the filtered data
        }
    }

    // Attach the filter function to the search input's oninput event
    searchInput.addEventListener('input', filterIpoTable);

   
    fetchMFData();
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

// On page load, display the client data
window.onload = loadClientData;

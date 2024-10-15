document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#wallet-table tbody');
    const loader = document.querySelector('.loader-container');
    const noMfMessage = document.querySelector('.noMfMessage');
    const currentAmountElem = document.getElementById('crnt_amnt_value');
    const purchaseAmountElem = document.getElementById('prchs_amnt_value');
    const xirrElem = document.getElementById('xirr_value');
    const searchInput = document.getElementById('searchInput'); // Get the search bar element
    const noMatchesMessage = document.querySelector('.noMatchesMessage'); // Get the no matches message element
    const tableContainer = document.querySelector('.table-container'); // Get the table container element
    
    let mfData = []; // Store the fetched data globally for filtering later

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

                // If no data, show a message
                if (data.message) {
                    loader.style.display = 'none';
                    noMfMessage.style.display = 'block';
                    tableContainer.style.display = 'none';
                    searchInput.style.display='none';
                    console.log(data.message);
                    return;
                }

                loader.style.display = 'none';
                tableContainer.style.display = 'block';

                // Store the fetched data in a global variable to filter later
                mfData = data.Data;

                let totalCurrentAmount = mfData[0].C_amnt || 0;
                let totalPurchaseAmount = mfData[0].P_amt || 0;
                let xirrelem = mfData[0].XIRR;

                populateTable(mfData.slice(1)); // Populate the table with the data

                // Update the summary amounts
                currentAmountElem.innerText = `Current Amount: ₹${totalCurrentAmount}`;
                purchaseAmountElem.innerText = `Purchase Amount: ₹${totalPurchaseAmount}`;
                xirrElem.innerHTML = `XIRR : ${xirrelem}%`;

            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching MF data:', error);
            tableContainer.style.display = 'none'; // Hide table and search input
            alert('Error fetching data.');
        }
    }

    // Function to populate the table
    function populateTable(data) {
        tableBody.innerHTML = ''; // Clear the table before adding rows
        data.forEach(mf => {
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
    }

    // Function to filter the table based on the search input
    function filterIpoTable() {
        const filter = searchInput.value.toLowerCase(); // Get the value of the search input
        const filteredData = mfData.slice(1).filter(mf => 
            mf.Scheme_name.toLowerCase().includes(filter)
        );

        if (filteredData.length === 0) {
            // No matches found, hide the table and show the no matches message
            
            tableContainer.style.display = 'none';
            noMatchesMessage.style.display = 'block';
        } else {
            // Matches found, show the table and hide the no matches message
            tableContainer.style.display = 'block';
            noMatchesMessage.style.display = 'none';
            populateTable(filteredData); // Repopulate the table with the filtered data
        }
    }

    // Attach the filter function to the search input's oninput event
    searchInput.addEventListener('input', filterIpoTable);

    // Fetch data when the page is loaded
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



// Function to go back
function goBack() {
    window.history.back();
}

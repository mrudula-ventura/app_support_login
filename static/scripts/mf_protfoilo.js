document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#wallet-table tbody');
    const loader = document.createElement('div');


    // Elements for displaying summary
    const currentAmountElem = document.getElementById('crnt_amnt_disp');
    const purchaseAmountElem = document.getElementById('prchs_amnt_disp');
    const xirrElem = document.getElementById('xirr');


    // Function to get the client ID from the URL
function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}


    // Function to fetch MF data
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
                    alert(data.message);
                    return;
                }

                // Remove loader and display the table
                loader.style.display = 'none';
                document.querySelector('.table-container').style.display = 'block';

                const mfData = data.Data;

                // If there's any summary data to display, you can process it here
                let totalCurrentAmount = 0;
                let totalPurchaseAmount = 0;

                // Populating the table with fetched data
                mfData.forEach(mf => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${mf.Scheme_name}</td>
                        <td>${mf.Asset}</td>
                        <td>${mf.Curent_amount}</td>
                        <td>${mf.Purchase_amount}</td>
                        <td>${mf.Units}</td>
                        <td>${mf.Folio_Number}</td>
                        <td>${mf.Nav}</td>
                    `;
                    tableBody.appendChild(row);

                    totalCurrentAmount += parseFloat(mf.Curent_amount || 0);
                    totalPurchaseAmount += parseFloat(mf.Purchase_amount || 0);
                });

                // Update the summary amounts
                currentAmountElem.innerText = `Current Amount: ₹${totalCurrentAmount.toFixed(2)}`;
                purchaseAmountElem.innerText = `Purchase Amount: ₹${totalPurchaseAmount.toFixed(2)}`;

                // Dummy XIRR Calculation (You can replace this with real logic)
                const xirrValue = ((totalCurrentAmount - totalPurchaseAmount) / totalPurchaseAmount * 100).toFixed(2);
                xirrElem.innerText = `XIRR: ${xirrValue}%`;

            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching MF data:', error);
            alert('Error fetching data.');
        }
    }

    // Fetch data when the page is loaded
    fetchMFData();
});

// Function to go back
function goBack() {
    window.history.back();
}

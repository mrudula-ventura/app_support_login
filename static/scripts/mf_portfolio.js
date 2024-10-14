document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#wallet-table tbody');
    // const loader = document.createElement('div');
    const loader = document.querySelector('.loader-container');
    const  noMfMessage=document.querySelector('.noMfMessage')
    // Elements for displaying summary
    const currentAmountElem = document.getElementById('crnt_amnt_value');
    const purchaseAmountElem = document.getElementById('prchs_amnt_value');
    const xirrElem = document.getElementById('xirr_value');



    
    function getClientId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('clientId');
    }



    
    // Function to fetch MF data
    async function fetchMFData() {
        const clientId = getClientId();
        try {
            // const response = await fetch('/mf');
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
                    noMfMessage.style.display ='block';
                    document.querySelector('.table-container').style.display = 'none';
                    
                    console.log(data.message)
                    return ;
                }

                // Remove loader and display the table
                loader.style.display = 'none';
                document.querySelector('.table-container').style.display = 'block';

                const mfData = data.Data;

                // If there's any summary data to display, you can process it here
                let totalCurrentAmount = data.Data[0].C_amnt || 0;
                let totalPurchaseAmount = data.Data[0].P_amt || 0;
                let xirrelem=data.Data[0].XIRR;
                
                // Populating the table with fetched data
                mfData.slice(1).forEach(mf => {
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
                    
                    // totalCurrentAmount += mf.C_amntt || 0;
                    // totalPurchaseAmount += mf.P_amnt || 0;

                    
                });

                // Update the summary amounts
                currentAmountElem.innerText = `Current Amount: ₹${totalCurrentAmount}`;
                purchaseAmountElem.innerText = `Purchase Amount: ₹${totalPurchaseAmount}`;
                xirrElem.innerHTML=`XIRR : ${xirrelem}%`;
                
                // Dummy XIRR Calculation (You can replace this with real logic)
                // const xirrValue = ((totalCurrentAmount - totalPurchaseAmount) / totalPurchaseAmount * 100).toFixed(2);
                // console.log(xirrValue)
                // xirrElem.innerText = `XIRR: ${xirrValue}%`;

            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching MF data:', error);
           
            tableContainer.style.display = 'none'; // Hide table and search input
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
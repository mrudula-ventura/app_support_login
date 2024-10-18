  // Set initial active tab
    document.getElementById("holding-list").classList.add("active");
 
    function getClientId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('clientId');
    }
    const loader = document.querySelector('.loader-container');
    async function loadData() {

        
        loader.style.display = 'flex';  

        const clientId = getClientId();
        const response = await fetch(`http://localhost:5000/get_equity?clientId=${clientId}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        loader.style.display = 'none';  // Ensure loader is hidden
    
        // Display Holding Summary
        const holdingSummary = data[1].result;
        const dailyPLClass = holdingSummary.d_pl >= 0 ? 'profit' : 'loss';
        const totalPLClass = holdingSummary.t_pl >= 0 ? 'profit' : 'loss';
    
        document.getElementById("holding-summary").innerHTML = `
            <div class="summary-row">
                <div class="summary-item">
                    <strong>Current Market Value:</strong><br>
                    <span class="value">₹${holdingSummary.cur_mv}</span>
                </div>
                <div class="summary-item">
                    <strong>Amount Invested:</strong><br>
                    <span class="value">₹${holdingSummary.amt_inv}</span>
                </div>
                <div class="summary-item">
                    <strong>Daily Profit/Loss:</strong><br>
                    <span class="value ${dailyPLClass}">₹${holdingSummary.d_pl} (${(holdingSummary.d_pl / holdingSummary.amt_inv * 100).toFixed(2)}%)</span>
                </div>
                <div class="summary-item">
                    <strong>Total Profit/Loss:</strong><br>
                    <span class="value ${totalPLClass}">₹${holdingSummary.t_pl} (${(holdingSummary.t_pl / holdingSummary.amt_inv * 100).toFixed(2)}%)</span>
                </div>
            </div>
        `;
    
        // Display Holding List
        const holdingList = data[0][8];
    
        if (!Array.isArray(holdingList) || holdingList.length === 0) {
            // If holdingList is not an array or it's empty, show "No holdings available"
            document.querySelector("#holding-list tbody").innerHTML = '<tr><td colspan="8" class="no-data">No holdings available.</td></tr>';
        } else {
            // If there are holdings, map them to the table
            document.querySelector("#holding-list tbody").innerHTML = holdingList.map(holding => {
                const profitClass = holding[16] > 0 ? 'profit' : 'loss';
                const dayProfitClass = holding[14] > 0 ? 'profit' : 'loss';
                return `
                    <tr class="primary-row">
                        <td>${holding[0]}</td>
                        <td>${holding[1]}</td>
                        <td>${holding[6]}</td>
                        <td>₹${holding[12]}</td>
                        <td>₹${holding[7]}</td>
                        <td>₹${holding[8]}</td>
                        <td class="${dayProfitClass}">₹${holding[14]}</td>
                        <td class="${profitClass}">₹${holding[16]}</td>
                    </tr>
                    <tr class="secondary-row">
                        <td>Invested: ₹${holding[5]}</td>
                        <td colspan="5"></td>
                        <td class="${dayProfitClass}">${holding[15]}%</td>
                        <td class="${profitClass}">${holding[17]}%</td>
                    </tr>`;
            }).join('');
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

    window.onload = loadData;

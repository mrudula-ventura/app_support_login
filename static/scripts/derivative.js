
    // Set initial active tab
    document.getElementById("positions-tab").classList.add("active");
    document.getElementById("positions").classList.add("active");

    function showTab(tab) {
        document.querySelectorAll('.tab').forEach(function (el) { el.classList.remove('active'); });
        document.querySelectorAll('.nav').forEach(function (el) { el.classList.remove('active'); });

        document.getElementById(tab).classList.add('active');
        document.getElementById(tab + '-tab').classList.add('active');
    }
    
    function getClientId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('clientId');
    }
    
    async function loadData() {
        const loader = document.querySelector('.loader-container');
        // loader.style.display='flex';
        const clientId = getClientId();
        const response = await fetch(`http://localhost:5000/get_equity?clientId=${clientId}`, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
        const data = await response.json();
        // loader.style.display='none';

        // Display Position Summary
        const positionSummary = data[3].result;
        document.getElementById("position-summary").innerHTML = `
            <strong>Net Obligation:</strong> ${positionSummary.net_obl}<br>
            <strong>Total Profit/Loss:</strong> ${positionSummary.pl}
        `;

        // Display Open Positions
        const openPositions = data[2].result.positions.opn_pos;
        if (Array.isArray(openPositions) && openPositions.length > 0) {
            document.querySelector("#open-position-list tbody").innerHTML = openPositions.map(position => {
                const profitClass = position.pnl > 0 ? 'profit' : 'loss';
                return `
                    <tr>
                        <td>${position.sym}</td>
                        <td>${position.exch}</td>
                        <td>${position.action}</td>
                        <td>${position.t_qty}</td>
                        <td class="${profitClass}">${position.pnl}</td>
                    </tr>`;
            }).join('');
        } else {
            document.querySelector("#open-position-list tbody").innerHTML = '<tr><td colspan="5" class="no-data">No open positions.</td></tr>';
        }

        // Display Closed Positions
        const closedPositions = data[2].result.positions.cls_pos;
        if (Array.isArray(closedPositions) && closedPositions.length > 0) {
            document.querySelector("#closed-position-list tbody").innerHTML = closedPositions.map(position => {
                const profitClass = position.pnl > 0 ? 'profit' : 'loss';
                return `
                    <tr>
                        <td>${position.sym}</td>
                        <td>${position.exch}</td>
                        <td>${position.action}</td>
                        <td>${position.t_qty}</td>
                        <td class="${profitClass}">${position.pnl}</td>
                    </tr>`;
            }).join('');
        } else {
            document.querySelector("#closed-position-list tbody").innerHTML = '<tr><td colspan="5" class="no-data">No closed positions.</td></tr>';
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

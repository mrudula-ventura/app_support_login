
// Set initial active tab
document.getElementById("positions-tab").classList.add("active");
document.getElementById("positions").classList.add("active");

function showTab(tab) {
    document.querySelectorAll('.tab').forEach(function (el) { el.classList.remove('active'); });
    document.querySelectorAll('.nav').forEach(function (el) { el.classList.remove('active'); });

    document.getElementById(tab).classList.add('active');
    document.getElementById(tab + '-tab').classList.add('active');
}



// Function to get the client ID from the URL
function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}

async function loadData() {
    const clientId = getClientId();
    const response = await fetch('/get_equity');
    const data = await response.json();

    // Display Holding Summary
const holdingSummary = data[1].result;
// Determine the classes for profit/loss
const dailyPLClass = holdingSummary.d_pl >= 0 ? 'profit' : 'loss';
const totalPLClass = holdingSummary.t_pl >= 0 ? 'profit' : 'loss';
// Constructing the HTML for the holding summary
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
    // Display Holding List with multi-row structure
    const holdingList = data[0][8];
    if (Array.isArray(holdingList)) {
        document.querySelector("#holding-list tbody").innerHTML = holdingList.map(holding => {
            const profitClass = holding[16] > 0 ? 'profit' : 'loss';  // profit/loss class for overall pnl
            const dayProfitClass = holding[14] > 0 ? 'profit' : 'loss';  // profit/loss class for day pnl
            return `
                <tr class="primary-row">
                    <td>${holding[0]}</td>  <!-- Symbol -->
                    <td>${holding[1]}</td>  <!-- Exchange -->
                    <td>${holding[6]}</td>  <!-- Quantity -->
                    <td>₹${holding[12]}</td> <!-- Avg. Price -->
                    <td>₹${holding[7]}</td>  <!-- LTP -->
                    <td>₹${holding[8]}</td>  <!-- Current Value -->
                    <td class="₹${dayProfitClass}">${holding[14]}</td>  <!-- Day PnL -->
                    <td class="₹${profitClass}">${holding[16]}</td>  <!-- Overall PnL -->
                </tr>
                <tr class="secondary-row">
                    <td>Invested: ₹${holding[5]}</td> <!-- Invested Value -->
                    <td colspan="5"></td>  <!-- Empty space -->
                    <td class="${dayProfitClass}">${holding[15]}%</td>  <!-- Day NCI Percent -->
                    <td class="${profitClass}">${holding[17]}%</td>  <!-- Overall NCI Percent -->
                </tr>`;
        }).join('');
    } else {
        document.querySelector("#holding-list tbody").innerHTML = '<tr><td colspan="8" class="no-data">No holdings available.</td></tr>';
    }

    // Display Position Summary
    const positionSummary = data[3].result;
    document.getElementById("position-summary").innerHTML = `
        <strong>Net Obligation:</strong> ${positionSummary.net_obl}<br>
        <strong>Total Profit/Loss:</strong> ${positionSummary.pl}
    `;

    // Display Open Positions with Profit/Loss Classes
    const openPositions = data[2].result.positions.opn_pos;
    if (Array.isArray(openPositions) && openPositions.length > 0) {
        document.querySelector("#open-position-list tbody").innerHTML = openPositions.map(position => {
            const profitClass = position.pnl > 0 ? 'profit' : 'loss';  // profit/loss class for positions
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

    // Display Closed Positions with Profit/Loss Classes
    const closedPositions = data[2].result.positions.cls_pos;
    if (Array.isArray(closedPositions) && closedPositions.length > 0) {
        document.querySelector("#closed-position-list tbody").innerHTML = closedPositions.map(position => {
            const profitClass = position.pnl > 0 ? 'profit' : 'loss';  // profit/loss class for positions
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

window.onload = loadData;

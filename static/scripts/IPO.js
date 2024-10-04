let ipoData = [];
const rowsPerPage = 10; 
let currentPage = 1;


function displayIpoTable(filteredData = ipoData) {
    const tableBody = document.querySelector('#ipo-table tbody');
    const tableHead = document.querySelector('#ipo-table');
    const loader = document.querySelector('.loader');
    console.log(tableHead)
    tableBody.innerHTML = ''; 

    
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
        `;

        tableBody.appendChild(row);
    });
    loader.style.display = 'none';
    tableHead.style.display = 'table';

    updatePaginationControls(filteredData);
}


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

function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
}

async function fetchIPOData() {
    const clientId = getClientId();

    const response = await fetch(`http://localhost:5000/ipo?clientId=${clientId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.ok) {
        const data = await response.json();
        ipoData = data.ipoData;
        console.log(data); 
        displayIpoTable(); 
    } else if(response.status==400){
        loader.style.display = 'none'; // Hide loader
        noIposMessage.style.display = 'block'; // Show no IPOs message
        tableHead.style.display = 'none'; // Hide table

    }
    else {
        console.error('Error fetching IPO data:', await response.json());
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
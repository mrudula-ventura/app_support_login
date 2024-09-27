// Array of IPO data
const ipoData = [
    {
        name: "IPO 1",
        applyDate: "2024-01-10",
        mandateSentDate: "2024-01-11",
        mandateApproved: "2024-01-12",
        allocated: "Yes"
    },
    {
        name: "IPO 2",
        applyDate: "2023-12-01",
        mandateSentDate: "2023-12-02",
        mandateApproved: "2023-12-03",
        allocated: "No"
    },
    {
        name: "IPO 3",
        applyDate: "2024-02-15",
        mandateSentDate: "2024-02-16",
        mandateApproved: "2024-02-17",
        allocated: "Yes"
    },
    {
        name: "IPO 4",
        applyDate: "2024-03-01",
        mandateSentDate: "2024-03-02",
        mandateApproved: "2024-03-03",
        allocated: "No"
    },
    {
        name: "IPO 5",
        applyDate: "2024-01-10",
        mandateSentDate: "2024-01-11",
        mandateApproved: "2024-01-12",
        allocated: "Yes"
    },
    {
        name: "IPO 6",
        applyDate: "2023-12-01",
        mandateSentDate: "2023-12-02",
        mandateApproved: "2023-12-03",
        allocated: "No"
    },
    {
        name: "IPO 7",
        applyDate: "2024-02-15",
        mandateSentDate: "2024-02-16",
        mandateApproved: "2024-02-17",
        allocated: "Yes"
    },
    {
        name: "IPO 8",
        applyDate: "2024-03-01",
        mandateSentDate: "2024-03-02",
        mandateApproved: "2024-03-03",
        allocated: "No"
    },
    {
        name: "IPO 9",
        applyDate: "2024-03-01",
        mandateSentDate: "2024-03-02",
        mandateApproved: "2024-03-03",
        allocated: "No"
    },
    {
        name: "IPO 10",
        applyDate: "2024-03-01",
        mandateSentDate: "2024-03-02",
        mandateApproved: "2024-03-03",
        allocated: "No"
    }
];



 
    // const clientIdDisplay = document.getElementById('clientIdDisplay');

    // // Display the Client ID at the top of the page
    // if (clientId) {
    //     clientIdDisplay.textContent = `Client ID: ${clientId}`;
    // } else {
    //     clientIdDisplay.textContent = `Client ID: Not Available`;
    // }


// Function to display the table rows dynamically
function displayIpoTable() {
    const tableBody = document.querySelector('#ipo-table tbody');
    
    ipoData.forEach(ipo => {
      
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${ipo.name}</td>
            <td>${ipo.applyDate}</td>
            <td>${ipo.mandateSentDate}</td>
            <td>${ipo.mandateApproved}</td>
            <td>${ipo.allocated}</td>
        `;
        

        tableBody.appendChild(row);
    });
}

window.onload = displayIpoTable;






// // Function to fetch IPO data from the backend API
// async function fetchIpoData() {
//     try {
//         const response = await fetch('http://localhost:3000/api/ipos');
//         const data = await response.json();
//         displayIpoTable(data); // Pass the fetched data to displayIpoTable
//     } catch (error) {
//         console.error('Error fetching IPO data:', error);
//     }
// }

// // Function to display the table rows dynamically
// function displayIpoTable(ipoData) {
//     const tableBody = document.querySelector('#ipo-table tbody');
//     tableBody.innerHTML = ''; // Clear the table body before appending rows
    
//     ipoData.forEach(ipo => {
//         // Create a new row
//         const row = document.createElement('tr');

        
//         // Insert IPO data into each column
//         row.innerHTML = `
//             <td>${ipo.name}</td>
//             <td>${ipo.applyDate}</td>
//             <td>${ipo.mandateSentDate}</td>
//             <td>${ipo.mandateApproved}</td>
//             <td>${ipo.allocated}</td>
//         `;
        
//         // Append the row to the table body
//         tableBody.appendChild(row);
//     });
// }

// // Call the function to fetch IPO data and display the table on page load
// window.onload = fetchIpoData;


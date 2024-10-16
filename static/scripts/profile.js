document.addEventListener('DOMContentLoaded', function () {
    // Function to get the client ID from the URL
    function getClientId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('clientId');
    }

    // Function to show the loader
    function showLoader() {
        const loaderElement = document.getElementById('loader');
        if (loaderElement) {
            loaderElement.style.display = 'flex';
        }
    }

    // Function to hide the loader
    function hideLoader() {
        const loaderElement = document.getElementById('loader');
        if (loaderElement) {
            loaderElement.style.display = 'none';
        }
    }

    // Initially hide all sections including button container
    function hideAllSections() {
        const elementsToHide = document.querySelectorAll('h2, h1, .bank-cards-container, .nominee-cards-container, .segment-cards-container, .demat-cards-container, #userInfo, .button-container');
        elementsToHide.forEach(element => {
            element.style.display = 'none';  // Hide all sections
        });
    }

    // Show sections only when data is fetched
    function showAllSections() {
        const buttons=document.querySelector('.button-container')
        const elementsToShow = document.querySelectorAll('h2, h1, .bank-cards-container, .nominee-cards-container, .segment-cards-container, .demat-cards-container, #userInfo');
        buttons.style.display='block';
        elementsToShow.forEach(element => {
            element.style.display = 'grid';  
            
        });

    }




    //  Function to generate HTML for each bank card
    function createBankCard(account) {
        return `
       
            <div class="bank-card">
                <h2>${account.BANK_NAME}</h2>
                <p><strong>Account No:</strong> ${(account.ACCOUNT_NO)}</p>
                <p><strong>IFSC Code:</strong> ${account.IFSC_CODE}</p>
                <p><strong>Added On:</strong> ${account.BANK_ADDED_DATE}</p>
                <p><strong>Status:</strong> ${account.BANK_ACCOUNT_STATUS}</p>
                <p><strong>Currently Active:</strong> ${account.IS_BANK_CURRENTLY_ACTIVE ? 'true' : 'false'}</p>
                <p><strong>Primary Account:</strong> ${account.IS_BANK_PRIMARY ? 'true' : 'false'}</p>
                <p><strong>Verified:</strong> 
                    <span class="badge ${account.IS_BANK_VERIFIED ? 'true' : 'false'}">
                        ${account.IS_BANK_VERIFIED ? 'true' : 'false'}
                    </span>
                </p>
            </div>
           
        `;
    }

    // Function to generate HTML for each nominee card
    function createNomineeCard(nominee) {
        return `
            <div class="nominee-card">
                <h2>Nominee: ${nominee.name}</h2>
                <p><strong>Relation:</strong> ${nominee.relation}</p>
                <p><strong>Share:</strong> ${nominee.share}%</p>
                <p><strong>Minor:</strong> ${nominee.minor ? 'Yes' : 'No'}</p>
                <p><strong>Date:</strong> ${nominee.date}</p>
                <p><strong>Type:</strong> ${nominee.type}</p>
            </div>
        `;
    }

    // Function to generate HTML for each segment card
    function createSegmentCard(segment) {
        return `
            <div class="segment-card">
                <h2>Segment: ${segment.type}</h2>
                <p><strong>Status:</strong> ${segment.status}</p>
                <p><strong>Active:</strong> ${segment.active ? 'Yes' : 'No'}</p>
                <p><strong>Created Time:</strong> ${segment.created_time}</p>
                <p><strong>Updated Time:</strong> ${segment.updated_time}</p>
            </div>
        `;
    }

    // Function to generate HTML for each demat card
    function createDematCard(demat) {
        return `
            <div class="demat-card">
                <h2>Demat No: ${demat.demat_no}</h2>
                <p><strong>Depository:</strong> ${demat.depository}</p>
                <p><strong>Created Time:</strong> ${demat.created_time}</p>
            </div>
        `;
    }

    // Function to render bank cards
    function displayBankAccounts(bankAccounts) {
        const bankCardsContainer = document.getElementById('bankCards');
        bankCardsContainer.innerHTML = '';  // Clear any existing content

        if (bankAccounts.length === 0) {
            bankCardsContainer.innerHTML = createNoDataCard('bank');
        } else {
            bankAccounts.forEach(account => {
                bankCardsContainer.innerHTML += createBankCard(account);
            });
        }
    }

    // Function to render nominee cards
    function displayNominees(nominees) {
        const nomineeCardsContainer = document.getElementById('nomineeCards');
        nomineeCardsContainer.innerHTML = '';  // Clear any existing content

        if (nominees.length === 0) {
            nomineeCardsContainer.innerHTML = createNoDataCard('nominee');
        } else {
            nominees.forEach(nominee => {
                nomineeCardsContainer.innerHTML += createNomineeCard(nominee);
            });
        }
    }

    // Function to render segment cards
    function displaySegments(segments) {
        const segmentCardsContainer = document.getElementById('segmentCards');
        segmentCardsContainer.innerHTML = '';  // Clear any existing content

        if (segments.length === 0) {
            segmentCardsContainer.innerHTML = createNoDataCard('segment');
        } else {
            segments.forEach(segment => {
                segmentCardsContainer.innerHTML += createSegmentCard(segment);
            });
        }
    }

    // Function to render demat cards
    function displayDemats(demats) {
        const dematCardsContainer = document.getElementById('dematCards');
        dematCardsContainer.innerHTML = '';  // Clear any existing content

        if (demats.length === 0) {
            dematCardsContainer.innerHTML = createNoDataCard('demat');
        } else {
            demats.forEach(demat => {
                dematCardsContainer.innerHTML += createDematCard(demat);
            });
        }
    }

// Function to show a fullscreen message
function showMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'fullscreen-message';
    messageContainer.innerHTML = `<h2 class="no-data-message">${message}</h2>`;
    document.body.appendChild(messageContainer); // Append the message to the body
}


    // Function to display "No Data Available" card
    function createNoDataCard(section) {
        return `
            <div class="${section}-card no-data-card">
                <h2>No Data Available</h2>
            </div>
        `;
    }

    // Function to display user information
    function displayUserInfo(user, add) {
        const userInfoContainer = document.getElementById('userInfo');
        userInfoContainer.innerHTML = `
            <h2>${user.First_Name + ' ' + user.Last_Name}</h2>
            <p><strong>Address:</strong> ${add[0].address}</p>
        `;
    }

  

    // Function to fetch user and bank account data using GET request
    async function fetchUserData() {
        showLoader();  // Show loader before fetching data
        try {
            const clientId = getClientId();
            const response = await fetch(`http://localhost:5000/profile?clientId=${clientId}`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();

                // Check if the response contains a "message" field indicating no data
                if (data.message) {
                    hideAllSections();  // Hide all elements
                    showMessage(data.message);  // Display the message in the center
                } else {
                    // Show sections only when data is available
                    showAllSections(); 
                    displayUserInfo(data.user, data.address);
                    displayBankAccounts(data.accounts);
                    displayNominees(data.nominee);
                    displaySegments(data.segment);
                    displayDemats(data.demat);
                }
            } else {
                console.error('Failed to fetch user or bank account data.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            hideLoader();  // Hide loader after data is fetched
        }
    }

    // Initially hide all sections
    hideAllSections();

    // Call the fetch function when the page loads
    fetchUserData();
});

// Function to show the selected section and hide others
function showSection(section) {
    // Hide all sections
    document.getElementById('bankHeading').style.display = 'none';
    document.getElementById('nomineeHeading').style.display = 'none';
    document.getElementById('segmentHeading').style.display = 'none';
    document.getElementById('dematHeading').style.display = 'none';

    document.getElementById('bankCards').style.display = 'none';
    document.getElementById('nomineeCards').style.display = 'none';
    document.getElementById('segmentCards').style.display = 'none';
    document.getElementById('dematCards').style.display = 'none';

    // Show the selected section
    if (section === 'bank') {
        document.getElementById('bankHeading').style.display = 'grid';
        document.getElementById('bankCards').style.display = 'grid';
    } else if (section === 'nominee') {
        document.getElementById('nomineeHeading').style.display = 'grid';
        document.getElementById('nomineeCards').style.display = 'grid';
    } else if (section === 'segment') {
        document.getElementById('segmentHeading').style.display = 'grid';
        document.getElementById('segmentCards').style.display = 'grid';
    } else if (section === 'demat') {
        document.getElementById('dematHeading').style.display = 'grid';
        document.getElementById('dematCards').style.display = 'grid';
    }

    // Update button active state
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(section + 'Btn').classList.add('active');
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




// document.addEventListener('DOMContentLoaded', function () {
//     // Function to get the client ID from the URL
//     function getClientId() {
//         const params = new URLSearchParams(window.location.search);
//         return params.get('clientId');
//     }

//     // Function to show the loader
//     function showLoader() {
//         const loaderElement = document.getElementById('loader');
//         if (loaderElement) {
//             loaderElement.style.display = 'flex';
//         }
//     }

//     // Function to hide the loader
//     function hideLoader() {
//         const loaderElement = document.getElementById('loader');
//         if (loaderElement) {
//             loaderElement.style.display = 'none';
//         }
//     }

//     // Function to display "No Data Available" card
//     function createNoDataCard(section) {
//         return `
//             <div class="${section}-card no-data-card">
//                 <h2>No Data Available</h2>
//             </div>
//         `;
//     }

//     // Function to display user information including name and address
//     function displayUserInfo(user, add) {
//         const userInfoContainer = document.getElementById('userInfo');
//         userInfoContainer.innerHTML = `
//             <h2>${user.First_Name + ' ' + user.Last_Name}</h2>
//             <p><strong>Address:</strong> ${add[0].address}</p>
//         `;
//     }

//     // Function to generate HTML for each bank card
//     function createBankCard(account) {
//         return `
//             <div class="bank-card">
//                 <h2>${account.BANK_NAME}</h2>
//                 <p><strong>Account No:</strong> ${(account.ACCOUNT_NO)}</p>
//                 <p><strong>IFSC Code:</strong> ${account.IFSC_CODE}</p>
//                 <p><strong>Added On:</strong> ${account.BANK_ADDED_DATE}</p>
//                 <p><strong>Status:</strong> ${account.BANK_ACCOUNT_STATUS}</p>
//                 <p><strong>Currently Active:</strong> ${account.IS_BANK_CURRENTLY_ACTIVE ? 'true' : 'false'}</p>
//                 <p><strong>Primary Account:</strong> ${account.IS_BANK_PRIMARY ? 'true' : 'false'}</p>
//                 <p><strong>Verified:</strong> 
//                     <span class="badge ${account.IS_BANK_VERIFIED ? 'true' : 'false'}">
//                         ${account.IS_BANK_VERIFIED ? 'true' : 'false'}
//                     </span>
//                 </p>
//             </div>
//         `;
//     }

//     // Function to generate HTML for each nominee card
//     function createNomineeCard(nominee) {
//         return `
//             <div class="nominee-card">
//                 <h2>Nominee: ${nominee.name}</h2>
//                 <p><strong>Relation:</strong> ${nominee.relation}</p>
//                 <p><strong>Share:</strong> ${nominee.share}%</p>
//                 <p><strong>Minor:</strong> ${nominee.minor ? 'Yes' : 'No'}</p>
//                 <p><strong>Date:</strong> ${nominee.date}</p>
//                 <p><strong>Type:</strong> ${nominee.type}</p>
//             </div>
//         `;
//     }

//     // Function to generate HTML for each segment card
//     function createSegmentCard(segment) {
//         return `
//             <div class="segment-card">
//                 <h2>Segment: ${segment.type}</h2>
//                 <p><strong>Status:</strong> ${segment.status}</p>
//                 <p><strong>Active:</strong> ${segment.active ? 'Yes' : 'No'}</p>
//                 <p><strong>Created Time:</strong> ${segment.created_time}</p>
//                 <p><strong>Updated Time:</strong> ${segment.updated_time}</p>
//             </div>
//         `;
//     }

//     // Function to generate HTML for each demat card
//     function createDematCard(demat) {
//         return `
//             <div class="demat-card">
//                 <h2>Demat No: ${demat.demat_no}</h2>
//                 <p><strong>Depository:</strong> ${demat.depository}</p>
//                 <p><strong>Created Time:</strong> ${demat.created_time}</p>
//             </div>
//         `;
//     }

//     // Function to render bank cards
//     function displayBankAccounts(bankAccounts) {
//         const bankCardsContainer = document.getElementById('bankCards');
//         bankCardsContainer.innerHTML = '';  // Clear any existing content

//         if (bankAccounts.length === 0) {
//             bankCardsContainer.innerHTML = createNoDataCard('bank');
//         } else {
//             bankAccounts.forEach(account => {
//                 bankCardsContainer.innerHTML += createBankCard(account);
//             });
//         }
//     }

//     // Function to render nominee cards
//     function displayNominees(nominees) {
//         const nomineeCardsContainer = document.getElementById('nomineeCards');
//         nomineeCardsContainer.innerHTML = '';  // Clear any existing content

//         if (nominees.length === 0) {
//             nomineeCardsContainer.innerHTML = createNoDataCard('nominee');
//         } else {
//             nominees.forEach(nominee => {
//                 nomineeCardsContainer.innerHTML += createNomineeCard(nominee);
//             });
//         }
//     }

//     // Function to render segment cards
//     function displaySegments(segments) {
//         const segmentCardsContainer = document.getElementById('segmentCards');
//         segmentCardsContainer.innerHTML = '';  // Clear any existing content

//         if (segments.length === 0) {
//             segmentCardsContainer.innerHTML = createNoDataCard('segment');
//         } else {
//             segments.forEach(segment => {
//                 segmentCardsContainer.innerHTML += createSegmentCard(segment);
//             });
//         }
//     }

//     // Function to render demat cards
//     function displayDemats(demats) {
//         const dematCardsContainer = document.getElementById('dematCards');
//         dematCardsContainer.innerHTML = '';  // Clear any existing content

//         if (demats.length === 0) {
//             dematCardsContainer.innerHTML = createNoDataCard('demat');
//         } else {
//             demats.forEach(demat => {
//                 dematCardsContainer.innerHTML += createDematCard(demat);
//             });
//         }
//     }

// // Function to show a fullscreen message
// function showMessage(message) {
//     const messageContainer = document.createElement('div');
//     messageContainer.className = 'fullscreen-message';
//     messageContainer.innerHTML = `<h2 class="no-data-message">${message}</h2>`;
//     document.body.appendChild(messageContainer); // Append the message to the body
// }

// // Function to hide all other elements
// function hideAllElements() {
//     const elementsToHide = document.querySelectorAll('h2,h1, .bank-cards-container, .nominee-cards-container, .segment-cards-container, .demat-cards-container, #userInfo');
    
//     elementsToHide.forEach(element => {
//         element.style.display = 'none';  // Hide all elements
//     });
// }

// // Function to fetch user and bank account data using GET request
// async function fetchUserData() {
//     showLoader();  // Show loader before fetching data
//     try {
//         const clientId = getClientId();
//         const response = await fetch(`http://localhost:5000/profile?clientId=${clientId}`, { 
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();

//             // Check if the response contains a "message" field indicating no data
//             if (data.message) {
//                 hideAllElements();  // Hide other elements
//                 showMessage(data.message);  // Display the message in the center
//             } else {
//                 // Display user data if available
//                 displayUserInfo(data.user, data.address);
//                 displayBankAccounts(data.accounts);
//                 displayNominees(data.nominee);
//                 displaySegments(data.segment);
//                 displayDemats(data.demat);
//             }
//         } else {
//             console.error('Failed to fetch user or bank account data.');
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     } finally {
//         hideLoader();  // Hide loader after data is fetched
//     }
// }


//     // Call the fetch function when the page loads
//     fetchUserData();

//     // Function to navigate back
//     function goBack() {
//         window.history.back();
//     }
// });

// function goBack() {
//     window.history.back();
// }

// // Function to show the selected section and hide others
// function showSection(section) {
//     // Hide all sections
//     document.getElementById('bankHeading').style.display = 'none';
//     document.getElementById('nomineeHeading').style.display = 'none';
//     document.getElementById('segmentHeading').style.display = 'none';
//     document.getElementById('dematHeading').style.display = 'none';

//     document.getElementById('bankCards').style.display = 'none';
//     document.getElementById('nomineeCards').style.display = 'none';
//     document.getElementById('segmentCards').style.display = 'none';
//     document.getElementById('dematCards').style.display = 'none';

//     // Show the selected section
//     if (section === 'bank') {
//         document.getElementById('bankHeading').style.display = 'block';
//         document.getElementById('bankCards').style.display = 'block';
//     } else if (section === 'nominee') {
//         document.getElementById('nomineeHeading').style.display = 'block';
//         document.getElementById('nomineeCards').style.display = 'block';
//     } else if (section === 'segment') {
//         document.getElementById('segmentHeading').style.display = 'block';
//         document.getElementById('segmentCards').style.display = 'block';
//     } else if (section === 'demat') {
//         document.getElementById('dematHeading').style.display = 'block';
//         document.getElementById('dematCards').style.display = 'block';
//     }

//     // Update button active state
//     document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
//     document.getElementById(section + 'Btn').classList.add('active');
// }


// document.addEventListener('DOMContentLoaded', () => {
//     // Retrieve the data from localStorage
//     const storedData = localStorage.getItem('clientData');
    
//     if (storedData) {
//         const clientData = JSON.parse(storedData);
        
//         // Display the data on this page
//         document.getElementById('client-id-display').innerText = clientData.client_id;
//         document.getElementById('client-full-name').innerText = clientData.Full_Name;
//         document.getElementById('client-email').innerText = clientData.Email;
//         document.getElementById('client-mobile').innerText = clientData["Mobile_No."];
//     } else {
//         console.error('No data found in localStorage.');
//     }
// });


// document.addEventListener('DOMContentLoaded', function () {
//     // Function to get the client ID from the URL
//     function getClientId() {
//         const params = new URLSearchParams(window.location.search);
//         return params.get('clientId');
//     }

//     // Function to show the loader
//     function showLoader() {
//         const loaderElement = document.getElementById('loader');
//         if (loaderElement) {
//             loaderElement.style.display = 'flex';
//         }
//     }

//     // Function to hide the loader
//     function hideLoader() {
//         const loaderElement = document.getElementById('loader');
//         if (loaderElement) {
//             loaderElement.style.display = 'none';
//         }
//     }

//     // Initially hide all elements except the loader and text
//     function hideAllSections() {
//         const elementsToHide = document.querySelectorAll('h2, h1, .bank-cards-container, .nominee-cards-container, .segment-cards-container, .demat-cards-container, #userInfo');
//         elementsToHide.forEach(element => {
//             element.style.display = 'none'; // Hide all sections
//         });
//     }

//     // Show the sections once data is available
//     function showAllSections() {
//         const elementsToShow = document.querySelectorAll('h2, h1, .bank-cards-container, .nominee-cards-container, .segment-cards-container, .demat-cards-container, #userInfo');
//         elementsToShow.forEach(element => {
//             element.style.display = 'block'; // Show all sections
//         });
//     }

//     // Function to display "No Data Available" card
//     function createNoDataCard(section) {
//         return `
//             <div class="${section}-card no-data-card">
//                 <h2>No Data Available</h2>
//             </div>
//         `;
//     }

//     // Function to display user information including name and address
//     function displayUserInfo(user, add) {
//         const userInfoContainer = document.getElementById('userInfo');
//         userInfoContainer.innerHTML = `
//             <h2>${user.First_Name + ' ' + user.Last_Name}</h2>
//             <p><strong>Address:</strong> ${add[0].address}</p>
//         `;
//     }

//     // Add the rest of the functions here...

//     // Function to fetch user and bank account data using GET request
//     async function fetchUserData() {
//         showLoader();  // Show loader before fetching data
//         try {
//             const clientId = getClientId();
//             const response = await fetch(`http://localhost:5000/profile?clientId=${clientId}`, { 
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });

//             if (response.ok) {
//                 const data = await response.json();

//                 // Check if the response contains a "message" field indicating no data
//                 if (data.message) {
//                     hideAllSections();  // Hide all elements
//                     showMessage(data.message);  // Display the message in the center
//                 } else {
//                     // Show sections only when there is valid data
//                     showAllSections(); 
//                     displayUserInfo(data.user, data.address);
//                     displayBankAccounts(data.accounts);
//                     displayNominees(data.nominee);
//                     displaySegments(data.segment);
//                     displayDemats(data.demat);
//                 }
//             } else {
//                 console.error('Failed to fetch user or bank account data.');
//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             hideLoader();  // Hide loader after data is fetched
//         }
//     }

//     // Initially hide all sections
//     hideAllSections();

//     // Call the fetch function when the page loads
//     fetchUserData();
// });
















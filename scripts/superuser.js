

async function fetchClientIdFromBackend(emailOrMobile) {

    const testData = [
        { email: "user1@example.com", mobile: "1234567890", clientId: "ABC123" },
        { email: "user2@example.com", mobile: "0987654321", clientId: "XYZ789" }
    ];


    const user = testData.find(u => u.email === emailOrMobile || u.mobile === emailOrMobile);
    return user ? user.clientId : null;
}


document.getElementById('get-client-id').addEventListener('click', async function () {
    const emailOrMobile = document.getElementById('email-mobile').value;
    const clientIdField = document.getElementById('id');

    if (emailOrMobile.trim() === "") {
        alert("Please enter a valid email or mobile number.");
        return;
    }


    const isPhoneNumber = /^\d+$/.test(emailOrMobile);
    if (isPhoneNumber && emailOrMobile.length !== 10) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }


    const isEmail = emailOrMobile.includes("@");
    if (!isPhoneNumber && !isEmail) {
        alert("Please enter a valid email address with '@'.");
        return;
    }


    const clientId = await fetchClientIdFromBackend(emailOrMobile);


    if (clientId && clientIdField.value.trim() === "") {
        clientIdField.value = clientId;


        window.location.href = `client_page.html?clientId=${clientId}`;
    } else if (!clientId) {
        alert("Client ID not found for the provided email or mobile number.");
    }
});

// Function to handle form submission
document.getElementById('submit-btn').addEventListener('click', function () {
    const clientId = document.getElementById('id').value;
    if (clientId) {

        window.location.href = `client_page.html?clientId=${clientId}`;
    } else {
        alert("Please enter or auto-fill the Client ID.");
    }
});


document.getElementById('manageUser').addEventListener('click', function() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

window.onclick = function(event) {
    if (!event.target.matches('#manageUser')) {
        const dropdownMenu = document.getElementById('dropdownMenu');
        if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
        }
    }
};


//api for sending data to backend 
// async function fetchClientIdFromBackend(emailOrMobile) {
//     try {
//         const response = await fetch('https://your-backend-api.com/get-client-id', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ emailOrMobile, id }) // Send the email or mobile to backend

//         });

//         if (response.ok) {
//             const data = await response.json();
//             return data.clientId;  // Assuming API returns { clientId: "ABC123" }
//         } else {
//             throw new Error('Error fetching client ID');
//         }
//     } catch (error) {
//         console.error(error);
//         alert('Error fetching client ID from the server');
//         return null;
//     }
// }

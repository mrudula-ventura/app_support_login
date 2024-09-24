
        
// function fetchClientId(emailOrMobile) {
    
//     const users = [
//         { email: "user1@example.com", mobile: "1234567890", clientId: "CLIENT123" },
//         { email: "user2@example.com", mobile: "0987654321", clientId: "CLIENT456" },
//         {email:"user3@example.com",mobile:"9876523456",clientId:"CLIENT789"}
//     ];


//     const user = users.find(user => user.email === emailOrMobile || user.mobile === emailOrMobile);
//     return user ? user.clientId : null;
// }


// document.getElementById('get-client-id').addEventListener('click', function () {
//     const emailOrMobile = document.getElementById('email-mobile').value;
//     const clientIdField = document.getElementById('client-id');

//     if (emailOrMobile.trim() === "") {
//         alert("Please enter a valid email or mobile number.");
//         return;
//     }

//     const clientId = fetchClientId(emailOrMobile);

//     // Only autofill if the client ID field is empty
//     if (clientId && clientIdField.value.trim() === "") {
//         clientIdField.value = clientId;
//     } else if (!clientId) {
//         alert("Client ID not found for the provided email or mobile number.");
//     }
// });

// function submitClientId() {
// const clientId = document.getElementById('client-id').value;
// if (clientId) {
// window.location.href = `client_page.html?clientId=${clientId}`;
// } else {
// alert('Please enter a Client ID');
// }
// }

// // function validateMob(){
// //     const mobile=document.getElementById('email-mobile').value;
// //     if(){

// //     }
// // }








// // const clientDatabase = {
// //     "user@example.com": "CLIENT123",
// //     "1234567890": "CLIENT456",
// //     "another@example.com": "CLIENT789"
// // };

// // function searchClientId() {
// //     const emailOrPhone = document.getElementById('email-mobile').value;
// //     const clientIdDisplay = document.getElementById('client-id-display');

// //     if (emailOrPhone) {
// //         const clientId = clientDatabase[emailOrPhone];
// //         if (clientId) {
// //             clientIdDisplay.innerText = `Client ID: ${clientId}`;
// //         } else {
// //             clientIdDisplay.innerText = 'Client ID: ID not found';
// //         }
// //     } else {
// //         alert('Please enter an email or phone number');
// //     }
// // }

// // function submitClientId() {
// //     const clientId = document.getElementById('client-id').value;
// //     if (clientId) {
// //         window.location.href = `client_page.html?clientId=${clientId}`;
// //     } else {
// //         alert('Please enter a Client ID');
// //     }
// // }
// // if (emailOrPhone.trim() === "") {
// //     alert("Please enter a valid email or mobile number.");
// //     return;
// // }

// // const clientId = fetchClientId(emailOrPhone);

// // // Only autofill if the client ID field is empty
// // if (clientId && clientIdField.value.trim() === "") {
// //     clientIdField.value = clientId;
// // } else if (!clientId) {
// //     alert("Client ID not found for the provided email or mobile number.");
// // }




 
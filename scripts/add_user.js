
// document.getElementById('addUser').addEventListener('click', async function () {
//     const newUsrNm = document.getElementById('newUsrNm').value;
//     const newUsrMail = document.getElementById('newUsrMail').value;
//     const newUsrPswd = document.getElementById('newUserPswd').value;
//     const newUserCPswd = document.getElementById('newUserCPswd').value;


//     if (newUsrPswd !== newUserCPswd) {
//         alert("Passwords do not match.");
//         return;
//     }


//     const apiUrl = 'https://endpoint/addUser';


//     const userData = {
//         username: newUsrNm,
//         email: newUsrMail,
//         password: newUsrPswd,
//         superuser: document.querySelector('input[type="checkbox"]').checked
//     };

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(userData)
//         });

//         if (response.ok) {

//             window.location.href = 'superuser.html';
//         } else {
//             alert("Error adding user: " + response.statusText);
//         }
//     } catch (error) {
//         alert("Network error: " + error.message);
//     }
// });

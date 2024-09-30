document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    const submitButton = document.getElementById('submit-btn');
    const clientIdInput = document.getElementById('client-id');
    const manageUserButton = document.getElementById('manageUser');
    const dropdownMenu = document.getElementById('dropdownMenu');

    console.log('submitButton:', submitButton);
    console.log('clientIdInput:', clientIdInput);

    if (!submitButton || !clientIdInput) {
        console.error('Element not found');
        return;
    }

    submitButton.addEventListener('click', async function (event) {
        event.preventDefault();  // Prevent form submission
        const clientId = clientIdInput.value;
        if (clientId.trim() === "") {
            alert("Please enter a valid Client ID.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/get-client-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientIdField: clientId }),
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = `client_page.html?clientId=${clientId}`;
            } else {
                alert("Client ID not found.");
            }
        } catch (error) {
            console.error(error);
            alert('Error checking Client ID from the server');
        }
    });

    if (manageUserButton && dropdownMenu) {
        manageUserButton.addEventListener('click', function() {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        window.onclick = function(event) {
            if (!event.target.matches('#manageUser')) {
                if (dropdownMenu.style.display === 'block') {
                    dropdownMenu.style.display = 'none';
                }
            }
        };
    }
});

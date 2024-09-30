document.getElementById('client-id-display').innerText = getClientId();
        // Get Client ID from URL parameters
        function getClientId() {
            const params = new URLSearchParams(window.location.search);
            return params.get('clientId');
        }
        document.getElementById('client-id-display').innerText = getClientId();
        function openPage(page) {
    const clientId = getClientId();
    if (clientId) {
        window.location.href = `${page}?clientId=${clientId}`;
    } else {
        window.location.href = `${page}`;
    }
}
        // function sendClientIdToBackend(clientId) {
        //     fetch('http://localhost:5000/client', { 
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ clientId: clientId }),
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('Success:', data);
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });
        // }
        window.onload = () => {
            const clientId = getClientId();
            if (clientId) {
                sendClientIdToBackend(clientId);
            }
        };









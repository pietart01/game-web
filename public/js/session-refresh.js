// public/js/session-refresh.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Session refresh script loaded');

    function refreshSession() {
        console.log('Refreshing session...');
        fetch('/api/refresh-user')
            .then(response => response.json())
            .then(data => {
                console.log('Session refresh response:', data);
                if (data.success) {
                    // Update cash display without page reload
                    const cashDisplay = document.querySelector('#cashChargeBtn .font-medium');
                    if (cashDisplay) {
                        const newCash = data.user?.cash || 0;
                        cashDisplay.textContent = '₩' + newCash.toLocaleString();
                    }
                }
            })
            .catch(error => console.error('Error refreshing session:', error));
    }

    // Initial refresh
    refreshSession();

    // Set up interval for periodic refresh
    setInterval(refreshSession, 30000); // every 30 seconds
});

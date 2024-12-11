fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text(); // Read as text first for debugging
    })
    .then(data => {
        console.log('Raw response:', data); // Log the raw response
        try {
            const jsonData = JSON.parse(data); // Parse manually
            console.log(jsonData);
        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

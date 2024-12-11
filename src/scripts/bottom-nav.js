// Bottom Navigation Menu Logic
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', event => {
        // Remove 'active' class from all items
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

        // Add 'active' class to the clicked item
        event.target.classList.add('active');

        // Log the clicked section
        console.log(`Navigated to: ${event.target.getAttribute('href')}`);
    });
});

const notifications = document.getElementById("notifications");
const languageSelect = document.getElementById('languageSelect');

const settingsForm = document.getElementById('settingsForm');

        settingsForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get values from the form
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;

            // You can save these values to a server or local storage
            // For simplicity, we'll just display them here
            alert(`Username: ${username}\nEmail: ${email}`);
        });
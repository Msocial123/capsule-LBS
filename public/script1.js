document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');

    // Adding an event listener for form submission
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const city = document.getElementById('city').value.trim();
        const message = document.getElementById('message').value.trim();

        let valid = true;
        let errorMessage = "";

        // Name validation
        if (name === "") {
            errorMessage += "Name is required.\n";
            valid = false;
        }

        // Email validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            errorMessage += "Please enter a valid email address.\n";
            valid = false;
        }

        // Phone validation (must be 10 digits)
        if (!/^\d{10}$/.test(phone)) {
            errorMessage += "Phone number must be exactly 10 digits.\n";
            valid = false;
        }

        // City validation
        if (city === "") {
            errorMessage += "City is required.\n";
            valid = false;
        }

        // Message validation
        if (message === "") {
            errorMessage += "Message is required.\n";
            valid = false;
        }

        // If form is valid
        if (valid) {
            const formData = {
                name,
                email,
                phone,
                city,
                message
            };

            try {
                // Send the form data to the server using the fetch API
                const response = await fetch('/submitContact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Form submitted successfully!');
                    form.reset(); // Reset the form after successful submission
                } else {
                    alert('Error submitting the form. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting the form.');
            }
        } else {
            // If invalid, show an alert with the error message
            alert(errorMessage);
        }
    });
});

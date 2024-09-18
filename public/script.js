// Function to show the next section after validation
function showNextSection(nextSectionId) {
    const currentSection = document.querySelector('.form-section:not([style*="display: none"])');
    const nextSection = document.getElementById(nextSectionId);

    if (validateSection(currentSection)) {
        currentSection.style.display = 'none';
        nextSection.style.display = 'block';
    }
}

// Function to show the previous section
function showPreviousSection(prevSectionId) {
    const currentSection = document.querySelector('.form-section:not([style*="display: none"])');
    const prevSection = document.getElementById(prevSectionId);

    currentSection.style.display = 'none';
    prevSection.style.display = 'block';
}

// Function to validate each section before moving forward
function validateSection(section) {
    let isValid = true;
    const inputs = section.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        if (!input.checkValidity()) {
            isValid = false;
            input.reportValidity();
        }

        // Additional validation for specific fields
        if (input.name.includes('PinCode')) {
            isValid = validatePinCode(input) && isValid;
        } else if (input.name.includes('Phone')) {
            isValid = validatePhoneNumber(input) && isValid;
        } else if (input.type === 'email') {
            isValid = validateEmail(input) && isValid;
        } else if (input.name === 'itemWeight') {
            isValid = validateWeight(input) && isValid;
        }
    });

    return isValid;
}

// Function to validate the pin code (6 digits)
function validatePinCode(input) {
    const pinCode = input.value.trim();
    const isValid = /^\d{6}$/.test(pinCode); // Must be exactly 6 digits
    if (!isValid) {
        input.setCustomValidity("Invalid pin code. Must be exactly 6 digits.");
        input.reportValidity();
    } else {
        input.setCustomValidity(""); // Reset custom validity
    }
    return isValid;
}

// Function to validate phone numbers with +91 country code (Mobile: +91-xxxxxxxxxx, Landline: +91-xx-xxxxxx)
function validatePhoneNumber(input) {
    const phoneNumber = input.value.trim();
    const phoneType = document.getElementById('phoneType').value;
    
    const mobileRegex = /^\+91-\d{10}$/; // +91-xxxxxxxxxx
    const landlineRegex = /^\+91-\d{2,4}-\d{6,8}$/; // +91-xx-xxxxxx or +91-xxxx-xxxxxx

    let isValid = false;

    if (phoneType === 'mobile') {
        isValid = mobileRegex.test(phoneNumber);
    } else if (phoneType === 'landline') {
        isValid = landlineRegex.test(phoneNumber);
    }

    if (!isValid) {
        input.setCustomValidity("Invalid phone number. Use +91-xxxxxxxxxx for mobile or +91-xx-xxxxxx for landline.");
        input.reportValidity();
    } else {
        input.setCustomValidity(""); // Reset custom validity
    }

    return isValid;
}

// Function to validate email addresses
function validateEmail(input) {
    return input.checkValidity(); // Uses HTML5 built-in email validation
}

// Function to validate weight (must be between 0 and 100)
function validateWeight(input) {
    const weight = parseFloat(input.value);
    const isValid = weight >= 0 && weight <= 100;
    if (!isValid) {
        input.setCustomValidity("Invalid weight. Must be between 0 and 100.");
        input.reportValidity();
    } else {
        input.setCustomValidity(""); // Reset custom validity
    }
    return isValid;
}

// Form submission event handler
document.querySelector('form').addEventListener('submit', function (e) {
    const currentSection = document.querySelector('.form-section:not([style*="display: none"])');
    if (!validateSection(currentSection)) {
        e.preventDefault(); // Prevent form submission if validation fails
    }
});

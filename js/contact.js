// ===== CONTACT FORM HANDLING =====

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('successMessage');
    
    // Form validation
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm(contactForm)) {
            return;
        }
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            await submitContactForm(contactForm);
            
            // Show success message
            successMessage.style.display = 'block';
            contactForm.reset();
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Reset form after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error sending your message. Please try again or email us directly at nexgenaitech7@gmail.com');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    });
    
    // Real-time validation
    contactForm.addEventListener('input', (e) => {
        const input = e.target;
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
            validateField(input);
        }
    });
    
    // Initialize phone input formatting
    const phoneInput = contactForm.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
});

// Form validation
function validateForm(form) {
    let isValid = true;
    
    // Get required fields
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email if present
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        if (!validateEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Validate phone if present
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value) {
        if (!validatePhone(phoneField.value)) {
            showFieldError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    return isValid;
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(field);
    
    // Check required fields
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = field.getAttribute('data-error') || 'This field is required';
    }
    
    // Validate email
    if (field.type === 'email' && value) {
        if (!validateEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Validate phone
    if (field.type === 'tel' && value) {
        if (!validatePhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldSuccess(field);
    }
    
    return isValid;
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation
function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]+$/;
    return re.test(phone);
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff6b6b;
        font-size: 0.9rem;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    field.classList.remove('success');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Show field success
function showFieldSuccess(field) {
    field.classList.add('success');
    field.classList.remove('error');
    clearFieldError(field);
}

// Format phone number
function formatPhoneNumber(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    
    // Format as XXX-XXX-XXXX
    if (value.length > 6) {
        value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length > 3) {
        value = `${value.slice(0, 3)}-${value.slice(3)}`;
    }
    
    input.value = value;
}

// Submit form to Google Sheets
async function submitContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Add timestamp and additional data
    data.timestamp = new Date().toISOString();
    data.source = 'NexGenAiTech Website Contact Form';
    data.pageURL = window.location.href;
    data.userAgent = navigator.userAgent;
    
    // Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxb1RwbEM6Z46wm4LypQd1btaQDoxi35DYb9AOHsV_6f3hWRBHIqi7ybEPffRkvshva3w/exec';
    
    // Send data using fetch
    const response = await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    // Since we're using no-cors mode, we can't read the response
    // But we assume it's successful if no error is thrown
    
    // Send email notification (fallback)
    sendEmailNotification(data);
}

// Fallback email notification
function sendEmailNotification(data) {
    const emailBody = `
New Contact Form Submission:
    
Name: ${data.name || 'N/A'}
Email: ${data.email || 'N/A'}
Phone: ${data.phone || 'N/A'}
Company: ${data.company || 'N/A'}
Service: ${data.service || 'N/A'}
Budget: ${data.budget || 'N/A'}
Timeline: ${data.timeline || 'N/A'}
Message: ${data.message || 'N/A'}
    
Page URL: ${data.pageURL}
Timestamp: ${data.timestamp}
    `.trim();
    
    // You can implement email sending here using a service like EmailJS
    // For now, we'll just log it
    console.log('Email notification would be sent:', emailBody);
}

// Add CSS for form validation
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .form-control.error {
        border-color: #ff6b6b !important;
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2) !important;
    }
    
    .form-control.success {
        border-color: #4CAF50 !important;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2) !important;
    }
    
    .field-error {
        color: #ff6b6b;
        font-size: 0.9rem;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(validationStyles);

// AdjuvantiQ Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initializeNavigation();
    initializeForms();
    initializeScrollEffects();
    initializeMobileNavigation();
    initializeModalHandlers();
});

// Navigation Management
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('href').replace('#', '');
            
            // Handle contact link - scroll to contact section on home page
            if (targetPage === 'contact') {
                // Make sure home page is active
                showPage('home');
                // Update nav to show home as active
                navLinks.forEach(nav => nav.classList.remove('active'));
                document.querySelector('.nav__link[href="#home"]').classList.add('active');
                
                // Scroll to contact section
                setTimeout(() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
                return;
            }
            
            // Update active navigation
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target page
            showPage(targetPage);
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Modal Management - Fixed to prevent unexpected closing
function initializeModalHandlers() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        // Prevent modal from closing when clicking inside modal content
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
        
        // Only close when clicking the backdrop
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDemoModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeDemoModal();
            }
        }
    });
}

function openDemoModal() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input with a small delay to ensure modal is fully rendered
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 150);
    }
}

function closeDemoModal() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            // Clear any validation errors
            const errors = form.querySelectorAll('.field-error');
            errors.forEach(error => error.remove());
            const errorInputs = form.querySelectorAll('.error');
            errorInputs.forEach(input => input.classList.remove('error'));
        }
    }
}

// Form Handling
function initializeForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Demo form
    const demoForm = document.getElementById('demoForm');
    if (demoForm) {
        demoForm.addEventListener('submit', handleDemoSubmit);
    }
    
    // Form validation on input
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidationError);
    });
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!validateContactForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Thank you for your interest! We\'ll be in touch soon to discuss your clinical trial optimization needs.', 'success');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleDemoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!validateDemoForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Simulate demo request
    setTimeout(() => {
        showNotification('Demo request submitted successfully! Our team will contact you within 24 hours to schedule your personalized AdjuvantIQ demo.', 'success');
        closeDemoModal();
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function validateContactForm(data) {
    const requiredFields = ['name', 'email', 'company'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            showFieldError(input, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate email format
    if (data.email && !isValidEmail(data.email)) {
        const emailInput = document.getElementById('email');
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function validateDemoForm(data) {
    const requiredFields = ['demoName', 'demoEmail', 'demoCompany'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        const value = data[field.replace('demo', '').toLowerCase()] || data[field];
        if (!value || value.trim() === '') {
            showFieldError(input, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate email format
    const emailValue = data.demoEmail || data.email;
    if (emailValue && !isValidEmail(emailValue)) {
        const emailInput = document.getElementById('demoEmail');
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Clear previous errors
    clearValidationError(e);
    
    // Check if required field is empty
    if (input.hasAttribute('required') && value === '') {
        showFieldError(input, 'This field is required');
        return;
    }
    
    // Validate email
    if (input.type === 'email' && value !== '' && !isValidEmail(value)) {
        showFieldError(input, 'Please enter a valid email address');
        return;
    }
}

function clearValidationError(e) {
    const input = e.target;
    const errorElement = input.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    input.classList.remove('error');
}

function showFieldError(input, message) {
    // Clear existing error
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    input.classList.add('error');
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-4)';
    
    // Insert error after input
    input.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mobile Navigation
function initializeMobileNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Animate confidence bars when they come into view
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('dashboard-metrics')) {
                    animateConfidenceBars(entry.target);
                } else {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    const dashboardMetrics = document.querySelector('.dashboard-metrics');
    if (dashboardMetrics) {
        observer.observe(dashboardMetrics);
    }
    
    // Animate cards on scroll
    const cards = document.querySelectorAll('.metric-card, .solution-card, .team-member');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

function animateConfidenceBars(container) {
    const confidenceFills = container.querySelectorAll('.confidence-fill');
    confidenceFills.forEach((fill, index) => {
        fill.style.transform = 'scaleX(0)';
        fill.style.transformOrigin = 'left';
        fill.style.transition = 'transform 0.8s ease-out';
        
        setTimeout(() => {
            fill.style.transform = 'scaleX(1)';
        }, index * 200 + 300);
    });
}

// Notification System
function showNotification(message, type = 'info', duration = 6000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: '3000',
        backgroundColor: type === 'success' ? 'var(--color-success)' : 
                        type === 'error' ? 'var(--color-error)' : 
                        'var(--color-info)',
        color: 'white',
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '400px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out'
    });
    
    const notificationContent = notification.querySelector('.notification__content');
    Object.assign(notificationContent.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
    });
    
    const closeButton = notification.querySelector('.notification__close');
    Object.assign(closeButton.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '0',
        lineHeight: '1'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = 'var(--shadow-sm)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// Global functions for onclick handlers
window.openDemoModal = openDemoModal;
window.closeDemoModal = closeDemoModal;

// Enhanced form experience
document.addEventListener('focus', function(e) {
    if (e.target.matches('.form-control')) {
        e.target.parentNode.classList.add('focused');
    }
}, true);

document.addEventListener('blur', function(e) {
    if (e.target.matches('.form-control')) {
        e.target.parentNode.classList.remove('focused');
    }
}, true);

// Loading states for buttons
function setButtonLoading(button, isLoading = true) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = 'Loading...';
        button.disabled = true;
        button.style.opacity = '0.7';
    } else {
        button.textContent = button.dataset.originalText || button.textContent;
        button.disabled = false;
        button.style.opacity = '1';
    }
}

// Accessibility enhancements
document.addEventListener('keydown', function(e) {
    // Tab navigation for modal
    if (e.key === 'Tab') {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Handle scroll-based animations here if needed
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

console.log('AdjuvantIQ application initialized successfully!');
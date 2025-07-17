// DOM elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const navLinks = document.querySelectorAll('.nav-link');
const downloadResumeBtn = document.getElementById('downloadResume');

// Theme management
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.init();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    getPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.updateThemeToggle();
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
                this.updateThemeToggle();
            }
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update navbar background based on theme
        this.updateNavbarBackground();
    }

    updateNavbarBackground() {
        const navbar = document.querySelector('.nav-bar');
        if (this.currentTheme === 'dark') {
            navbar.style.background = 'rgba(38, 40, 40, 0.95)';
        } else {
            navbar.style.background = 'rgba(255, 255, 253, 0.95)';
        }
    }

    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateThemeToggle();
    }

    updateThemeToggle() {
        const icon = themeToggle.querySelector('i');
        themeToggle.classList.remove('dark');
        
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.classList.add('dark');
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Navigation management
class NavigationManager {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.isScrolling = false;
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupMobileMenu();
    }

    setupSmoothScrolling() {
        // Handle all navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                
                if (targetId) {
                    this.scrollToSection(targetId);
                }

                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            this.isScrolling = true;
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Reset scrolling flag after animation
            setTimeout(() => {
                this.isScrolling = false;
            }, 1000);
        }
    }

    setupActiveNavigation() {
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                this.updateActiveNavLink();
            }
        });

        // Set initial active link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const scrollPosition = window.scrollY + 150;
        let currentSection = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        // Update active states
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // Special case for home section when at top
        if (window.scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        }
    }

    setupMobileMenu() {
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && !navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        navMenu.classList.toggle('active');
        this.updateMobileMenuToggle();
    }

    closeMobileMenu() {
        navMenu.classList.remove('active');
        this.updateMobileMenuToggle();
    }

    updateMobileMenuToggle() {
        const spans = mobileMenuToggle.querySelectorAll('span');
        const isActive = navMenu.classList.contains('active');

        spans.forEach((span, index) => {
            if (isActive) {
                if (index === 0) {
                    span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                } else if (index === 1) {
                    span.style.opacity = '0';
                } else if (index === 2) {
                    span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                }
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    }
}

// Resume download functionality
class ResumeManager {
    constructor() {
        this.init();
    }

    init() {
        if (downloadResumeBtn) {
            downloadResumeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadResume();
            });
        }
    }

    downloadResume() {
        // Show loading state
        const originalText = downloadResumeBtn.innerHTML;
        downloadResumeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        downloadResumeBtn.disabled = true;

        // Generate PDF resume
        setTimeout(() => {
            this.generatePDF();
            
            // Reset button
            downloadResumeBtn.innerHTML = originalText;
            downloadResumeBtn.disabled = false;
        }, 1000);
    }

    generatePDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Add content to PDF
            doc.setFontSize(20);
            doc.text('KOTTAKOTA ARAVIND', 20, 30);
            
            doc.setFontSize(14);
            doc.text('Software Developer', 20, 45);
            
            doc.setFontSize(12);
            doc.text('Email: aravindkottakota1@gmail.com', 20, 60);
            doc.text('Phone: +91-8179245718', 20, 70);
            doc.text('Location: India', 20, 80);
            doc.text('LinkedIn: https://linkedin.com/in/aravindkottakota', 20, 90);
            doc.text('GitHub: https://github.com/aravind667', 20, 100);

            // Professional Summary
            doc.setFontSize(16);
            doc.text('Professional Summary', 20, 120);
            doc.setFontSize(11);
            const summary = 'Software Developer with 2+ years of experience at L&T Technology Services,\nspecializing in Java, Python, Django for web application development. Expertise in\noptimizing backend performance, automating workflows with AI/ML, and integrating\nREST APIs. Proficient in full-stack development, achieving a 25% increase in system\nefficiency and mentoring junior developers.';
            doc.text(summary, 20, 130);

            // Experience
            doc.setFontSize(16);
            doc.text('Professional Experience', 20, 170);
            doc.setFontSize(12);
            doc.text('Software Engineer - L&T Technology Services', 20, 185);
            doc.setFontSize(10);
            doc.text('Jan 2022 - Present', 20, 195);
            doc.setFontSize(11);
            const experience = '• Directed the transition of a Django-based platform to Jenkins, improving\n  scalability by 35% and cutting operational costs\n• Automated compliance tasks using Java, resulting in significant improvements\n  in reporting efficiency\n• Collaborated on full-stack development using Python/Django and React.js\n• Integrated multiple systems with REST APIs for seamless data exchange\n• Reduced query execution times by 25% and improved PostgreSQL scalability by 50%';
            doc.text(experience, 20, 205);

            // Education
            doc.setFontSize(16);
            doc.text('Education', 20, 250);
            doc.setFontSize(12);
            doc.text('Bachelor of Technology in Computer Science, Cybersecurity', 20, 265);
            doc.setFontSize(11);
            doc.text('Lovely Professional University, Phagwara, India', 20, 275);
            doc.text('Jun 2018 – May 2022', 20, 285);

            // Save the PDF
            doc.save('Aravind_Kottakota_Resume.pdf');
            
            // Show success message
            this.showDownloadSuccess();
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showDownloadError();
        }
    }

    showDownloadSuccess() {
        const toast = this.createToast('Resume downloaded successfully!', 'success');
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    showDownloadError() {
        const toast = this.createToast('Error downloading resume. Please try again.', 'error');
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 12px 24px;
            background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        `;
        return toast;
    }
}

// Form management
class FormManager {
    constructor() {
        this.form = contactForm;
        this.status = formStatus;
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormSubmission();
            this.setupFormValidation();
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm()) {
                return;
            }

            await this.submitForm();
        });
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (!value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
        } else {
            // Email validation
            if (fieldName === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
            }

            // Name validation
            if (fieldName === 'name') {
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long.';
                }
            }

            // Message validation
            if (fieldName === 'message') {
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long.';
                }
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = 'var(--color-error)';
        field.style.boxShadow = '0 0 0 3px rgba(var(--color-error-rgb), 0.1)';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-sm);
            margin-top: var(--space-4);
            display: block;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    async submitForm() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            const formData = new FormData(this.form);
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showStatus('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.');
                this.form.reset();
                this.clearAllFieldErrors();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showStatus('error', 'Oops! There was a problem sending your message. Please try again or contact me directly at aravindkottakota1@gmail.com');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    clearAllFieldErrors() {
        const fields = this.form.querySelectorAll('input, textarea');
        fields.forEach(field => this.clearFieldError(field));
    }

    showStatus(type, message) {
        this.status.textContent = message;
        this.status.className = `form-status ${type}`;
        this.status.style.display = 'block';
        
        // Scroll to status message
        this.status.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            this.status.style.display = 'none';
        }, 8000);
    }
}

// Animation manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.addCustomAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(`
            .hero-text,
            .hero-image,
            .about-text,
            .about-highlights,
            .timeline-item,
            .project-card,
            .education-item,
            .skill-category,
            .contact-item,
            .contact-form-container,
            .achievement-item
        `);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    addCustomAnimations() {
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .hero-buttons .btn:hover {
                animation: pulse 0.6s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize application
class App {
    constructor() {
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.formManager = new FormManager();
        this.animationManager = new AnimationManager();
        this.resumeManager = new ResumeManager();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleInitialLoad();
    }

    setupEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.themeManager.toggle();
        });

        // Handle scroll for navbar background
        window.addEventListener('scroll', this.throttle(() => {
            const navbar = document.querySelector('.nav-bar');
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            }
        }, 100));

        // Handle resize events
        window.addEventListener('resize', this.debounce(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                this.navigationManager.closeMobileMenu();
            }
        }, 250));

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    handleInitialLoad() {
        // Set initial active nav link
        setTimeout(() => {
            this.navigationManager.updateActiveNavLink();
        }, 100);
        
        // Add initial animations with staggered delay
        setTimeout(() => {
            const heroText = document.querySelector('.hero-text');
            const heroImage = document.querySelector('.hero-image');
            
            if (heroText) {
                heroText.classList.add('fade-in-up');
            }
            
            setTimeout(() => {
                if (heroImage) {
                    heroImage.classList.add('fade-in-up');
                }
            }, 300);
        }, 200);
    }

    // Utility methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations or heavy operations
        console.log('Page hidden - pausing operations');
    } else {
        // Resume operations
        console.log('Page visible - resuming operations');
    }
});

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Could show user-friendly error message here
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could show user-friendly error message here
});

// Preload critical resources
window.addEventListener('load', () => {
    // Preload any critical resources
    console.log('Page fully loaded');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        NavigationManager,
        FormManager,
        AnimationManager,
        ResumeManager,
        App
    };
}
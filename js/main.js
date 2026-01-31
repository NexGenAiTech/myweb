// ===== COMMON UTILITIES =====

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Initialize animations after preloader
        setTimeout(initializeAnimations, 100);
    }, 1500);
});

// Mobile Sidebar
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileSidebar = document.getElementById('mobileSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
    mobileSidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    mobileSidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openSidebar);
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Close sidebar when clicking on a link
document.querySelectorAll('.mobile-sidebar a').forEach(link => {
    link.addEventListener('click', closeSidebar);
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    // Back to top button
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#!') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without page reload
            history.pushState(null, null, targetId);
        }
    });
});

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Observe cards for animation
    document.querySelectorAll('.value-card, .service-card, .industry-card, .stack-category, .feature-item').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]+$/;
    return re.test(phone);
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'copy-success';
        successMsg.textContent = 'Copied to clipboard!';
        successMsg.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--deepseek-blue);
            color: white;
            padding: 10px 20px;
            border-radius: var(--border-radius-sm);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(successMsg);
            }, 300);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Current year in footer
const currentYear = new Date().getFullYear();
const yearElement = document.getElementById('currentYear');
if (yearElement) {
    yearElement.textContent = currentYear;
}

// Lazy loading images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile sidebar
    if (e.key === 'Escape' && mobileSidebar?.classList.contains('active')) {
        closeSidebar();
    }
    
    // Tab key navigation focus styling
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Error boundary for JavaScript errors
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You can send this to your error tracking service
});

// Performance monitoring
window.addEventListener('load', () => {
    // Report LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
    });
    
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Report CLS
    const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        console.log('CLS:', entries.reduce((acc, entry) => acc + entry.value, 0));
    });
    
    clsObserver.observe({ entryTypes: ['layout-shift'] });
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements
    document.querySelectorAll('section').forEach((section, index) => {
        section.classList.add('animate-on-scroll');
    });
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', (e) => {
            const title = e.target.getAttribute('title');
            if (title) {
                const tooltipEl = document.createElement('div');
                tooltipEl.className = 'custom-tooltip';
                tooltipEl.textContent = title;
                tooltipEl.style.cssText = `
                    position: fixed;
                    background: var(--deepseek-card-bg);
                    color: var(--deepseek-white);
                    padding: 8px 12px;
                    border-radius: var(--border-radius-sm);
                    font-size: 0.9rem;
                    z-index: 10000;
                    border: 1px solid var(--deepseek-gray);
                    box-shadow: var(--shadow);
                `;
                document.body.appendChild(tooltipEl);
                
                const rect = e.target.getBoundingClientRect();
                tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2}px`;
                tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 10}px`;
                
                e.target.removeAttribute('title');
                e.target.dataset.originalTitle = title;
            }
        });
        
        tooltip.addEventListener('mouseleave', (e) => {
            const tooltipEl = document.querySelector('.custom-tooltip');
            if (tooltipEl) {
                tooltipEl.remove();
            }
            if (e.target.dataset.originalTitle) {
                e.target.setAttribute('title', e.target.dataset.originalTitle);
            }
        });
    });
});

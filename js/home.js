// ===== HOME PAGE SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Create particle background for hero section
    createParticleBackground();
    
    // Enhanced hover effects for service cards
    enhanceServiceCards();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Counters animation
    initCounters();
    
    // Initialize typing effect for hero title
    initTypingEffect();
});

// Particle Background
function createParticleBackground() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    heroSection.appendChild(particlesContainer);
    
    // Create particles
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${posX}%;
            top: ${posY}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            background: ${i % 3 === 0 ? 'var(--deepseek-blue)' : i % 3 === 1 ? 'var(--deepseek-light-blue)' : 'var(--deepseek-white)'};
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Enhanced Service Cards
function enhanceServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Add mouse move effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.3s ease';
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.backgroundPosition = `center ${rate}px`;
        }
    });
    
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.value-card, .service-card, .industry-card');
    
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        elementObserver.observe(el);
    });
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const increment = target / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Typing Effect for Hero Title
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    const words = originalText.split(' ');
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function type() {
        const currentWord = words[currentWordIndex];
        
        if (isPaused) {
            setTimeout(type, 1000);
            isPaused = false;
            isDeleting = true;
            return;
        }
        
        if (isDeleting) {
            // Delete characters
            heroTitle.textContent = words.slice(0, currentWordIndex).join(' ') + ' ' + 
                                  currentWord.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                setTimeout(type, 500);
                return;
            }
        } else {
            // Type characters
            heroTitle.textContent = words.slice(0, currentWordIndex).join(' ') + ' ' + 
                                  currentWord.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            
            if (currentCharIndex === currentWord.length) {
                isPaused = true;
            }
        }
        
        setTimeout(type, isDeleting ? 50 : 100);
    }
    
    // Start typing effect after 2 seconds
    setTimeout(type, 2000);
}

// Mouse trail effect
function initMouseTrail() {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--deepseek-blue);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.5;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
        display: none;
    `;
    document.body.appendChild(trail);
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        trail.style.display = 'block';
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
    
    // Hide trail when mouse leaves window
    document.addEventListener('mouseleave', () => {
        trail.style.display = 'none';
    });
}

// Initialize mouse trail on user interaction
document.addEventListener('click', () => {
    initMouseTrail();
}, { once: true });

// Lazy load images with intersection observer
function lazyLoadImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Call lazy load on DOM content loaded
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add CSS for loaded images
const style = document.createElement('style');
style.textContent = `
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

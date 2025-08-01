document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.innerHTML = '☰';
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.style.display = 'none';
    mobileMenuToggle.style.background = 'none';
    mobileMenuToggle.style.border = 'none';
    mobileMenuToggle.style.fontSize = '1.5rem';
    mobileMenuToggle.style.cursor = 'pointer';
    
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');
    
    // Insert mobile toggle button
    navContainer.insertBefore(mobileMenuToggle, navMenu);
    
    // Mobile menu functionality
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('mobile-active');
    });
    
    // Product filter tabs
    const filterTabs = document.querySelectorAll('.tab');
    const productCards = document.querySelectorAll('.product-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Add animation effect
            productCards.forEach(card => {
                card.style.opacity = '0.5';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 150);
            });
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.product-card, .benefit, .testimonial, .gallery-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '%';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '%';
            }
        }
        updateCounter();
    }
    
    // Animate stats when they come into view
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, target);
                statObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });
    
    // Product card hover effects
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        });
    });
    
    // CTA button effects
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = (e.offsetX - 10) + 'px';
            ripple.style.top = (e.offsetY - 10) + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Gallery item click handler
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Testimonial carousel (if needed)
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    
    function showNextTestimonial() {
        if (window.innerWidth <= 768) {
            testimonials.forEach((testimonial, index) => {
                if (index === currentTestimonial) {
                    testimonial.style.display = 'block';
                } else {
                    testimonial.style.display = 'none';
                }
            });
            
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        } else {
            testimonials.forEach(testimonial => {
                testimonial.style.display = 'block';
            });
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            mobileMenuToggle.style.display = 'block';
            showNextTestimonial();
        } else {
            mobileMenuToggle.style.display = 'none';
            navMenu.classList.remove('mobile-active');
            testimonials.forEach(testimonial => {
                testimonial.style.display = 'block';
            });
        }
    });
    
    // Initial setup
    if (window.innerWidth <= 768) {
        mobileMenuToggle.style.display = 'block';
        showNextTestimonial();
    }
    
    // Form validation (if forms are added later)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Search functionality placeholder
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            alert('Search functionality coming soon!');
        });
    }
    
    // Cart functionality placeholder
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            alert('Shopping cart coming soon!');
        });
    }
});

// CSS animations for ripple effect
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.mobile-menu-toggle {
    display: none !important;
}

@media (max-width: 768px) {
    .mobile-menu-toggle {
        display: block !important;
    }
    
    .nav-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        z-index: 1000;
    }
    
    .nav-menu.mobile-active {
        display: flex;
    }
    
    .nav-menu a {
        padding: 0.75rem 0;
        border-bottom: 1px solid #E5E7EB;
    }
    
    .nav-menu a:last-child {
        border-bottom: none;
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);
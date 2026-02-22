document.addEventListener('DOMContentLoaded', function() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile menu toggle - accessible
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.innerHTML = '&#9776;';
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.setAttribute('aria-label', 'Open menu');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-controls', 'main-nav');
    mobileMenuToggle.style.display = 'none';

    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');

    // Add id for aria-controls reference
    if (navMenu) {
        navMenu.id = 'main-nav';
    }

    // Insert mobile toggle button
    navContainer.insertBefore(mobileMenuToggle, navMenu);

    // Mobile menu functionality with ARIA
    function toggleMobileMenu() {
        const isOpen = navMenu.classList.toggle('mobile-active');
        mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
        mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        mobileMenuToggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
    }

    function closeMobileMenu() {
        navMenu.classList.remove('mobile-active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Open menu');
        mobileMenuToggle.innerHTML = '&#9776;';
    }

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('mobile-active')) {
            closeMobileMenu();
            mobileMenuToggle.focus();
        }
    });

    // Close mobile menu when a nav link is clicked
    navMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Product filter tabs
    const filterTabs = document.querySelectorAll('.tab');
    const productCards = document.querySelectorAll('.product-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const isAlreadyActive = this.classList.contains('active');

            filterTabs.forEach(t => t.classList.remove('active'));

            let filterCategory = null;

            if (!isAlreadyActive) {
                this.classList.add('active');
                filterCategory = this.getAttribute('data-filter');
            }

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (prefersReducedMotion) {
                    if (filterCategory === null || cardCategory === filterCategory) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        if (filterCategory === null || cardCategory === filterCategory) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        } else {
                            card.style.display = 'none';
                        }
                    }, 200);
                }
            });
        });
    });

    // Smooth scrolling for navigation links (respects reduced motion)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
                // Move focus to target for keyboard users
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });

    // Intersection Observer for staggered animations (skip if reduced motion)
    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const parent = entry.target.parentElement;
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = index * 0.1 + 's';
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.product-card, .benefit, .testimonial, .gallery-item');
        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });

        // Subtle parallax on hero image
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            window.addEventListener('scroll', function() {
                const scrollY = window.scrollY;
                if (scrollY < 800) {
                    heroImage.style.transform = 'translateY(' + (scrollY * 0.08) + 'px)';
                }
            }, { passive: true });
        }

        // Counter animation for stats
        function animateCounter(element, target, unit, duration) {
            unit = unit || '%';
            duration = duration || 2000;
            var start = 0;
            var increment = target / (duration / 16);

            function updateCounter() {
                start += increment;
                if (start < target) {
                    element.textContent = Math.floor(start) + unit;
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target + unit;
                }
            }
            updateCounter();
        }

        var statNumbers = document.querySelectorAll('.stat-number');
        var statObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    var originalText = entry.target.textContent;
                    var target = parseInt(originalText);
                    var unit = originalText.includes('g') ? 'g' : '%';
                    animateCounter(entry.target, target, unit);
                    statObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => {
            statObserver.observe(stat);
        });
    }

    // Product card hover effects
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!prefersReducedMotion) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
            }
        });

        card.addEventListener('mouseleave', function() {
            if (!prefersReducedMotion) {
                this.style.transform = 'translateY(-5px) scale(1)';
                this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            }
        });
    });

    // CTA button ripple effects (skip if reduced motion)
    if (!prefersReducedMotion) {
        var ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                var ripple = document.createElement('span');
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

                setTimeout(function() {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Testimonials Carousel - accessible
    var carousel = {
        track: document.querySelector('.testimonials-track'),
        testimonials: document.querySelectorAll('.testimonial'),
        prevBtn: document.querySelector('.prev-btn'),
        nextBtn: document.querySelector('.next-btn'),
        dots: document.querySelectorAll('.dot'),
        currentSlide: 0,
        autoPlayTimer: null,

        init: function() {
            if (!this.track) return;

            this.updateCarousel();
            this.addEventListeners();
            this.addTouchSupport();
        },

        updateCarousel: function() {
            var translateX = -this.currentSlide * 100;
            this.track.style.transform = 'translateX(' + translateX + '%)';

            // Update dots - ARIA selected state
            this.dots.forEach(function(dot, index) {
                var isActive = index === this.currentSlide;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', String(isActive));
            }.bind(this));

            // Update button states
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentSlide === 0;
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = this.currentSlide === this.testimonials.length - 1;
            }
        },

        goToSlide: function(slideIndex) {
            this.currentSlide = Math.max(0, Math.min(slideIndex, this.testimonials.length - 1));
            this.updateCarousel();
        },

        nextSlide: function() {
            this.goToSlide(this.currentSlide + 1);
        },

        prevSlide: function() {
            this.goToSlide(this.currentSlide - 1);
        },

        addEventListeners: function() {
            var self = this;

            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', function() { self.nextSlide(); });
            }
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', function() { self.prevSlide(); });
            }

            this.dots.forEach(function(dot, index) {
                dot.addEventListener('click', function() { self.goToSlide(index); });
            });

            // Keyboard support for carousel
            var carouselContainer = this.track ? this.track.closest('.testimonials-carousel') : null;
            if (carouselContainer) {
                carouselContainer.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        self.prevSlide();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        self.nextSlide();
                    }
                });
            }

            // Auto-play only if reduced motion is not preferred
            if (!prefersReducedMotion) {
                this.autoPlayTimer = setInterval(function() {
                    if (self.currentSlide === self.testimonials.length - 1) {
                        self.goToSlide(0);
                    } else {
                        self.nextSlide();
                    }
                }, 5000);
            }
        },

        addTouchSupport: function() {
            var self = this;
            var startX = 0;
            var currentX = 0;
            var isDragging = false;

            this.track.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                isDragging = true;
                self.track.style.transition = 'none';
            });

            this.track.addEventListener('touchmove', function(e) {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                var diffX = currentX - startX;
                var translateX = (-self.currentSlide * 100) + (diffX / self.track.offsetWidth * 100);
                self.track.style.transform = 'translateX(' + translateX + '%)';
            });

            this.track.addEventListener('touchend', function() {
                if (!isDragging) return;
                isDragging = false;
                self.track.style.transition = 'transform 0.5s ease';
                var diffX = currentX - startX;
                var threshold = self.track.offsetWidth * 0.25;
                if (Math.abs(diffX) > threshold) {
                    if (diffX > 0) { self.prevSlide(); } else { self.nextSlide(); }
                } else {
                    self.updateCarousel();
                }
            });

            // Mouse drag support
            var isMouseDown = false;

            this.track.addEventListener('mousedown', function(e) {
                startX = e.clientX;
                isMouseDown = true;
                self.track.style.transition = 'none';
                self.track.style.cursor = 'grabbing';
            });

            this.track.addEventListener('mousemove', function(e) {
                if (!isMouseDown) return;
                currentX = e.clientX;
                var diffX = currentX - startX;
                var translateX = (-self.currentSlide * 100) + (diffX / self.track.offsetWidth * 100);
                self.track.style.transform = 'translateX(' + translateX + '%)';
            });

            this.track.addEventListener('mouseup', function() {
                if (!isMouseDown) return;
                isMouseDown = false;
                self.track.style.transition = 'transform 0.5s ease';
                self.track.style.cursor = 'grab';
                var diffX = currentX - startX;
                var threshold = self.track.offsetWidth * 0.25;
                if (Math.abs(diffX) > threshold) {
                    if (diffX > 0) { self.prevSlide(); } else { self.nextSlide(); }
                } else {
                    self.updateCarousel();
                }
            });

            this.track.addEventListener('mouseleave', function() {
                if (isMouseDown) {
                    isMouseDown = false;
                    self.track.style.transition = 'transform 0.5s ease';
                    self.track.style.cursor = 'grab';
                    self.updateCarousel();
                }
            });

            this.track.style.cursor = 'grab';
        }
    };

    carousel.init();

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            mobileMenuToggle.style.display = 'block';
        } else {
            mobileMenuToggle.style.display = 'none';
            closeMobileMenu();
        }
    });

    // Initial setup
    if (window.innerWidth <= 768) {
        mobileMenuToggle.style.display = 'block';
    }

    // Form validation
    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

});

// CSS animations for ripple effect
var rippleCSS = '\
@keyframes ripple {\
    to {\
        transform: scale(4);\
        opacity: 0;\
    }\
}\
\
.mobile-menu-toggle {\
    display: none !important;\
}\
\
@media (max-width: 768px) {\
    .mobile-menu-toggle {\
        display: block !important;\
    }\
    \
    .nav-menu {\
        display: none;\
        position: absolute;\
        top: 100%;\
        left: 0;\
        right: 0;\
        background: var(--light-bg);\
        flex-direction: column;\
        padding: 1rem;\
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);\
        z-index: 1000;\
    }\
    \
    .nav-menu.mobile-active {\
        display: flex;\
    }\
    \
    .nav-menu a {\
        padding: 0.75rem 0;\
        border-bottom: 1px solid #E5E7EB;\
    }\
    \
    .nav-menu a:last-child {\
        border-bottom: none;\
    }\
}\
';

var style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

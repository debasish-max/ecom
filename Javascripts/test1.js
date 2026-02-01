/* ===========================
   INITIALIZATION
   =========================== */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Lenis smooth scroll
let lenis;

function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

/* ===========================
   CUSTOM CURSOR
   =========================== */

function initCursor() {
    const cursor = document.querySelector('.cursor');
    
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const speed = 0.2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        const distX = mouseX - cursorX;
        const distY = mouseY - cursorY;

        cursorX += distX * speed;
        cursorY += distY * speed;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animate);
    }

    animate();

    // Hover effects
    const hoverElements = document.querySelectorAll('[data-cursor-hover]');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

/* ===========================
   PRELOADER
   =========================== */

function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const chars = document.querySelectorAll('.preloader-text .char');
    const progress = document.querySelector('.preloader-progress');

    // Animate characters
    gsap.to(chars, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power3.out'
    });

    // Animate progress bar
    gsap.to(progress, {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut',
        onComplete: () => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.6,
                delay: 0.3,
                onComplete: () => {
                    preloader.style.display = 'none';
                    initAnimations();
                }
            });
        }
    });
}

/* ===========================
   HERO ANIMATIONS
   =========================== */

function initAnimations() {
    // Hero animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-label', {
        opacity: 1,
        y: 0,
        duration: 0.8
    })
    .to('.hero-title-word', {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1
    }, '-=0.4')
    .to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.6')
    .to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.6')
    .to('.hero-stats', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.6')
    .to('.scroll-indicator', {
        opacity: 1,
        duration: 0.8
    }, '-=0.4');

    // Counter animation
    animateCounters();
}

/* ===========================
   COUNTER ANIMATION
   =========================== */

function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        
        gsap.to(counter, {
            scrollTrigger: {
                trigger: counter,
                start: 'top 80%',
                once: true
            },
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power1.out',
            onUpdate: function() {
                counter.innerHTML = Math.ceil(counter.innerHTML).toLocaleString();
            }
        });
    });
}

/* ===========================
   SCROLL ANIMATIONS
   =========================== */

function initScrollAnimations() {
    // Parallax hero background
    gsap.to('.hero-gradient', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 200,
        scale: 1.2,
        ease: 'none'
    });

    // Fade in sections
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Project cards animation
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                once: true
            },
            opacity: 0,
            y: 80,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    // Feature items
    gsap.utils.toArray('.feature-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                once: true
            },
            opacity: 0,
            x: -50,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out'
        });
    });

    // Testimonials
    gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                once: true
            },
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: index * 0.12,
            ease: 'power3.out'
        });
    });

    // Marquee duplicate for infinite scroll
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        const clone = marqueeContent.cloneNode(true);
        marqueeContent.parentNode.appendChild(clone);
    }

    // Section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                once: true
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
}

/* ===========================
   NAVIGATION
   =========================== */

function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            nav.style.transform = 'translateY(0)';
        } else if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                lenis.scrollTo(target, {
                    offset: -100,
                    duration: 1.5
                });
            }
        });
    });
}

/* ===========================
   PROJECT CARD INTERACTIONS
   =========================== */

function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        const img = card.querySelector('.project-image img');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(img, {
                scale: 1.1,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(img, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
}

/* ===========================
   FORM HANDLING
   =========================== */

function initForm() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            
            // Animate submit button
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.querySelector('.btn-text').textContent;
            
            button.querySelector('.btn-text').textContent = 'Sending...';
            button.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                button.querySelector('.btn-text').textContent = 'Message Sent!';
                
                setTimeout(() => {
                    button.querySelector('.btn-text').textContent = originalText;
                    button.disabled = false;
                    form.reset();
                    
                    // Show success message
                    alert('Thank you for your message! We\'ll get back to you soon.');
                }, 2000);
            }, 1500);
        });
    }
}

/* ===========================
   BARBA.JS PAGE TRANSITIONS
   =========================== */

function initBarba() {
    barba.init({
        transitions: [{
            name: 'default-transition',
            
            leave(data) {
                return gsap.to(data.current.container, {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.inOut'
                });
            },
            
            enter(data) {
                window.scrollTo(0, 0);
                
                return gsap.from(data.next.container, {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        // Reinitialize animations for new page
                        initScrollAnimations();
                        initProjectCards();
                        ScrollTrigger.refresh();
                    }
                });
            }
        }],
        
        views: [{
            namespace: 'home',
            afterEnter() {
                // Home page specific initializations
                console.log('Home page loaded');
            }
        }]
    });
}

/* ===========================
   AUTH FUNCTIONALITY
   =========================== */

const auth = {
    isLoggedIn() {
        return localStorage.getItem('user') !== null;
    },
    
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    async logout() {
        localStorage.removeItem('user');
        window.location.reload();
    }
};

function initAuth() {
    const userSection = document.getElementById('userSection');
    const cartBtn = document.querySelector('.nav-cart');
    
    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        
        // Show cart button
        if (cartBtn) {
            cartBtn.style.display = 'block';
        }
        
        // Create user dropdown
        userSection.innerHTML = `
            <div class="user-dropdown">
                <button class="user-btn" id="userMenuBtn" data-cursor-hover>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>${user.username}</span>
                </button>
            </div>
        `;
        
        const userBtn = document.getElementById('userMenuBtn');
        
        userBtn.addEventListener('click', async () => {
            const confirm = window.confirm('Are you sure you want to logout?');
            if (confirm) {
                await auth.logout();
            }
        });
        
    } else {
        // User not logged in
        userSection.innerHTML = `
            <a href="login.html" class="btn-login" data-cursor-hover>
                <span>Login</span>
            </a>
        `;
    }
}

/* ===========================
   INITIALIZE ON LOAD
   =========================== */

window.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLenis();
    initCursor();
    initPreloader();
    initNavigation();
    initScrollAnimations();
    initProjectCards();
    initForm();
    initAuth();
    
    // Initialize Barba.js for page transitions
    // Uncomment when you have multiple pages
    // initBarba();
});

// Refresh ScrollTrigger on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// Update cursor hover elements when new content loads
function updateCursorHovers() {
    const cursor = document.querySelector('.cursor');
    const hoverElements = document.querySelectorAll('[data-cursor-hover]');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// Call this after dynamic content loads
document.addEventListener('DOMContentLoaded', updateCursorHovers);
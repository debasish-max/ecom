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
    const speed = 0.15;

    // Mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
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

    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });

    // Enhanced hover effects for different elements
    const hoverElements = document.querySelectorAll('[data-cursor-hover]');
    const linkElements = document.querySelectorAll('a, button');
    const textElements = document.querySelectorAll('h1, h2, h3, p');

    // Standard hover elements
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Link and button elements
    linkElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (el.classList.contains('project-card') || el.classList.contains('nav-link')) {
                cursor.classList.add('link-hover');
            } else {
                cursor.classList.add('hover');
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('link-hover', 'hover');
        });
    });

    // Text selection
    textElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (!el.closest('a') && !el.closest('button')) {
                cursor.classList.add('text-hover');
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('text-hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
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
    // Hero animations with dramatic entrances
    const tl = gsap.timeline({ 
        defaults: { 
            ease: 'power4.out' 
        } 
    });

    // Animate label
    tl.to('.hero-label', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    })
    
    // Animate title words with 3D effect
    .to('.hero-title-word', {
        y: 0,
        rotateX: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power4.out'
    }, '-=0.6')
    
    // Animate description
    .to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.8')
    
    // Animate CTA buttons
    .to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.6')
    
    // Animate stats
    .to('.hero-stats', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        onComplete: () => {
            animateCounters();
        }
    }, '-=0.6')
    
    // Animate scroll indicator
    .to('.scroll-indicator', {
        opacity: 1,
        duration: 1
    }, '-=0.4');

    // Add magnetic effect to buttons
    initMagneticButtons();
}

/* ===========================
   MAGNETIC BUTTON EFFECT
   =========================== */

function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-video, .nav-link, .btn-login');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
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
    // Parallax hero background with multiple layers
    gsap.to('.hero-gradient', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        },
        y: 300,
        scale: 1.3,
        opacity: 0.5,
        ease: 'none'
    });

    // Fade and slide sections
    gsap.utils.toArray('section').forEach((section, index) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'top 30%',
                toggleActions: 'play none none reverse',
                onEnter: () => section.classList.add('in-view'),
                onLeaveBack: () => section.classList.remove('in-view')
            },
            opacity: 0,
            y: 100,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    // Project cards with 3D tilt effect
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        // Initial animation
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                once: true
            },
            opacity: 0,
            y: 100,
            rotateX: 15,
            duration: 1,
            delay: index * 0.15,
            ease: 'power3.out'
        });

        // Add parallax effect to images
        const img = card.querySelector('.project-image img');
        if (img) {
            gsap.to(img, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -50,
                ease: 'none'
            });
        }
    });

    // Feature items with stagger
    gsap.utils.toArray('.feature-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                once: true
            },
            opacity: 0,
            x: -80,
            duration: 1,
            delay: index * 0.2,
            ease: 'power3.out'
        });
    });

    // Testimonials with scale effect
    gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                once: true
            },
            opacity: 0,
            scale: 0.9,
            y: 80,
            duration: 1,
            delay: index * 0.15,
            ease: 'back.out(1.4)'
        });
    });

    // Marquee duplicate for infinite scroll
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        const clone = marqueeContent.cloneNode(true);
        marqueeContent.parentNode.appendChild(clone);
    }

    // Section titles with split animation
    gsap.utils.toArray('.section-title').forEach(title => {
        const words = title.textContent.split(' ');
        title.innerHTML = words.map(word => 
            `<span style="display: inline-block; overflow: hidden;">
                <span style="display: inline-block;">${word}</span>
            </span>`
        ).join(' ');

        const spans = title.querySelectorAll('span > span');
        
        gsap.from(spans, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                once: true
            },
            y: 100,
            opacity: 0,
            rotateX: -45,
            stagger: 0.05,
            duration: 1,
            ease: 'power4.out'
        });
    });

    // Section labels with slide effect
    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.from(label, {
            scrollTrigger: {
                trigger: label,
                start: 'top 90%',
                once: true
            },
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // About text reveal
    gsap.utils.toArray('.about-text').forEach((text, index) => {
        gsap.from(text, {
            scrollTrigger: {
                trigger: text,
                start: 'top 90%',
                once: true
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });

    // Form inputs
    gsap.utils.toArray('.form-group').forEach((group, index) => {
        gsap.from(group, {
            scrollTrigger: {
                trigger: group,
                start: 'top 90%',
                once: true
            },
            opacity: 0,
            x: -30,
            duration: 0.6,
            delay: index * 0.08,
            ease: 'power2.out'
        });
    });
}

/* ===========================
   NAVIGATION
   =========================== */

function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for style changes
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show navigation based on scroll direction
        if (currentScroll <= 0) {
            nav.classList.remove('hidden');
        } else if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            // Scrolling down
            nav.classList.add('hidden');
        } else if (currentScroll < lastScroll) {
            // Scrolling up
            nav.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target && lenis) {
                lenis.scrollTo(target, {
                    offset: -100,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    // Highlight active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
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
        
        // Enhanced hover effect
        card.addEventListener('mouseenter', () => {
            gsap.to(img, {
                scale: 1.15,
                rotation: 2,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(img, {
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
        });

        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
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
            name: 'slide-transition',
            
            async leave(data) {
                // Create transition layers
                const transitionContainer = document.createElement('div');
                transitionContainer.className = 'page-transition';
                
                for (let i = 0; i < 3; i++) {
                    const layer = document.createElement('div');
                    layer.className = 'transition-layer';
                    transitionContainer.appendChild(layer);
                }
                
                document.body.appendChild(transitionContainer);
                
                // Animate layers in
                const layers = transitionContainer.querySelectorAll('.transition-layer');
                
                await gsap.to(layers, {
                    y: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power4.inOut'
                });
                
                // Fade out current page
                await gsap.to(data.current.container, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.inOut'
                });
                
                return transitionContainer;
            },
            
            async enter(data) {
                window.scrollTo(0, 0);
                
                // Fade in new page
                gsap.set(data.next.container, { opacity: 0 });
                
                await gsap.to(data.next.container, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            },
            
            async after(data) {
                // Remove transition layers
                const transitionContainer = document.querySelector('.page-transition');
                const layers = transitionContainer.querySelectorAll('.transition-layer');
                
                await gsap.to(layers, {
                    y: '100%',
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power4.inOut'
                });
                
                transitionContainer.remove();
                
                // Reinitialize all interactions
                initScrollAnimations();
                initProjectCards();
                initMagneticButtons();
                updateCursorHovers();
                ScrollTrigger.refresh();
            }
        }],
        
        views: [{
            namespace: 'home',
            afterEnter() {
                console.log('Home page loaded');
            }
        }],
        
        prevent: ({ el }) => el.classList && el.classList.contains('no-barba')
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
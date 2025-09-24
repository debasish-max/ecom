
        // Page Loading Animation
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('pageLoader');
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 2000);
        });

        // Enhanced Header Scroll Effect
        let lastScrollY = window.scrollY;
        const header = document.getElementById('header');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide header on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });

        // Enhanced Intersection Observer for Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Enhanced Newsletter Form
        document.getElementById('newsletterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('.newsletter-input').value;
            const button = e.target.querySelector('.newsletter-btn');

            if (email) {
                button.textContent = 'Subscribing...';
                button.style.background = '#10b981';

                setTimeout(() => {
                    button.textContent = 'Subscribed! ✓';
                    e.target.reset();

                    setTimeout(() => {
                        button.textContent = 'Subscribe Now';
                        button.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                    }, 2000);
                }, 1000);
            }
        });

        // Enhanced Category Card Interactions
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });

            card.addEventListener('click', () => {
                const title = card.querySelector('.category-title').textContent;

                // Add click animation
                card.style.transform = 'translateY(-8px) scale(0.98)';
                setTimeout(() => {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                }, 150);

                console.log(`Navigating to ${title} category`);
                // Navigation logic would go here
            });
        });

        // Parallax Effect for Hero Section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            const heroElements = document.querySelectorAll('.floating-dot');

            heroElements.forEach((element, index) => {
                const speed = 1 + (index * 0.5);
                element.style.transform = `translateY(${rate * speed}px)`;
            });
        });

        // Enhanced Navigation Active State
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Remove active class from all links
                navLinks.forEach(nl => nl.classList.remove('active'));

                // Add active class to clicked link
                link.classList.add('active');

                // Add click feedback
                link.style.transform = 'translateY(-1px) scale(0.95)';
                setTimeout(() => {
                    link.style.transform = 'translateY(-1px) scale(1)';
                }, 150);
            });
        });

        // Smooth Scrolling for Internal Links
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

        // Enhanced Button Hover Effects
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });

        // Performance Optimization: Debounced Scroll Handler
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

        // Apply debouncing to scroll-heavy operations
        const debouncedScrollHandler = debounce(() => {
            // Additional scroll-based animations can be added here
        }, 10);

        window.addEventListener('scroll', debouncedScrollHandler);

        // Accessibility Improvements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Add focus styles for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid #667eea !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
        // Search functionality
        const searchInput = document.getElementById("searchInput");

        searchInput.addEventListener("keyup", function () {
            const filter = searchInput.value.toLowerCase();
            const cards = document.querySelectorAll(".category-card, .product-card");

            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                if (text.includes(filter)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });

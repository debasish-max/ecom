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

// Initialize Swiper
const swiper = new Swiper('.swiper', {
    slidesPerView: 1,   
    spaceBetween: 0,
    centeredSlides: false,
    slidesPerView: 'auto',
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
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

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
});

// Intersection Observer for Animations
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

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Newsletter Form
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
                button.style.background = '#ffffff';
            }, 2000);
        }, 1000);
    }
});

// Category Card Interactions
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });

    card.addEventListener('click', () => {
        const title = card.querySelector('.category-title').textContent;
        card.style.transform = 'translateY(-8px) scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        }, 150);
        console.log(`Navigating to ${title} category`);
    });
});

// Navigation Active State
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(nl => nl.classList.remove('active'));
        link.classList.add('active');
    });
});

// Search functionality
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", function () {
    const filter = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".category-card");

    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        if (text.includes(filter)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

// Smooth Scrolling
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
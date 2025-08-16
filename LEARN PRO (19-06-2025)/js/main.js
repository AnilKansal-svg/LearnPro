// Sticky Navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.main-nav');
    if (window.scrollY > 100) {
        nav.style.position = 'fixed';
        nav.style.top = '0';
        nav.style.background = 'rgba(0, 0, 0, 0.9)';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.position = 'absolute';
        nav.style.top = '40px';
        nav.style.background = 'transparent';
        nav.style.boxShadow = 'none';
    }
});
// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    this.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
const navItems = document.querySelectorAll('.nav-links li a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 767) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

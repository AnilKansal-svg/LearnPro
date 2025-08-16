document.addEventListener('DOMContentLoaded', function() {
    // Get all slides and navigation elements
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Function to show a specific slide
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        // Handle wrap-around for infinite loop
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }
        
        // Add active class to current slide
        slides[currentSlide].classList.add('active');
    }

    // Event listeners for navigation
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });

    // Auto-advance carousel (optional)
    let slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    // Pause on hover
    const carousel = document.querySelector('.testimonial-carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    });

    // Initialize first slide
    showSlide(0);
});

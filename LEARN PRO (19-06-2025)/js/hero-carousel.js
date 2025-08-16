document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const FADE_DURATION = 800; // Duration of fade in/out effect
    const SLIDE_DURATION = 4000; // 4 seconds between slides (includes fade time)
    const VISIBLE_DURATION = SLIDE_DURATION - FADE_DURATION; // Time slide is fully visible
    
    // DOM Elements
    const carousel = document.querySelector('.hero-carousel');
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    
    // State
    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Reset animation on an element
    function resetAnimation(element) {
        if (!element) return null;
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        return newElement;
    }
    
    // Update ARIA attributes
    function updateAriaAttributes(prevIndex, nextIndex) {
        // Update slide ARIA attributes
        if (prevIndex !== null) {
            const prevSlide = slides[prevIndex];
            prevSlide.setAttribute('aria-hidden', 'true');
            prevSlide.querySelector('.hero-content').setAttribute('aria-hidden', 'true');
        }
        
        const nextSlide = slides[nextIndex];
        nextSlide.setAttribute('aria-hidden', 'false');
        nextSlide.querySelector('.hero-content').setAttribute('aria-hidden', 'false');
        
        // Update dots
        dots.forEach((dot, index) => {
            const isSelected = index === nextIndex;
            dot.setAttribute('aria-selected', isSelected);
            dot.setAttribute('tabindex', isSelected ? '0' : '-1');
        });
        
        // Update slide indicator for screen readers
        const slideIndicator = document.getElementById('slide-indicator');
        if (slideIndicator) {
            slideIndicator.textContent = `Slide ${nextIndex + 1} of ${slides.length}`;
        }
    }
    
    // Show specific slide with crossfade animation
    function showSlide(index) {
        if (isTransitioning || index < 0 || index >= slides.length) return;
        
        isTransitioning = true;
        const prevIndex = currentSlide;
        currentSlide = index;
        
        // Update UI immediately for better responsiveness
        updateAriaAttributes(prevIndex, index);
        
        const currentActive = document.querySelector('.hero-slide.active');
        const nextSlide = slides[index];
        
        // If clicking on current slide, do nothing
        if (currentActive === nextSlide) {
            isTransitioning = false;
            return;
        }
        
        // Pause auto sliding during transition
        pauseSlideShow();
        
        // Prepare next slide
        nextSlide.style.display = 'flex';
        nextSlide.style.opacity = '0';
        
        // Hide content initially
        const nextContent = nextSlide.querySelector('.hero-content');
        if (nextContent) {
            const heading = nextContent.querySelector('h1');
            const buttons = nextContent.querySelector('.hero-buttons');
            if (heading) heading.style.opacity = '0';
            if (buttons) buttons.style.opacity = '0';
        }
        
        // Force reflow to ensure styles are applied
        void nextSlide.offsetWidth;
        
        // Add active class to next slide
        nextSlide.classList.add('active');
        
        // Start fade out current slide and fade in next slide
        if (currentActive) {
            currentActive.classList.add('leaving');
        }
        nextSlide.style.opacity = '1';
        
        // Show content after a small delay
        if (nextContent) {
            setTimeout(() => {
                const heading = nextContent.querySelector('h1');
                const buttons = nextContent.querySelector('.hero-buttons');
                if (heading) heading.style.opacity = '1';
                if (buttons) buttons.style.opacity = '1';
            }, 100);
        }
        
        // After fade out completes
        setTimeout(() => {
            // Clean up current slide if exists
            if (currentActive) {
                currentActive.classList.remove('active', 'leaving');
                currentActive.style.display = 'none';
                currentActive.style.opacity = '0';
            }
            
            isTransitioning = false;
            
            // Schedule next slide
            if (slideInterval === null) {
                slideInterval = setTimeout(() => {
                    nextSlideFunc();
                }, VISIBLE_DURATION);
            }
        }, FADE_DURATION);
    }
    
    // Go to next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Wrapper for nextSlide to handle auto-advance
    function nextSlideFunc() {
        if (!isTransitioning) {
            nextSlide();
        }
    }
    
    // Go to previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    // Start auto sliding
    function startSlideShow() {
        if (slideInterval === null) {
            slideInterval = setTimeout(() => {
                nextSlideFunc();
            }, VISIBLE_DURATION);
        }
    }
    
    // Pause auto sliding
    function pauseSlideShow() {
        if (slideInterval !== null) {
            clearTimeout(slideInterval);
            slideInterval = null;
        }
    }
    
    // Preload all images
    function preloadImages() {
        const imageUrls = ['Pictures/B1.png', 'Pictures/B2.png', 'Pictures/B3.png'];
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    // Handle keyboard navigation
    function handleKeyDown(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                showSlide(0);
                break;
            case 'End':
                e.preventDefault();
                showSlide(slides.length - 1);
                break;
        }
    }
    
    // Handle touch events
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance in pixels
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            nextSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            prevSlide();
        }
    }
    
    // Initialize the carousel
    function init() {
        // Preload images
        preloadImages();
        
        // Set initial ARIA attributes
        updateAriaAttributes(null, 0);
        
        // Add event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Keyboard navigation
        carousel.addEventListener('keydown', handleKeyDown);
        
        // Touch events
        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showSlide(index);
                }
            });
        });
        
        // Pause on hover/focus
        carousel.addEventListener('mouseenter', pauseSlideShow);
        carousel.addEventListener('mouseleave', startSlideShow);
        carousel.addEventListener('focusin', pauseSlideShow);
        carousel.addEventListener('focusout', startSlideShow);
        
        // Start the slideshow
        showSlide(0);
        startSlideShow();
        
        // Make carousel focusable
        carousel.setAttribute('tabindex', '0');
    }
    
    // Initialize the carousel
    init();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Update slide heights if needed
        const slideHeight = window.innerHeight;
        document.querySelectorAll('.hero-slide').forEach(slide => {
            slide.style.height = `${slideHeight}px`;
        });
    });
});

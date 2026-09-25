document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Sticky Header
       ========================================================================== */
    const header = document.getElementById('mainHeader');
    const stickyPoint = header.offsetTop;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > stickyPoint + 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');

            // Toggle icon visual
            if (mainNav.classList.contains('active')) {
                mobileMenuToggle.innerHTML = '✕';
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenuToggle.innerHTML = '☰';
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ==========================================================================
       Back to Top Button
       ========================================================================== */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Initial state
        backToTop.style.display = 'none';
    }

    /* ==========================================================================
       Animated Statistics Counters
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const statsSection = document.querySelector('.statistics-section');
    if (statsSection && counters.length > 0) {
        window.addEventListener('scroll', () => {
            if (hasAnimated) return;
            const sectionPos = statsSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight;

            if (sectionPos < screenPos) {
                animateCounters();
                hasAnimated = true;
            }
        });
    }

    /* ==========================================================================
       Newsletter Form Validation
       ========================================================================== */
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');

            if (!emailInput.value || !emailInput.value.includes('@')) {
                newsletterMessage.innerText = 'Please enter a valid email address.';
                newsletterMessage.className = 'form-message error';
            } else {
                newsletterMessage.innerText = 'Thank you for subscribing!';
                newsletterMessage.className = 'form-message success';
                newsletterForm.reset();

                // Clear message after 3 seconds
                setTimeout(() => {
                    newsletterMessage.innerText = '';
                    newsletterMessage.className = 'form-message';
                }, 3000);
            }
        });
    }

});

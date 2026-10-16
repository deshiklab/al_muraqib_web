// Set Year dynamically based on current date
        document.getElementById('year').textContent = new Date().getFullYear();

        // 1. Multi-page Nav Logic (Removed SPA routing to prevent errors on inner pages)
        // 2. Navbar Scroll Effect & Back to Top Logic
        const navbar = document.getElementById('navbar');
        const backToTopBtn = document.getElementById('back-to-top');

        function updateScrollEffects() {
            const currentHash = window.location.hash.replace('#', '') || 'home';

            // Navbar Solid/Transparent logic
            if (window.scrollY > 50 || currentHash !== 'home') {
                navbar.classList.remove('nav-transparent', 'border-b', 'border-white/10');
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.add('nav-transparent', 'border-b', 'border-white/10');
                navbar.classList.remove('nav-scrolled');
            }

            // Back to Top Button visibility
            if (window.scrollY > 400) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
                backToTopBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
            } else {
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
                backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            }
        }
        window.addEventListener('scroll', updateScrollEffects);

        // Scroll to top action
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // 3. Mobile Menu Logic
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // Close menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => menu.classList.add('hidden'));
        });

        // 4. Scroll Reveal Animations (Intersection Observer)
        function triggerReveals() {
            const reveals = document.querySelectorAll('.reveal');
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        obs.unobserve(entry.target); // Run once
                    }
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

            reveals.forEach(el => {
                el.classList.remove('active'); // reset
                observer.observe(el);
            });
        }

        // 5. Counter Animation Logic
        let countersRun = false;
        function runCounters() {
            if (countersRun) return;
            const counters = document.querySelectorAll('.counter');
            const speed = 200; // lower is slower

            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');

                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            countersRun = true;
        }

        // 6. Portfolio Filter Logic
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active classes
                filterBtns.forEach(b => {
                    b.classList.remove('bg-primary', 'text-white', 'shadow-md');
                    b.classList.add('bg-gray-100', 'text-gray-600');
                });

                // Add active to clicked
                btn.classList.remove('bg-gray-100', 'text-gray-600');
                btn.classList.add('bg-primary', 'text-white', 'shadow-md');

                const filterValue = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // 7. FAQ Accordion Logic
        const faqBtns = document.querySelectorAll('.faq-btn');
        faqBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('i');

                // Close others
                document.querySelectorAll('.accordion-content').forEach(c => {
                    if(c !== content) {
                        c.classList.remove('expanded');
                        c.previousElementSibling.querySelector('i').classList.replace('fa-minus', 'fa-plus');
                        c.previousElementSibling.classList.remove('text-primary');
                    }
                });

                // Toggle current
                content.classList.toggle('expanded');
                if (content.classList.contains('expanded')) {
                    icon.classList.replace('fa-plus', 'fa-minus');
                    btn.classList.add('text-primary');
                } else {
                    icon.classList.replace('fa-minus', 'fa-plus');
                    btn.classList.remove('text-primary');
                }
            });
        });

        // 8. Custom Form Modal Logic (No Alert)
        const contactForm = document.getElementById('contact-form');
        const contactPageForm = document.getElementById('contact-page-form');
        const newsletterForm = document.getElementById('newsletter-form');
        const customModal = document.getElementById('custom-modal');
        const closeModalBtns = [document.getElementById('close-modal'), document.getElementById('modal-ok-btn')];

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                document.querySelector('#custom-modal h3').textContent = 'Inquiry Sent!';
                document.querySelector('#custom-modal p').textContent = 'Thank you for reaching out to Al Muraqib. Our engineering and sales team will review your project details and respond shortly.';
                customModal.classList.add('show'); // Show modal
                contactForm.reset();
            });
        }

        if (contactPageForm) {
            contactPageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                document.querySelector('#custom-modal h3').textContent = 'Inquiry Sent!';
                document.querySelector('#custom-modal p').textContent = 'Thank you for reaching out to Al Muraqib. Our engineering and sales team will review your project details and respond shortly.';
                customModal.classList.add('show'); // Show modal
                contactPageForm.reset();
            });
        }

        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                document.querySelector('#custom-modal h3').textContent = 'Subscribed!';
                document.querySelector('#custom-modal p').textContent = 'Thank you for subscribing to the Al Muraqib newsletter. You will now receive our latest updates.';
                customModal.classList.add('show'); // Reuse custom modal for newsletter
                newsletterForm.reset();
            });
        }

        closeModalBtns.forEach(btn => {
            if(btn) {
                btn.addEventListener('click', () => {
                    customModal.classList.remove('show');
                });
            }
        });

        // 9. Hero Slider Logic
        const slides = document.querySelectorAll('.hero-slide');
        let currentSlide = 0;
        if(slides.length > 0) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active-slide');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active-slide');
            }, 5000); // Change image every 5 seconds
        }

        // 10. Mobile Menu Accordions
        const mobileAccordions = document.querySelectorAll('.mobile-accordion button');
        mobileAccordions.forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('i');
                content.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });
        });

        // 11. Portfolio Lightbox Logic
        const lightbox = document.getElementById('portfolio-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeLightbox = document.getElementById('close-lightbox');
        const portfolioImages = document.querySelectorAll('.portfolio-item');

        portfolioImages.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img').src;
                const title = item.querySelector('h4').textContent;

                lightboxImg.src = img;
                lightboxCaption.textContent = title;

                lightbox.classList.remove('opacity-0', 'pointer-events-none');
                lightbox.classList.add('opacity-100', 'pointer-events-auto');
                setTimeout(() => lightboxImg.classList.replace('scale-95', 'scale-100'), 50);
            });
        });

        if(closeLightbox) {
            closeLightbox.addEventListener('click', () => {
                lightbox.classList.remove('opacity-100', 'pointer-events-auto');
                lightbox.classList.add('opacity-0', 'pointer-events-none');
                lightboxImg.classList.replace('scale-100', 'scale-95');
            });
        }

        // Close lightbox on outside click
        lightbox.addEventListener('click', (e) => {
            if(e.target === lightbox) closeLightbox.click();
        });


        // Init functions on load
        window.addEventListener('load', () => {
            triggerReveals();
            runCounters();
        });
document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Header
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 7. Auto-Scrolling Slider (Floor Plan)
    const floorItems = document.querySelectorAll('.floor-item');
    let currentFloorIndex = 0;
    let floorScrollInterval;

    const startFloorAutoScroll = () => {
        if (!floorItems.length) return;
        clearInterval(floorScrollInterval);
        floorScrollInterval = setInterval(() => {
            floorItems[currentFloorIndex].classList.remove('active');
            currentFloorIndex = (currentFloorIndex + 1) % floorItems.length;
            floorItems[currentFloorIndex].classList.add('active');
        }, 3500);
    };

    const stopFloorAutoScroll = () => clearInterval(floorScrollInterval);

    // 2. Explore Project Tabs
    const exploreTabLinks = document.querySelectorAll('.explore-tab-link');
    const exploreTabContents = document.querySelectorAll('.explore-tab-content');

    exploreTabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-explore-tab');

            // Deactivate all Explore Tabs
            exploreTabLinks.forEach(l => l.classList.remove('active'));
            exploreTabContents.forEach(c => c.classList.remove('active'));

            // Activate Target Explore Tab
            link.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // Manage Slider Auto-Scrolls
            if (targetId === 'explore-floor-plans') {
                startFloorAutoScroll();
            } else {
                stopFloorAutoScroll();
            }
        });
    });

    // Integrated Auto-Pop logic for Specifications
    function autoPopSpecs() {
        const hiddenSpecs = document.querySelectorAll('.hidden-spec');
        // Ensure we only trigger it once
        if (hiddenSpecs[0] && hiddenSpecs[0].classList.contains('show')) return;

        hiddenSpecs.forEach((spec, index) => {
            setTimeout(() => {
                spec.classList.add('show');
            }, (index + 1) * 300); // 300ms delay per item for smooth sequence
        });
    }

    function autoPopDetailedSpecs() {
        const blueprintItems = document.querySelectorAll('.blueprint-item');
        blueprintItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('reveal-active');
            }, index * 150);
        });
    }

    function autoPopSnapshotStats() {
        const snapItems = document.querySelectorAll('.snap-stat-item');
        snapItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('reveal-active');
            }, index * 150);
        });
    }

    function autoPopAmenities() {
        const hItems = document.querySelectorAll('.h-amenity-item');
        hItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('reveal-active');
            }, index * 100);
        });
    }

    function autoPopLocationItems() {
        const locationItems = document.querySelectorAll('.location-item');
        locationItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('reveal-active');
            }, index * 150);
        });
    }

    // 3. Reveal on Scroll (Unified Observer)
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('specifications')) {
                    autoPopSpecs();
                }
                if (entry.target.classList.contains('detailed-specs')) {
                    autoPopDetailedSpecs();
                }
                if (entry.target.classList.contains('project-snapshot')) {
                    autoPopSnapshotStats();
                }
                if (entry.target.classList.contains('explore-project')) {
                    autoPopAmenities();
                    // Also start floor auto-scroll if that tab is active
                    const activeTab = document.querySelector('.explore-tab-link.active');
                    if (activeTab && activeTab.getAttribute('data-explore-tab') === 'explore-floor-plans') {
                        startFloorAutoScroll();
                    }
                }
                if (entry.target.classList.contains('location-advantages')) {
                    autoPopLocationItems();
                }
                // Once revealed, we can stop observing this specific element
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
        // Immediate check for elements already in view
        if (reveal.getBoundingClientRect().top < window.innerHeight) {
            reveal.classList.add('active');
            if (reveal.classList.contains('specifications')) {
                autoPopSpecs();
            }
            if (reveal.classList.contains('detailed-specs')) {
                autoPopDetailedSpecs();
            }
            if (reveal.classList.contains('location-advantages')) {
                autoPopLocationItems();
            }
        }
    });

    // 4. Form Submission Placeholder
    const enquiryForm = document.getElementById('hero-enquiry');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = enquiryForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'SENDING...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'SUCCESSFULLY SENT!';
                btn.style.background = '#28a745';

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    enquiryForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // 5. Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Counter Animation
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = parseInt(counter.innerText.replace(/[^0-9]/g, ''), 10) || 0;
        const increment = Math.max(1, target / 30); // Faster duration

        if (count < target) {
            const nextVal = Math.min(target, Math.ceil(count + increment));
            // Pad with leading zero only if needed for '04' style
            const displayVal = (target < 10 && nextVal < 10) ? '0' + nextVal : nextVal;
            counter.innerText = displayVal + '+';
            setTimeout(() => animateCounter(counter), 40);
        } else {
            counter.innerText = (target < 10 ? '0' + target : target) + '+';
        }
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-milestones');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // 8. Legacy Slider Auto Functionality
    const legacySlides = document.querySelectorAll('.legacy-slide');
    if (legacySlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            legacySlides[currentSlide].style.opacity = '0';
            currentSlide = (currentSlide + 1) % legacySlides.length;
            legacySlides[currentSlide].style.opacity = '1';
        }, 4000); // 4 seconds per slide
    }


    // 9. Modal Logic
    const modal = document.getElementById('enquiry-modal');
    const btnOpen = document.getElementById('open-enquiry-modal');
    const floorEnquireBtn = document.getElementById('open-enquiry-floor');
    const spanClose = document.querySelector('.close-modal');

    const openModal = () => modal.classList.add('show');
    const closeModal = () => modal.classList.remove('show');

    if (modal && spanClose) {
        if (btnOpen) btnOpen.addEventListener('click', openModal);

        // Dynamic check for any element with 'open-modal-btn' class as well
        document.querySelectorAll('.open-modal-btn').forEach(btn => {
            btn.addEventListener('click', openModal);
        });

        spanClose.addEventListener('click', closeModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // 10. Gallery Lightbox Logic
    const galleryLightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCap = document.getElementById('lightbox-caption');
    const galleryCards = document.querySelectorAll('#explore-gallery .explore-card');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryLightbox && galleryCards.length) {
        galleryCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const title = card.querySelector('h4');

                if (img && title) {
                    lightboxImg.src = img.src;
                    lightboxCap.innerText = title.innerText;
                    galleryLightbox.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeLBox = () => {
            galleryLightbox.classList.remove('show');
            document.body.style.overflow = '';
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLBox);

        galleryLightbox.addEventListener('click', (e) => {
            if (e.target === galleryLightbox) closeLBox();
        });
    }
});
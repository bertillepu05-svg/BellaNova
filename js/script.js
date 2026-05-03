document.addEventListener('DOMContentLoaded', function() {

    // ---------- SCROLL NAVBAR ----------
    const mainNav = document.getElementById('mainNav');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // ---------- ANIMATIONS AU SCROLL (INTERSECTION OBSERVER) ----------
    const animatedElements = document.querySelectorAll(
        '.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .slide-in-left, .slide-in-right, .fade-in-delay, .fade-in-delay-2'
    );

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(function(el) {
        observer.observe(el);
    });

    // ---------- FERMETURE MENU MOBILE APRÈS CLIC ----------
    const offcanvasLinks = document.querySelectorAll('#mobileMenu .nav-link');
    const offcanvasElement = document.getElementById('mobileMenu');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);

    offcanvasLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            bsOffcanvas.hide();
        });
    });

    // ---------- ACTUALISATION ACTIVE STATE AU SCROLL ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#desktopMenu .nav-link, #mobileMenu .nav-link');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    (function() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCarousels);
        } else {
            initCarousels();
        }

        function initCarousels() {
            // Liste des IDs de carrousels
            var carouselIds = [
                'carouselManucure',
                'carouselPedicure',
                'carouselMaquillage',
                'carouselSourcils',
                'carouselSoinsVisage'
            ];
            
            carouselIds.forEach(function(id) {
                var carouselElement = document.getElementById(id);
                if (!carouselElement) {
                    console.warn('Carousel #' + id + ' introuvable');
                    return;
                }
                
                // Vérifie si déjà initialisé
                var existingInstance = bootstrap.Carousel.getInstance(carouselElement);
                if (existingInstance) {
                    existingInstance.dispose();
                }
                
                // Initialise le carousel avec les bonnes options
                var carousel = new bootstrap.Carousel(carouselElement, {
                    interval: 3000,
                    ride: 'carousel',
                    touch: true,
                    wrap: true
                });
                
                // Force l'activation des boutons précédent/suivant
                var prevBtn = carouselElement.querySelector('.carousel-control-prev');
                var nextBtn = carouselElement.querySelector('.carousel-control-next');
                
                if (prevBtn) {
                    prevBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        carousel.prev();
                    });
                }
                
                if (nextBtn) {
                    nextBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        carousel.next();
                    });
                }
                
                console.log('Carousel #' + id + ' initialisé avec succès');
            });
        }
    })();

    // ---------- FORMULAIRE FORMSPREE ----------
    const contactForms = document.querySelectorAll('.contact-form');

    contactForms.forEach(function(form) {
        form.addEventListener('submit', handleFormSubmit);
    });

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const btnSuccess = submitBtn.querySelector('.btn-success');
        const formMessage = form.querySelector('.form-message');

        // Afficher le loader
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
        btnSuccess.style.display = 'none';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                btnLoading.style.display = 'none';
                btnSuccess.style.display = 'inline-block';
                submitBtn.style.backgroundColor = '#C78B7A';
                submitBtn.style.borderColor = '#C78B7A';

                formMessage.innerHTML = '<div class="alert alert-success mt-3"> Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.</div>';

                setTimeout(function() {
                    btnText.style.display = 'inline-block';
                    btnLoading.style.display = 'none';
                    btnSuccess.style.display = 'none';
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                    formMessage.innerHTML = '';
                    form.reset();
                }, 5000);

            } else {
                throw new Error('Erreur serveur');
            }

        } catch (error) {
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
            btnSuccess.style.display = 'none';
            submitBtn.disabled = false;

            formMessage.innerHTML = '<div class="alert alert-danger mt-3"> Une erreur est survenue. Veuillez réessayer ou nous contacter directement par téléphone au +243 972 431 636.</div>';

            console.error('Erreur Formspree:', error);
        }
    }
});





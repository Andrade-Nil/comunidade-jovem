document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for nav links (alternative to CSS, more control if needed)
    const navLinks = document.querySelectorAll('#main-header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // Hero Carousel
    const slides = document.querySelectorAll('.hero-carousel .slide');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (slides.length > 0) {
        showSlide(currentSlide); // Show initial slide
        slideInterval = setInterval(nextSlide, 7000); // Auto-play

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                clearInterval(slideInterval); // Reset interval on manual control
                slideInterval = setInterval(nextSlide, 7000);
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                clearInterval(slideInterval); // Reset interval on manual control
                slideInterval = setInterval(nextSlide, 7000);
            });
        }
    }

    // Animated Counters
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Lower number = faster animation

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => animateCounter(counter), 10);
        } else {
            counter.innerText = target;
        }
    };

    const observerOptions = {
        root: null,
        threshold: 0.3 // Trigger when 30% of the element is visible
    };
    
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    counters.forEach(counter => {
                        counter.innerText = '0'; // Reset before starting
                        animateCounter(counter);
                    });
                    entry.target.classList.add('animated'); // Mark as animated
                    // observer.unobserve(entry.target); // Optional: stop observing after animation
                }
            });
        }, observerOptions);
        statsObserver.observe(statsSection);
    }


    // Countdown Timer for Special Event
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const eventDate = new Date("Dec 25, 2024 00:00:00").getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownElement.innerHTML = "<h4>O evento já aconteceu!</h4>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = String(days).padStart(2, '0');
            document.getElementById('hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
            document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
        };
        
        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
    }

    // Scroll Reveal for sections
    const sectionsToReveal = document.querySelectorAll('.content-section');
    const revealObserverOptions = {
        root: null,
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Optional: stop observing after reveal
            }
        });
    }, revealObserverOptions);

    sectionsToReveal.forEach(section => {
        revealObserver.observe(section);
    });
    
    // Particle Background (Simple using Three.js for subtle moving lights)
    // Ensure Three.js is loaded via import map or script tag
    async function initParticles() {
        try {
            const THREE = await import('three');
            const particleContainer = document.getElementById('particle-container');

            if (particleContainer && THREE) {
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer({ alpha: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                particleContainer.appendChild(renderer.domElement);

                const particleCount = 200;
                const particles = new THREE.BufferGeometry();
                const positions = new Float32Array(particleCount * 3);
                const colors = new Float32Array(particleCount * 3);

                const colorViolet = new THREE.Color(0x8A2BE2);
                const colorCyan = new THREE.Color(0x00FFFF);
                const colorOrange = new THREE.Color(0xFF8C00);
                const baseColors = [colorViolet, colorCyan, colorOrange];

                for (let i = 0; i < particleCount; i++) {
                    positions[i * 3] = (Math.random() - 0.5) * 15;
                    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;

                    const C = baseColors[Math.floor(Math.random() * baseColors.length)];
                    colors[i * 3] = C.r;
                    colors[i * 3 + 1] = C.g;
                    colors[i * 3 + 2] = C.b;
                }

                particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

                const particleMaterial = new THREE.PointsMaterial({
                    size: 0.05,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.7,
                    blending: THREE.AdditiveBlending
                });

                const particleSystem = new THREE.Points(particles, particleMaterial);
                scene.add(particleSystem);

                camera.position.z = 5;

                function animateParticles() {
                    requestAnimationFrame(animateParticles);
                    particleSystem.rotation.y += 0.0005;
                    particleSystem.rotation.x += 0.0002;
                    renderer.render(scene, camera);
                }
                animateParticles();

                window.addEventListener('resize', () => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                });
            }
        } catch (e) {
            console.warn("Three.js for particle background not loaded or failed to initialize:", e);
        }
    }


    // // Contact Form Submission (Placeholder)
    // const contactForm = document.getElementById('contact-form');
    // if (contactForm) {
    //     contactForm.addEventListener('submit', (e) => {
    //         e.preventDefault();
    //         // Basic validation (HTML5 `required` is used)
    //         const name = document.getElementById('name').value;
    //         const email = document.getElementById('email').value;
    //         const message = document.getElementById('message').value;

    //         if (name && email && message) {
    //             alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    //             contactForm.reset();
    //         } else {
    //             alert('Por favor, preencha todos os campos obrigatórios.');
    //         }
    //         // Here you would typically send data to a server
    //     });
    // }
    initParticles();

});


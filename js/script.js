document.addEventListener('DOMContentLoaded', function() {

    // -------------------------------------------------------------------------
    // Animation & Interactivity
    // -------------------------------------------------------------------------

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('js-scroll-hidden');
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('.fade-in-up, .service-card, .product-card, .contact-info, .contact-form');
    animatedElements.forEach((el, index) => {
        // Add staggered delay for grid items
        if (el.classList.contains('service-card') || el.classList.contains('product-card')) {
             // Calculate index within its parent grid for staggered effect
             const parent = el.parentElement;
             const siblings = Array.from(parent.children);
             const position = siblings.indexOf(el);
             el.style.transitionDelay = `${position * 0.1}s`;
        }

        // Add the base animation class if not already present
        if (!el.classList.contains('fade-in-up')) {
            el.classList.add('fade-in-up');
        }

        // Initial hidden state for animation (Progressive Enhancement)
        el.classList.add('js-scroll-hidden');

        observer.observe(el);
    });

    // Sticky Header Blur Effect on Scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            header.style.boxShadow = '0 1px 0 rgba(0,0,0,0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            header.style.boxShadow = 'none';
        }
    });


    // -------------------------------------------------------------------------
    // Form Handling & Cart Logic
    // -------------------------------------------------------------------------

    // Handle Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                alert(`Thank you, ${name}! We have received your inquiry at DBR SOLAR EPC. We will contact you at ${email} shortly.`);
                contactForm.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    // Handle "Add to Cart" Buttons
    const addToCartButtons = document.querySelectorAll('.product-card .btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;

            alert(`Added to cart: ${productName} - ${productPrice}`);
        });
    });

    // Highlight active link in navigation
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else if (currentPath === '' && linkPath === 'index.html') {
             link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

});

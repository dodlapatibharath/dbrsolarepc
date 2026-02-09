document.addEventListener('DOMContentLoaded', function() {

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
                alert(`Thank you, ${name}! Your message has been received. We will contact you at ${email} shortly.`);
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
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
             // Handle root path
            if (currentPath === '' && link.getAttribute('href') === 'index.html') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });

});

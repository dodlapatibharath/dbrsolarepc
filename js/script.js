document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('nav a').forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === currentPage);
    });

    const counters = document.querySelectorAll('.counter');
    const animateCounter = (counter) => {
        const target = Number(counter.dataset.target || 0);
        let value = 0;
        const step = Math.ceil(target / 80);

        const tick = () => {
            value += step;
            if (value > target) value = target;
            counter.textContent = `${value}${target >= 1000 ? '+' : ''}`;
            if (value < target) {
                requestAnimationFrame(tick);
            }
        };

        tick();
    };

    if (counters.length) {
        counters.forEach(animateCounter);
    }

    const calculator = document.getElementById('solarCalculator');
    if (calculator) {
        calculator.addEventListener('submit', (event) => {
            event.preventDefault();
            const billInput = document.getElementById('bill');
            const resultEl = document.getElementById('calcResult');

            const monthlyBill = Number(billInput.value || 0);
            if (monthlyBill < 500) {
                resultEl.textContent = 'Please enter a valid bill amount above ₹500.';
                return;
            }

            const yearlyBill = monthlyBill * 12;
            const estimatedSaving = yearlyBill * 0.65;
            resultEl.textContent = `Approx annual savings: ₹${Math.round(estimatedSaving).toLocaleString('en-IN')}`;
        });
    }

    const testimonials = [
        {
            text: '"SuryaRise helped us cut power costs by 62% in 8 months. Their EPC execution was fast and professional."',
            author: '— Operations Head, Textile Unit, Surat'
        },
        {
            text: '"Our 420kW rooftop plant was commissioned before schedule and all compliance tasks were handled seamlessly."',
            author: '— Admin Director, Hospital Chain, Jaipur'
        },
        {
            text: '"Excellent project planning and monitoring support. Performance exceeded committed generation numbers."',
            author: '— Plant Manager, Auto Components, Pune'
        }
    ];

    const testimonialText = document.getElementById('testimonialText');
    const testimonialName = document.getElementById('testimonialName');

    if (testimonialText && testimonialName) {
        let current = 0;
        setInterval(() => {
            current = (current + 1) % testimonials.length;
            testimonialText.textContent = testimonials[current].text;
            testimonialName.textContent = testimonials[current].author;
        }, 4200);
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formStatus = document.getElementById('formStatus');
            if (formStatus) {
                formStatus.textContent = 'Thank you! Your enquiry has been captured. Our EPC advisor will contact you shortly.';
            }
            contactForm.reset();
        });
    }
});

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
            text: '"DBR Solar helped us cut our electricity expenses by nearly half within the first year of operation."',
            author: '— Operations Head, Textile Unit, Patancheru'
        },
        {
            text: '"The DBR team completed our school rooftop project in Warangal quickly and professionally."',
            author: '— Trustee, Educational Institution, Warangal'
        },
        {
            text: '"From site survey to net metering, the entire process in Karimnagar was smooth and transparent."',
            author: '— Owner, Rice Mill, Karimnagar'
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
                formStatus.textContent = 'Thank you! Your enquiry has been captured. A DBR Solar EPC advisor will contact you shortly.';
            }
            contactForm.reset();
        });
    }
});

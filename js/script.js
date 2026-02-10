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
        const billInput = document.getElementById('bill');
        const tariffInput = document.getElementById('tariff');
        const sunHoursInput = document.getElementById('sunHours');
        const resultEl = document.getElementById('calcResult');

        const renderCalculatorResult = () => {
            const monthlyBill = Number(billInput?.value || 0);
            const tariff = Number(tariffInput?.value || 0);
            const sunHours = Number(sunHoursInput?.value || 0);

            if (monthlyBill < 500 || tariff < 4 || sunHours < 3) {
                resultEl.innerHTML = '<p class="result">Enter valid values to calculate solar units.</p>';
                return;
            }

            const monthlyUnits = monthlyBill / tariff;
            const requiredSystemKW = monthlyUnits / (sunHours * 30 * 0.8);
            const roundedSystemKW = Math.max(1, Math.round(requiredSystemKW * 10) / 10);
            const monthlySolarGeneration = roundedSystemKW * sunHours * 30 * 0.8;
            const annualSavings = monthlySolarGeneration * tariff * 12 * 0.9;

            resultEl.innerHTML = `
                <p><strong>Monthly usage:</strong> ${Math.round(monthlyUnits).toLocaleString('en-IN')} units</p>
                <p><strong>Recommended solar size:</strong> ${roundedSystemKW.toLocaleString('en-IN')} kW</p>
                <p><strong>Expected monthly solar generation:</strong> ${Math.round(monthlySolarGeneration).toLocaleString('en-IN')} units</p>
                <p><strong>Estimated annual savings:</strong> ₹${Math.round(annualSavings).toLocaleString('en-IN')}</p>
                <p class="calc-note">*Estimate assumes ~80% performance ratio and ~90% bill offset.</p>
            `;
        };

        [billInput, tariffInput, sunHoursInput].forEach((input) => {
            input?.addEventListener('input', renderCalculatorResult);
        });

        calculator.addEventListener('submit', (event) => {
            event.preventDefault();
            renderCalculatorResult();
        });

        renderCalculatorResult();
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

    const spawnEmber = () => {
        const ember = document.createElement('span');
        ember.className = 'dynamic-ember';
        ember.style.setProperty('--x-start', `${Math.random() * 100}vw`);
        ember.style.setProperty('--x-end', `${Math.random() * 100}vw`);
        ember.style.left = '0';
        ember.style.animationDuration = `${4 + Math.random() * 5}s`;
        ember.style.animationDelay = `${Math.random() * 0.6}s`;
        ember.style.opacity = `${0.45 + Math.random() * 0.5}`;
        document.body.appendChild(ember);

        ember.addEventListener('animationend', () => {
            ember.remove();
        });
    };

    setInterval(spawnEmber, 280);
    for (let index = 0; index < 18; index += 1) {
        setTimeout(spawnEmber, index * 130);
    }

});

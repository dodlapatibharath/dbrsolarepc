document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const hasManualActiveLink = Boolean(document.querySelector('nav a.active'));
    if (!hasManualActiveLink) {
        document.querySelectorAll('nav a').forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === currentPage);
        });
    }

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

    const componentTabs = document.getElementById('componentTabs');
    const componentCards = document.getElementById('componentCards');

    if (componentTabs && componentCards) {
        const componentData = {
            panels: {
                label: 'Types of Panel',
                items: [
                    {
                        name: 'Monocrystalline TOPCon',
                        bestFor: 'High-efficiency rooftops with limited shadow-free space.',
                        range: '540 Wp - 700 Wp',
                        highlight: 'Excellent low-light and high-temperature performance.'
                    },
                    {
                        name: 'Monocrystalline PERC',
                        bestFor: 'Balanced cost and generation for homes and C&I rooftops.',
                        range: '400 Wp - 550 Wp',
                        highlight: 'Reliable technology with strong field track record.'
                    },
                    {
                        name: 'Bifacial Modules',
                        bestFor: 'Ground-mount and elevated shed projects with reflective surfaces.',
                        range: '540 Wp - 720 Wp',
                        highlight: 'Captures rear-side irradiance for higher yield.'
                    }
                ]
            },
            inverters: {
                label: 'Types of Inverter',
                items: [
                    {
                        name: 'String Inverter',
                        bestFor: 'Commercial rooftops and distributed arrays.',
                        range: '20 kW - 350 kW',
                        highlight: 'Modular expansion and strong remote monitoring support.'
                    },
                    {
                        name: 'Hybrid Inverter',
                        bestFor: 'Sites requiring battery backup and smart load management.',
                        range: '3 kW - 50 kW',
                        highlight: 'Grid + solar + battery integration in one platform.'
                    },
                    {
                        name: 'Central Inverter',
                        bestFor: 'Large utility-scale and megawatt-class ground plants.',
                        range: '500 kW - 4 MW',
                        highlight: 'High-capacity conversion with reduced BOS complexity.'
                    }
                ]
            },
            structures: {
                label: 'Types of Structures',
                items: [
                    {
                        name: 'RCC Rooftop Elevated Structure',
                        bestFor: 'Terrace projects requiring tilt optimization and walkway clearance.',
                        range: 'Hot-dip galvanized steel',
                        highlight: 'Durable corrosion protection and easy maintenance access.'
                    },
                    {
                        name: 'Metal Sheet Roof Clamp Structure',
                        bestFor: 'Industrial sheds with minimal roof penetration requirements.',
                        range: 'Aluminum + SS fasteners',
                        highlight: 'Lightweight profile for fast and secure installation.'
                    },
                    {
                        name: 'Ground-Mount Fixed Tilt',
                        bestFor: 'Open-land captive and utility-scale projects.',
                        range: 'MS/HDG columns with concrete foundations',
                        highlight: 'Optimized row spacing for shading-free generation.'
                    }
                ]
            }
        };

        const renderCards = (key) => {
            const selected = componentData[key];
            componentCards.innerHTML = selected.items.map((item) => `
                <article class="card glow dynamic-card">
                    <p class="eyebrow">${selected.label}</p>
                    <h3>${item.name}</h3>
                    <p><strong>Best for:</strong> ${item.bestFor}</p>
                    <p><strong>Typical range:</strong> ${item.range}</p>
                    <p class="dynamic-note">${item.highlight}</p>
                </article>
            `).join('');
        };

        Object.entries(componentData).forEach(([key, value], index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `chip${index === 0 ? ' active' : ''}`;
            button.textContent = value.label;
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

            button.addEventListener('click', () => {
                componentTabs.querySelectorAll('.chip').forEach((chip) => {
                    chip.classList.remove('active');
                    chip.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                renderCards(key);
            });

            componentTabs.appendChild(button);
        });

        renderCards('panels');
    }

});

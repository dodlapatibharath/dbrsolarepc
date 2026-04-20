document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('pointermove', (event) => {
        const x = `${(event.clientX / window.innerWidth) * 100}%`;
        const y = `${(event.clientY / window.innerHeight) * 100}%`;
        document.body.style.setProperty('--mouse-x', x);
        document.body.style.setProperty('--mouse-y', y);
    });

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

    const revealElements = document.querySelectorAll('.card, .service-card, .timeline div, .stat-row article, .testimonial-box');
    if ('IntersectionObserver' in window && revealElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal', 'is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.22 });

        revealElements.forEach((element) => {
            element.classList.add('reveal');
            observer.observe(element);
        });
    }

    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const offset = Math.min(80, window.scrollY * 0.12);
            hero.style.backgroundPosition = `center ${offset}px`;
        }, { passive: true });
    }

    const dynamicBackdrop = document.createElement('div');
    dynamicBackdrop.className = 'dynamic-backdrop';
    document.body.prepend(dynamicBackdrop);

    const energyTrail = document.createElement('div');
    energyTrail.className = 'energy-trail';
    document.body.appendChild(energyTrail);

    Array.from({ length: 14 }, (_, index) => {
        const particle = document.createElement('span');
        particle.className = 'dynamic-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${index * 0.38}s`;
        particle.style.animationDuration = `${10 + Math.random() * 7}s`;
        dynamicBackdrop.appendChild(particle);
        return particle;
    });

    let lastPointerX = window.innerWidth * 0.5;
    let lastPointerY = window.innerHeight * 0.4;

    const updatePointerVisuals = () => {
        energyTrail.style.transform = `translate(${lastPointerX - 65}px, ${lastPointerY - 65}px)`;
    };

    updatePointerVisuals();

    document.addEventListener('pointermove', (event) => {
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        updatePointerVisuals();
    });

    document.querySelectorAll('.btn, .card, .service-card, .info-pill').forEach((node) => {
        node.addEventListener('pointermove', (event) => {
            const rect = node.getBoundingClientRect();
            const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
            const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
            node.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
        });

        node.addEventListener('pointerleave', () => {
            node.style.transform = '';
        });
    });

    const kpiNodes = Array.from(document.querySelectorAll('.stat-row article'));
    if (kpiNodes.length) {
        setInterval(() => {
            const picked = kpiNodes[Math.floor(Math.random() * kpiNodes.length)];
            picked.classList.add('pulse-kpi');
            setTimeout(() => picked.classList.remove('pulse-kpi'), 900);
        }, 1800);
    }

    const visionSnippets = [
        'Monitoring in real time',
        'Fine-tuning every kilowatt',
        'Dispatching quality on schedule',
        'Driving measurable savings'
    ];
    const sideHeading = document.querySelector('.side-headings p');
    if (sideHeading) {
        let copyIndex = 0;
        setInterval(() => {
            copyIndex = (copyIndex + 1) % visionSnippets.length;
            sideHeading.classList.add('fade-copy');
            setTimeout(() => {
                sideHeading.textContent = visionSnippets[copyIndex];
                sideHeading.classList.remove('fade-copy');
            }, 180);
        }, 3400);
    }

    const heroWord = document.querySelector('.hero h1 span');
    if (heroWord) {
        const words = ['rooftop', 'factory', 'campus', 'township'];
        let wordIndex = 0;
        setInterval(() => {
            wordIndex = (wordIndex + 1) % words.length;
            heroWord.textContent = words[wordIndex];
        }, 2200);
    }

    const quotationQuiz = document.getElementById('quotationQuiz');
    if (quotationQuiz) {
        const structureInput = document.getElementById('structureType');
        const moduleInput = document.getElementById('moduleType');
        const inverterInput = document.getElementById('inverterType');
        const resultEl = document.getElementById('calcResult');
        const progressSteps = Array.from(quotationQuiz.querySelectorAll('.quiz-step'));
        const panels = Array.from(quotationQuiz.querySelectorAll('.quiz-panel'));

        const quizPricing = {
            structures: {
                rcc_elevated: { label: 'RCC Rooftop Elevated Structure', factor: 1.06 },
                metal_sheet: { label: 'Metal Sheet Roof Clamp Structure', factor: 1.0 },
                ground_mount: { label: 'Ground-Mount Fixed Tilt', factor: 1.12 }
            },
            modules: {
                topcon: { label: 'Monocrystalline TOPCon', factor: 1.16 },
                perc: { label: 'Monocrystalline PERC', factor: 1.0 },
                bifacial: { label: 'Bifacial Modules', factor: 1.12 }
            },
            inverters: {
                string: { label: 'String Inverter', factor: 1.0 },
                hybrid: { label: 'Hybrid Inverter', factor: 1.18 },
                central: { label: 'Central Inverter', factor: 1.09 }
            }
        };

        const showStep = (stepNumber) => {
            panels.forEach((panel) => {
                panel.classList.toggle('hidden', Number(panel.dataset.panel) !== stepNumber);
            });
            progressSteps.forEach((step) => {
                step.classList.toggle('active', Number(step.dataset.step) === stepNumber);
            });
        };

        const moveStep = (targetStep) => {
            const selectedStructure = structureInput?.value;
            const selectedModule = moduleInput?.value;
            if (targetStep === 2 && !selectedStructure) {
                resultEl.innerHTML = '<p class="result">Please select a structure type to continue.</p>';
                return;
            }
            if (targetStep === 3 && !selectedModule) {
                resultEl.innerHTML = '<p class="result">Please select a module type to continue.</p>';
                return;
            }
            showStep(targetStep);
        };

        quotationQuiz.querySelectorAll('.quiz-next').forEach((button) => {
            button.addEventListener('click', () => moveStep(Number(button.dataset.next)));
        });

        quotationQuiz.querySelectorAll('.quiz-prev').forEach((button) => {
            button.addEventListener('click', () => showStep(Number(button.dataset.prev)));
        });

        quotationQuiz.addEventListener('submit', (event) => {
            event.preventDefault();
            const structure = quizPricing.structures[structureInput?.value];
            const moduleType = quizPricing.modules[moduleInput?.value];
            const inverter = quizPricing.inverters[inverterInput?.value];

            if (!structure || !moduleType || !inverter) {
                resultEl.innerHTML = '<p class="result">Please complete all three selections to calculate estimate.</p>';
                return;
            }

            const baseSystemSize = 10;
            const basePricePerKW = 46000;
            const combinedFactor = structure.factor * moduleType.factor * inverter.factor;
            const estimatedSystemKW = Math.round(baseSystemSize * combinedFactor * 10) / 10;
            const estimatedPrice = Math.round(estimatedSystemKW * basePricePerKW);
            const annualGeneration = Math.round(estimatedSystemKW * 4.5 * 365 * 0.8);

            resultEl.innerHTML = `
                <p><strong>Structure:</strong> ${structure.label}</p>
                <p><strong>Module:</strong> ${moduleType.label}</p>
                <p><strong>Inverter:</strong> ${inverter.label}</p>
                <p><strong>Estimated system size:</strong> ${estimatedSystemKW.toLocaleString('en-IN')} kW</p>
                <p><strong>Estimated project quotation:</strong> ₹${estimatedPrice.toLocaleString('en-IN')}</p>
                <p><strong>Estimated yearly generation:</strong> ${annualGeneration.toLocaleString('en-IN')} units</p>
                <p class="calc-note">*Indicative estimate. Final quote depends on site survey, shadow analysis, and electrical scope.</p>
            `;
        });

        showStep(1);
    }

    const quizWelcomeModal = document.getElementById('quizWelcomeModal');
    const startQuizBtn = document.getElementById('startQuizBtn');
    const closeQuizBtn = document.getElementById('closeQuizBtn');
    if (quizWelcomeModal && startQuizBtn && closeQuizBtn) {
        setTimeout(() => {
            quizWelcomeModal.classList.remove('hidden');
        }, 1200);

        startQuizBtn.addEventListener('click', () => {
            quizWelcomeModal.classList.add('hidden');
            document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        closeQuizBtn.addEventListener('click', () => {
            quizWelcomeModal.classList.add('hidden');
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

    const liveValueNodes = {
        generation: document.querySelector('[data-live-value="generation"]'),
        offset: document.querySelector('[data-live-value="offset"]'),
        sites: document.querySelector('[data-live-value="sites"]')
    };
    if (liveValueNodes.generation && liveValueNodes.offset && liveValueNodes.sites) {
        const start = {
            generation: 12840,
            offset: 10670,
            sites: 42
        };
        const updateLiveMetrics = () => {
            start.generation += Math.round(Math.random() * 28 + 9);
            start.offset += Math.round(Math.random() * 21 + 7);
            start.sites += Math.random() > 0.8 ? 1 : 0;

            liveValueNodes.generation.textContent = `${start.generation.toLocaleString('en-IN')} kWh`;
            liveValueNodes.offset.textContent = `${start.offset.toLocaleString('en-IN')} kg CO₂`;
            liveValueNodes.sites.textContent = start.sites.toLocaleString('en-IN');
        };
        updateLiveMetrics();
        setInterval(updateLiveMetrics, 2400);
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


    const razorpayPaymentForm = document.getElementById('razorpayPaymentForm');
    if (razorpayPaymentForm) {
        const statusEl = document.getElementById('paymentStatus');

        razorpayPaymentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!window.Razorpay) {
                if (statusEl) {
                    statusEl.textContent = 'Unable to load Razorpay checkout. Please refresh and try again.';
                }
                return;
            }

            const name = document.getElementById('paymentName')?.value?.trim() || '';
            const email = document.getElementById('paymentEmail')?.value?.trim() || '';
            const phone = document.getElementById('paymentPhone')?.value?.trim() || '';
            const amount = Number(document.getElementById('paymentAmount')?.value || 0);

            if (!name || !email || !phone || amount < 1) {
                if (statusEl) {
                    statusEl.textContent = 'Please fill all payment fields with valid values.';
                }
                return;
            }

            if (statusEl) {
                statusEl.textContent = 'Creating secure payment order...';
            }

            try {
                const orderResponse = await fetch('/api/payments/razorpay/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount,
                        customerName: name,
                        customerEmail: email,
                        customerPhone: phone
                    })
                });

                const orderPayload = await orderResponse.json();
                if (!orderResponse.ok) {
                    throw new Error(orderPayload.message || 'Failed to initialize payment.');
                }

                const options = {
                    key: orderPayload.keyId,
                    amount: orderPayload.order.amount,
                    currency: orderPayload.order.currency,
                    name: 'DBR Solar EPC Pvt Ltd',
                    description: 'Project Booking Payment',
                    order_id: orderPayload.order.id,
                    prefill: { name, email, contact: phone },
                    theme: { color: '#00c7b2' },
                    handler: async (response) => {
                        const verifyResponse = await fetch('/api/payments/razorpay/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature
                            })
                        });

                        const verifyPayload = await verifyResponse.json();
                        if (!verifyResponse.ok) {
                            throw new Error(verifyPayload.message || 'Payment verification failed.');
                        }

                        if (statusEl) {
                            statusEl.textContent = `Payment successful. Payment ID: ${verifyPayload.paymentId}`;
                        }
                        razorpayPaymentForm.reset();
                    },
                    modal: {
                        ondismiss: () => {
                            if (statusEl) {
                                statusEl.textContent = 'Payment cancelled.';
                            }
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', (paymentEvent) => {
                    if (statusEl) {
                        statusEl.textContent = paymentEvent.error.description || 'Payment failed. Please try again.';
                    }
                });
                rzp.open();
            } catch (error) {
                if (statusEl) {
                    statusEl.textContent = error.message || 'Unable to process payment at this time.';
                }
            }
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

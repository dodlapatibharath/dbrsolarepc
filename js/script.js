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

    const indiaMapElement = document.getElementById('indiaStateMap');
    const stateNameEl = document.getElementById('selectedStateName');
    const stateMetaEl = document.getElementById('selectedStateMeta');
    const stateStatsEl = document.getElementById('selectedStateStats');

    if (indiaMapElement && window.google?.charts) {
        const tariffInput = document.getElementById('tariff');
        const billInput = document.getElementById('bill');
        const stateConfig = {
            'IN-AP': { name: 'Andhra Pradesh', sunlight: 5.2, tariff: 7.3, billHint: 3400 },
            'IN-AR': { name: 'Arunachal Pradesh', sunlight: 4.1, tariff: 5.4, billHint: 2200 },
            'IN-AS': { name: 'Assam', sunlight: 4.3, tariff: 6.2, billHint: 2400 },
            'IN-BR': { name: 'Bihar', sunlight: 4.7, tariff: 6.4, billHint: 2600 },
            'IN-CT': { name: 'Chhattisgarh', sunlight: 5.1, tariff: 6.7, billHint: 2800 },
            'IN-DL': { name: 'Delhi', sunlight: 5.0, tariff: 8.5, billHint: 4100 },
            'IN-GA': { name: 'Goa', sunlight: 5.4, tariff: 8.1, billHint: 3600 },
            'IN-GJ': { name: 'Gujarat', sunlight: 5.8, tariff: 7.8, billHint: 3900 },
            'IN-HR': { name: 'Haryana', sunlight: 5.4, tariff: 7.2, billHint: 3300 },
            'IN-HP': { name: 'Himachal Pradesh', sunlight: 4.8, tariff: 6.3, billHint: 2500 },
            'IN-JH': { name: 'Jharkhand', sunlight: 4.7, tariff: 6.6, billHint: 2700 },
            'IN-KA': { name: 'Karnataka', sunlight: 5.6, tariff: 7.4, billHint: 3500 },
            'IN-KL': { name: 'Kerala', sunlight: 4.8, tariff: 7.1, billHint: 3200 },
            'IN-MP': { name: 'Madhya Pradesh', sunlight: 5.5, tariff: 6.9, billHint: 3000 },
            'IN-MH': { name: 'Maharashtra', sunlight: 5.5, tariff: 9.0, billHint: 4300 },
            'IN-MN': { name: 'Manipur', sunlight: 4.2, tariff: 5.9, billHint: 2300 },
            'IN-ML': { name: 'Meghalaya', sunlight: 4.0, tariff: 5.7, billHint: 2200 },
            'IN-MZ': { name: 'Mizoram', sunlight: 4.1, tariff: 5.8, billHint: 2100 },
            'IN-NL': { name: 'Nagaland', sunlight: 4.1, tariff: 6.0, billHint: 2200 },
            'IN-OR': { name: 'Odisha', sunlight: 5.0, tariff: 6.8, billHint: 2900 },
            'IN-PB': { name: 'Punjab', sunlight: 5.3, tariff: 7.0, billHint: 3200 },
            'IN-RJ': { name: 'Rajasthan', sunlight: 6.0, tariff: 7.2, billHint: 3800 },
            'IN-SK': { name: 'Sikkim', sunlight: 4.2, tariff: 5.6, billHint: 2100 },
            'IN-TN': { name: 'Tamil Nadu', sunlight: 5.6, tariff: 7.5, billHint: 3600 },
            'IN-TG': { name: 'Telangana', sunlight: 5.7, tariff: 7.4, billHint: 3500 },
            'IN-TR': { name: 'Tripura', sunlight: 4.3, tariff: 5.9, billHint: 2300 },
            'IN-UP': { name: 'Uttar Pradesh', sunlight: 5.0, tariff: 6.7, billHint: 3000 },
            'IN-UT': { name: 'Uttarakhand', sunlight: 4.9, tariff: 6.5, billHint: 2700 },
            'IN-WB': { name: 'West Bengal', sunlight: 4.7, tariff: 6.9, billHint: 3000 },
            'IN-AN': { name: 'Andaman and Nicobar Islands', sunlight: 5.3, tariff: 7.2, billHint: 3200 },
            'IN-CH': { name: 'Chandigarh', sunlight: 5.2, tariff: 7.3, billHint: 3400 },
            'IN-DH': { name: 'Dadra and Nagar Haveli and Daman and Diu', sunlight: 5.4, tariff: 7.6, billHint: 3500 },
            'IN-JK': { name: 'Jammu and Kashmir', sunlight: 4.9, tariff: 6.4, billHint: 2600 },
            'IN-LA': { name: 'Ladakh', sunlight: 5.8, tariff: 6.2, billHint: 2400 },
            'IN-LD': { name: 'Lakshadweep', sunlight: 5.5, tariff: 7.8, billHint: 3400 },
            'IN-PY': { name: 'Puducherry', sunlight: 5.4, tariff: 7.4, billHint: 3300 }
        };

        const buildLiveDataRows = () => Object.entries(stateConfig).map(([code, config]) => {
            const swing = (Math.random() * 18) - 9;
            const liveIndex = Math.max(35, Math.round((config.sunlight * 16) + swing));
            return [code, liveIndex];
        });

        let selectedStateCode = null;
        let latestRows = buildLiveDataRows();
        let chart;

        const updateStatePanel = (stateCode, liveIndex) => {
            const selected = stateConfig[stateCode];
            if (!selected) return;

            stateNameEl.textContent = selected.name;
            stateMetaEl.textContent = `Live solar activity index: ${liveIndex}/100`;
            stateStatsEl.innerHTML = `
                <li><strong>Average sunlight:</strong> ${selected.sunlight.toFixed(1)} peak hours/day</li>
                <li><strong>Typical grid tariff:</strong> ₹${selected.tariff.toFixed(1)} / unit</li>
                <li><strong>Suggested starter bill value:</strong> ₹${selected.billHint.toLocaleString('en-IN')}</li>
            `;

            if (tariffInput) {
                tariffInput.value = selected.tariff.toFixed(1);
            }
            if (billInput) {
                billInput.value = selected.billHint;
            }
            tariffInput?.dispatchEvent(new Event('input', { bubbles: true }));
            billInput?.dispatchEvent(new Event('input', { bubbles: true }));
        };

        const drawMap = () => {
            const data = google.visualization.arrayToDataTable([
                ['State Code', 'Live Activity'],
                ...latestRows
            ]);

            const options = {
                region: 'IN',
                resolution: 'provinces',
                backgroundColor: 'transparent',
                datalessRegionColor: '#0d214c',
                defaultColor: '#27457c',
                keepAspectRatio: true,
                legend: 'none',
                colorAxis: { colors: ['#2d4f89', '#4f8ad4', '#74f1c0', '#f5d56f'] }
            };

            chart = chart || new google.visualization.GeoChart(indiaMapElement);
            chart.draw(data, options);

            google.visualization.events.removeAllListeners(chart);
            google.visualization.events.addListener(chart, 'select', () => {
                const selection = chart.getSelection();
                if (!selection.length) return;

                const row = selection[0].row;
                const stateCode = data.getValue(row, 0);
                const liveIndex = data.getValue(row, 1);
                selectedStateCode = stateCode;
                updateStatePanel(stateCode, liveIndex);
            });

            if (!selectedStateCode && latestRows.length) {
                selectedStateCode = latestRows[0][0];
                updateStatePanel(latestRows[0][0], latestRows[0][1]);
            } else if (selectedStateCode) {
                const selectedRow = latestRows.find(([code]) => code === selectedStateCode);
                if (selectedRow) {
                    updateStatePanel(selectedRow[0], selectedRow[1]);
                }
            }
        };

        google.charts.load('current', { packages: ['geochart'] });
        google.charts.setOnLoadCallback(() => {
            drawMap();
            setInterval(() => {
                latestRows = buildLiveDataRows();
                drawMap();
            }, 7000);
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

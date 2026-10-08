// ==========================================================================
// FYZZO CONCIERGE & TRUST SERVICES LTD. - CLIENT PORTAL & CALCULATOR SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // Pricing Currency Data
    const pricingData = {
        USD: {
            symbol: '$',
            t1: '$320',
            t2: 'From $550',
            t3: '$385',
            t4: '$2,000 – $3,800',
            escrowDefault: 100000,
            rateDivisor: 1
        },
        GBP: {
            symbol: '£',
            t1: '£250',
            t2: 'From £425',
            t3: '£300',
            t4: '£1,600 – £3,000',
            escrowDefault: 80000,
            rateDivisor: 1.25
        },
        NGN: {
            symbol: '₦',
            t1: '₦500,000',
            t2: 'From ₦850,000',
            t3: '₦600,000',
            t4: '₦3,000,000 – ₦6,000,000',
            escrowDefault: 150000000,
            rateDivisor: 0.000625
        }
    };

    let currentCurrency = 'USD';

    // Currency Switcher
    const currButtons = document.querySelectorAll('.curr-btn');
    const t1El = document.getElementById('t1-price');
    const t2El = document.getElementById('t2-price');
    const t3El = document.getElementById('t3-price');
    const t4El = document.getElementById('t4-price');
    const currSymbolEl = document.querySelector('.curr-symbol');
    const escrowInput = document.getElementById('escrow-amount');

    currButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCurrency = btn.dataset.curr;
            updatePrices();
            recalcEscrow();
        });
    });

    function updatePrices() {
        const data = pricingData[currentCurrency];
        t1El.innerHTML = `${data.t1} <span>/ month</span>`;
        t2El.innerHTML = `${data.t2} <span>/ month</span>`;
        t3El.innerHTML = `${data.t3} <span>/ month</span>`;
        t4El.innerHTML = `${data.t4} <span>/ month</span>`;
        currSymbolEl.textContent = data.symbol;
        escrowInput.value = data.escrowDefault;
    }

    // Escrow Calculator
    const calcRateEl = document.getElementById('calc-rate');
    const calcFeeEl = document.getElementById('calc-fee');

    function recalcEscrow() {
        const budget = parseFloat(escrowInput.value) || 0;
        let ratePercent = 4.5;

        // USD base equivalent calculation
        const usdEquivalent = budget * (currentCurrency === 'NGN' ? 0.000625 : (currentCurrency === 'GBP' ? 1.25 : 1));

        if (usdEquivalent <= 150000) {
            ratePercent = 5.5;
        } else if (usdEquivalent <= 500000) {
            ratePercent = 4.5;
        } else if (usdEquivalent <= 1500000) {
            ratePercent = 3.5;
        } else {
            ratePercent = 2.8;
        }

        const fee = (budget * (ratePercent / 100));
        const symbol = pricingData[currentCurrency].symbol;

        calcRateEl.textContent = `${ratePercent.toFixed(1)}%`;
        calcFeeEl.textContent = `${symbol}${fee.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }

    escrowInput.addEventListener('input', recalcEscrow);

    // Lead Form Submission Handler
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('serviceType').value;

            alert(`Thank you, ${fullName}.\n\nYour confidential onboarding brief for [${service}] has been submitted under institutional NDA.\n\nA Senior Trust Officer will contact you within 4 hours at ${email} with your private vault access link and scheduled briefing.`);
            leadForm.reset();
        });
    }

    // Smooth Scrolling for In-Page Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ======================================================================
    // FYZZO AI CONCIERGE INTELLIGENCE ENGINE & CHATBOT SYSTEM
    // ======================================================================

    const chatWidget = document.getElementById('chatWidget');
    const chatTriggerBtn = document.getElementById('chatTriggerBtn');
    const chatPanel = document.getElementById('chatPanel');
    const chatMinimizeBtn = document.getElementById('chatMinimizeBtn');
    const chatInputForm = document.getElementById('chatInputForm');
    const chatUserInput = document.getElementById('chatUserInput');
    const chatMessages = document.getElementById('chatMessages');
    const quickChips = document.getElementById('quickChips');
    const chatUnreadDot = document.getElementById('chatUnreadDot');

    // Toggle Chat Panel
    if (chatTriggerBtn && chatPanel) {
        chatTriggerBtn.addEventListener('click', () => {
            chatPanel.classList.toggle('active');
            if (chatUnreadDot) chatUnreadDot.style.display = 'none';
            if (chatPanel.classList.contains('active')) {
                setTimeout(() => chatUserInput.focus(), 200);
            }
        });

        chatMinimizeBtn.addEventListener('click', () => {
            chatPanel.classList.remove('active');
        });
    }

    // Quick Action Chips
    if (quickChips) {
        quickChips.querySelectorAll('.chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                handleUserQuery(query);
            });
        });
    }

    // Form Submit
    if (chatInputForm) {
        chatInputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatUserInput.value.trim();
            if (!text) return;
            handleUserQuery(text);
            chatUserInput.value = '';
        });
    }

    // Append Message to Stream
    function appendMessage(sender, htmlContent) {
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${sender}-bubble`;
        
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (sender === 'bot') {
            bubble.innerHTML = `
                <div class="bubble-header">FYZZO AI Advisor</div>
                ${htmlContent}
                <span class="bubble-time">${timeStr}</span>
            `;
        } else {
            bubble.innerHTML = `
                <p>${escapeHtml(htmlContent)}</p>
                <span class="bubble-time">${timeStr}</span>
            `;
        }

        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Show Typing Indicator
    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const typingEl = document.createElement('div');
        typingEl.id = id;
        typingEl.className = 'message-bubble bot-bubble';
        typingEl.innerHTML = `
            <div class="bubble-header">FYZZO AI Advisor</div>
            <p><em>Thinking & reviewing on-ground operational logs...</em></p>
        `;
        chatMessages.appendChild(typingEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // FYZZO Knowledge Brain & Natural Language Processor
    function generateAIResponse(query) {
        const q = query.toLowerCase();

        // 1. Building & Construction Oversight / Delays
        if (q.includes('build') || q.includes('construction') || q.includes('contractor') || q.includes('delay') || q.includes('cement') || q.includes('site') || q.includes('scam')) {
            return `
                <p><strong>Here is how FYZZO protects your building project:</strong></p>
                <p>Contractors often drag schedules or give false excuses because they know you are not in Nigeria. Relatives often hesitate to challenge workers or may divert funds.</p>
                <ul>
                    <li><strong>Unannounced Site Visits:</strong> We arrive physically, count delivered bags of cement, sand, blocks, and iron rods against your supplier invoice.</li>
                    <li><strong>Uncut HD Video:</strong> We walk the perimeter and interior, recording continuous video showing date, time, and worker count.</li>
                    <li><strong>Milestone Verification:</strong> We only recommend you release your milestone payment when work on that stage is 100% verified.</li>
                </ul>
                <p><strong>Pricing:</strong> Retainers start from <strong>$550 / mo (₦850,000 / mo)</strong> for up to 4 inspections/month, or a full project rate of <strong>2.0% – 2.5%</strong> of total build cost. Single visits are <strong>$450 (₦700,000)</strong>.</p>
                <p><a href="#intake" class="btn btn-gold" style="display:inline-block; margin-top:6px; padding:6px 14px; font-size:0.8rem;">Request Project Inspection &rarr;</a></p>
            `;
        }

        // 2. Pricing & Cost Queries
        if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('how much') || q.includes('fee') || q.includes('naira') || q.includes('dollar') || q.includes('package')) {
            return `
                <p><strong>FYZZO Official Pricing Architecture (Transparent & Competitive):</strong></p>
                <ul>
                    <li><strong>Tier 1: Property Guardian:</strong> $320 / mo (₦500,000 / £250) &bull; 2 visits/mo for vacant land, tenancies & buildings.</li>
                    <li><strong>Tier 2: Build & Project Guardian:</strong> From $550 / mo (₦850,000 / £425) &bull; 4 weekly visits, material counts & schedule tracking. Or 2.0% – 2.5% of build cost.</li>
                    <li><strong>Tier 3: Family Care & Welfare:</strong> $385 / mo (₦600,000 / £300) &bull; Weekly parent home visits, hospital clinic accompaniment & medication audit.</li>
                    <li><strong>Tier 4: Private Client Mandate:</strong> $2,000 – $3,800 / mo &bull; Multi-asset executive representation.</li>
                    <li><strong>Single Visits:</strong> Single Build Audit ($450 / ₦700k) &bull; Single Elder Care Visit ($325 / ₦500k).</li>
                    <li><strong>Custom Mandates:</strong> Quoted based on location and scope.</li>
                </ul>
                <p><em>All retainers are backed by a formal corporate contract with zero contractor kickbacks.</em></p>
            `;
        }

        // 3. Custom Mandates / Anything else / Non-standard requests
        if (q.includes('custom') || q.includes('anything') || q.includes('not listed') || q.includes('errand') || q.includes('special') || q.includes('other') || q.includes('represent') || q.includes('meeting') || q.includes('court') || q.includes('police') || q.includes('car')) {
            return `
                <p><strong>Yes, absolutely! That is what our "Custom Client Mandate" is for.</strong></p>
                <p>If you have any task, transaction, or situation in Nigeria that requires a serious, trustworthy, and authoritative physical presence—we can execute it under your direct instructions.</p>
                <p><strong>Common examples we handle:</strong></p>
                <ul>
                    <li>Attending family or community arbitrations in your place</li>
                    <li>Verifying sellers, car purchases, or business partners before you send money</li>
                    <li>Retrieving official school certificates, transcripts, or court/ministry documents</li>
                    <li>Managing sensitive disputes or unannounced checks on local caretakers</li>
                </ul>
                <p>Simply scroll down to our form and select <strong>"Custom Client Mandate"</strong> or reach out directly on WhatsApp at <strong>08037150738</strong>.</p>
            `;
        }

        // 4. Aging Parents & Family Healthcare Welfare
        if (q.includes('parent') || q.includes('elder') || q.includes('mother') || q.includes('father') || q.includes('health') || q.includes('hospital') || q.includes('clinic') || q.includes('doctor') || q.includes('drug') || q.includes('medication')) {
            return `
                <p><strong>Elderly Parent & Family Welfare Protection:</strong></p>
                <p>Many diaspora families worry about their aging parents being neglected by domestic staff or running out of food, power, or authentic medications.</p>
                <ul>
                    <li><strong>Dignified Home Visits:</strong> We inspect their living conditions, check refrigerator provisions, test inverters/generators, and converse warmly with them.</li>
                    <li><strong>Clinic Accompaniment:</strong> We escort them to hospital checkups, take notes with the doctor, and verify hospital bills.</li>
                    <li><strong>Direct Medication Sourcing:</strong> We buy unadulterated drugs directly from certified distributor pharmacies.</li>
                    <li><strong>Live Video Link:</strong> You can join via video call during the visit.</li>
                </ul>
                <p><strong>Plan:</strong> $385 / month (₦600,000 / mo | 4 visits) or $325 (₦500k) for a single comprehensive visit.</p>
            `;
        }

        // 5. Land, Registry & Asset Encroachment
        if (q.includes('land') || q.includes('property') || q.includes('survey') || q.includes('beacon') || q.includes('tenant') || q.includes('rent') || q.includes('omo-onile') || q.includes('c of o') || q.includes('registry')) {
            return `
                <p><strong>Landed Asset & Property Protection:</strong></p>
                <p>We physically defend and audit your real estate assets across Nigeria:</p>
                <ul>
                    <li><strong>Beacon & Perimeter Checks:</strong> Confirming your boundary pillars are intact and stopping illegal encroachers or community squatters.</li>
                    <li><strong>Tenancy Audits:</strong> Checking the physical state of your rental properties and verifying tenant occupancy.</li>
                    <li><strong>Registry Searches:</strong> In-person title checks at Alausa (Lagos), AGIS (Abuja), or state land registries.</li>
                </ul>
                <p><strong>Property Guardian Retainer:</strong> $320 / mo (₦500,000 / mo for 2 detailed audits/mo).</p>
            `;
        }

        // 6. Relatives Diverting Funds / Family Dilemma
        if (q.includes('family') || q.includes('relative') || q.includes('brother') || q.includes('sister') || q.includes('uncle') || q.includes('steal') || q.includes('divert') || q.includes('trust')) {
            return `
                <p><strong>Stopping Family Fund Diversion Without Damaging Relationships:</strong></p>
                <p>Relying on family members creates awkwardness: if you ask for receipts, they feel insulted; if you don't, they may divert your money to solve personal emergencies.</p>
                <p><strong>The Corporate Shield:</strong> When you hire FYZZO, you take the pressure off your family. You simply tell them: <em>“I have a corporate management contract with an independent company that oversees our audits and milestones.”</em></p>
                <p>This preserves family peace while giving you total transparency and verifiable proof.</p>
            `;
        }

        // 7. General / Location / Coverage
        if (q.includes('where') || q.includes('location') || q.includes('state') || q.includes('lagos') || q.includes('abuja') || q.includes('nationwide') || q.includes('city')) {
            return `
                <p><strong>Nationwide Operational Coverage:</strong></p>
                <p>Our primary operational hubs are in <strong>Lagos</strong> and <strong>Abuja</strong>, with established field officers dispatched nationwide across Oyo, Ogun, Delta, Rivers (Port Harcourt), Edo, Enugu, Anambra, Imo, and other states.</p>
                <p>Contact our operations desk on WhatsApp at <strong>08037150738</strong> or email <strong>trustbyFyzzo@gmail.com</strong>.</p>
            `;
        }

        // Default Intelligent Fallback with Lead Conversion Upsell
        return `
            <p>Thank you for asking. <strong>FYZZO Concierge & Trust Services Ltd</strong> acts as your formal on-ground proxy in Nigeria.</p>
            <p>We specialize in:</p>
            <ul>
                <li><strong>Building Projects:</strong> Schedule supervision, counting materials, and milestone verification.</li>
                <li><strong>Elderly Parents:</strong> Dignified home visits, clinic accompaniment, and authentic medications.</li>
                <li><strong>Property & Land:</strong> Beacon checks, tenant oversight, and pre-purchase due diligence.</li>
                <li><strong>Custom Client Mandates:</strong> Any specific errand, meeting representation, or urgent matter across Nigeria.</li>
            </ul>
            <p>Would you like an immediate estimate, or would you prefer a confidential consultation on WhatsApp with a Senior Trust Officer?</p>
            <p><a href="https://wa.me/2348037150738" target="_blank" class="btn btn-gold" style="display:inline-block; padding:6px 14px; font-size:0.8rem;">Chat with Trust Lead on WhatsApp &rarr;</a></p>
        `;
    }

    function handleUserQuery(query) {
        appendMessage('user', query);

        const typingId = showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator(typingId);
            const botResponse = generateAIResponse(query);
            appendMessage('bot', botResponse);
        }, 600);
    }

    // ======================================================================
    // EXIT-INTENT UPSELL & BESPOKE CONSULTATION MODAL
    // ======================================================================

    const exitModal = document.getElementById('exitModal');
    const exitModalClose = document.getElementById('exitModalClose');
    const exitLeadForm = document.getElementById('exitLeadForm');
    const exitSuccessMsg = document.getElementById('exitSuccessMsg');

    let hasShownExitModal = false;

    // Detect mouse leaving window at the top
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 10 && !hasShownExitModal) {
            hasShownExitModal = true;
            if (exitModal) exitModal.classList.add('active');
        }
    });

    if (exitModalClose && exitModal) {
        exitModalClose.addEventListener('click', () => {
            exitModal.classList.remove('active');
        });

        exitModal.addEventListener('click', (e) => {
            if (e.target === exitModal) {
                exitModal.classList.remove('active');
            }
        });
    }

    if (exitLeadForm) {
        exitLeadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('exitName').value;
            const phone = document.getElementById('exitPhone').value;
            const email = document.getElementById('exitEmail').value;
            const task = document.getElementById('exitTask').value;

            // Store in LocalStorage for persistence/upsell
            try {
                const leadData = { name, phone, email, task, timestamp: new Date().toISOString() };
                localStorage.setItem('fyzzo_lead_' + Date.now(), JSON.stringify(leadData));
            } catch (err) {}

            exitLeadForm.style.display = 'none';
            if (exitSuccessMsg) exitSuccessMsg.style.display = 'block';

            setTimeout(() => {
                if (exitModal) exitModal.classList.remove('active');
            }, 5000);
        });
    }

});

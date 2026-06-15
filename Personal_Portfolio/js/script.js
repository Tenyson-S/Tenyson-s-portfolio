/* ============================================================
   HARIHARAN TS — PORTFOLIO JAVASCRIPT
   Features: Interactive Particles · Cursor Blobs · Typewriter
             ScrollReveal · Filters · Smart Contact · Theme Toggle
             Toast Notifications · Back to Top
   ============================================================ */

/* ===== CONFIGURATION ===== */
const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_MOBILE_OR_TABLET = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 992;
const CONFIG = {
    whatsappNumber: '916382939578',
    apiEndpoint: '/api/contact',
    particleCount: 24,
    mouseRadius: 150,
};

/* ===== TOAST NOTIFICATION SYSTEM ===== */
const Toast = {
    container: null,

    init() {
        this.container = document.getElementById('toast-container');
    },

    show(message, type = 'info', duration = 4000) {
        if (!this.container) this.init();

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="toast-icon ${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button class="toast-close" aria-label="Close"><i class="fas fa-times"></i></button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.dismiss(toast));

        this.container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => this.dismiss(toast), duration);
        }
    },

    dismiss(toast) {
        if (!toast || toast.classList.contains('toast-out')) return;
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    },
};

/* ===== PARTICLE CANVAS (Enhanced with Mouse Interaction) ===== */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    canvas.style.display = 'none';
    return;
    const chars = ['{ }', '</>', '{}', ';', '01', '( )', '=>', '&&', '||', '++', '/*', '*/'];
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let blobX, blobY;
    const useMouseRepulsion = window.innerWidth >= 1400 && !PREFERS_REDUCED_MOTION;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        blobX = canvas.width / 2;
        blobY = canvas.height / 2;
    }
    resize();
    window.addEventListener('resize', resize);

    /* Track mouse for cursor-based effects */
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    class Particle {
        constructor() { this.reset(true); }
        reset(initial) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
            this.char = chars[Math.floor(Math.random() * chars.length)];
            this.size = Math.random() * 11 + 9;
            this.speed = Math.random() * 0.4 + 0.15;
            this.baseOpacity = Math.random() * 0.18 + 0.03;
            this.opacity = this.baseOpacity;
            this.drift = (Math.random() - 0.5) * 0.3;
            this.color = Math.random() > 0.5 ? '#7c3aed' : '#06b6d4';
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift;

            /* Mouse repulsion — particles gently push away from cursor */
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (useMouseRepulsion && dist < CONFIG.mouseRadius) {
                const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                this.x -= dx * force * 0.015;
                this.y -= dy * force * 0.015;
                /* Glow brighter near cursor */
                this.opacity = this.baseOpacity + force * 0.15;
            } else {
                this.opacity += (this.baseOpacity - this.opacity) * 0.05;
            }

            if (this.y < -20) this.reset(false);
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.font = `${this.size}px 'Fira Code', monospace`;
            ctx.fillText(this.char, this.x, this.y);
            ctx.restore();
        }
    }

    for (let i = 0; i < CONFIG.particleCount; i++) particles.push(new Particle());

    /* Gradient blobs that follow cursor with smooth easing */
    function drawBlobs() {
        if (mouse.x > 0) {
            blobX += (mouse.x - blobX) * 0.02;
            blobY += (mouse.y - blobY) * 0.02;
        }

        /* Primary blob — purple glow following cursor */
        const g1 = ctx.createRadialGradient(blobX, blobY, 0, blobX, blobY, 250);
        g1.addColorStop(0, 'rgba(124, 58, 237, 0.07)');
        g1.addColorStop(1, 'rgba(124, 58, 237, 0)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        /* Secondary blob — cyan glow mirrored */
        const mirrorX = canvas.width - blobX * 0.5;
        const mirrorY = canvas.height - blobY * 0.5;
        const g2 = ctx.createRadialGradient(mirrorX, mirrorY, 0, mirrorX, mirrorY, 220);
        g2.addColorStop(0, 'rgba(6, 182, 212, 0.05)');
        g2.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBlobs();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ===== TYPEWRITER ===== */
(function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const roles = [
        'AI/ML Engineer',
        'Software Engineer',
        'Systems Thinker',
        'Creative Problem Solver'
    ];
    let roleIndex = 0, charIndex = 0, deleting = false;

    function type() {
        const current = roles[roleIndex];
        if (deleting) {
            el.textContent = current.substring(0, charIndex--);
            if (charIndex < 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, 500);
                return;
            }
        } else {
            el.textContent = current.substring(0, charIndex++);
            if (charIndex > current.length) {
                deleting = true;
                setTimeout(type, 2000);
                return;
            }
        }
        setTimeout(type, deleting ? 60 : 100);
    }
    type();
})();

/* ===== SCROLL REVEAL ===== */
(function initScrollReveal() {
    const observer = new IntersectionObserver(
        entries => entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        }),
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ===== NAVBAR SCROLL + ACTIVE LINK ===== */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
    });

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // close mobile menu
            document.getElementById('nav-links').classList.remove('open');
            document.getElementById('hamburger').classList.remove('active');
        });
    });
})();

/* ===== HAMBURGER MENU ===== */
(function initHamburger() {
    const btn = document.getElementById('hamburger');
    const menu = document.getElementById('nav-links');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        menu.classList.toggle('open');
    });
})();

/* ===== ANIMATED COUNTERS ===== */
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            let current = 0;
            const step = Math.ceil(target / 40);
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current;
                if (current >= target) clearInterval(timer);
            }, 40);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
})();

/* ===== SECTION ANIMATIONS ===== */
(function initSectionAnimations() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const projectCards = document.querySelectorAll('.project-card');

    const skillObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const fill = entry.target;
            fill.style.width = fill.dataset.width || '0%';
            skillObserver.unobserve(fill);
        });
    }, { threshold: 0.35 });

    skillBars.forEach(fill => {
        fill.style.width = '0%';
        skillObserver.observe(fill);
    });

    const projectObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const card = entry.target;
            const delay = Array.from(projectCards).indexOf(card) * 100;
            setTimeout(() => card.classList.add('project-visible'), delay);
            projectObserver.unobserve(card);
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    projectCards.forEach(card => projectObserver.observe(card));
})();

/* ===== EMAILJS CONFIGURATION ===== */
/*
 * HOW TO SET UP (takes ~5 minutes, free):
 *
 * 1. Go to https://www.emailjs.com → Sign up (free: 200 emails/month)
 * 2. Add a Service: Dashboard → Email Services → Add Service → Gmail
 *    • Connect your Gmail → copy the SERVICE_ID below
 *
 * 3. Create Template 1 — "contact_notification" (message TO you):
 *    Subject : New message from {{from_name}} via Portfolio
 *    Body    :
 *      Name   : {{from_name}}
 *      Email  : {{from_email}}
 *      Subject: {{subject}}
 *      Message: {{message}}
 *    → Copy the Template ID → paste as TEMPLATE_NOTIFICATION below
 *
 * 4. Create Template 2 — "contact_autoreply" (auto-reply TO sender):
 *    To Email: {{reply_to}}
 *    Subject : Got your message, {{from_name}}!
 *    Body    :
 *      Hi {{from_name}},
 *
 *      Thank you for reaching out! Your message has been received.
 *      I'll review it and get back to you within 24 hours.
 *
 *      Here's what you sent:
 *      ———————————————
 *      {{message}}
 *      ———————————————
 *
 *      Talk soon,
 *      Hariharan T S
 *      AI/ML Engineer & Software Developer
 *      hari04022005@gmail.com
 *    → Copy the Template ID → paste as TEMPLATE_AUTOREPLY below
 *
 * 5. Dashboard → Account → Public Key → paste as PUBLIC_KEY below
 */
const EMAILJS_CONFIG = {
    PUBLIC_KEY:            '9J7lth3GpRAkt9tQ1',        // ← paste here
    SERVICE_ID:            'service_9zw3f9o',         // ← paste here
    TEMPLATE_NOTIFICATION: 'template_qaayz3o', // ← paste here
    TEMPLATE_AUTOREPLY:    'template_spx35ym',    // ← paste here
};

/* ===== SMART CONTACT FORM ===== */
(function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    /* Initialise EmailJS with public key */
    if (window.emailjs) {
        emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
    }

    let contactMethod = 'email'; // 'email' or 'whatsapp'

    const methodBtns = document.querySelectorAll('.method-btn');
    const emailGroup = document.getElementById('email-group');
    const phoneGroup = document.getElementById('phone-group');
    const subjectGroup = document.getElementById('subject-group');

    /* Method toggle */
    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            contactMethod = btn.dataset.method;

            if (contactMethod === 'email') {
                emailGroup.style.display = '';
                phoneGroup.style.display = 'none';
                subjectGroup.style.display = '';
            } else {
                emailGroup.style.display = 'none';
                phoneGroup.style.display = '';
                subjectGroup.style.display = 'none';
            }
            clearErrors();
        });
    });

    /* Validation helpers */
    function showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const error = document.getElementById(fieldId + '-error');
        if (input) input.classList.add('error');
        if (error) {
            error.textContent = message;
            error.classList.add('show');
        }
    }

    function clearErrors() {
        document.querySelectorAll('.field-error').forEach(el => {
            el.classList.remove('show');
            el.textContent = '';
        });
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.classList.remove('error');
        });
        const status = document.getElementById('form-status');
        if (status) {
            status.className = 'form-status';
            status.textContent = '';
        }
    }

    function setLoading(loading) {
        const btn = document.getElementById('submit-btn');
        const content = document.getElementById('btn-content');
        const loader = document.getElementById('btn-loading');
        if (!btn || !content || !loader) return;

        btn.disabled = loading;
        content.style.display = loading ? 'none' : '';
        loader.style.display = loading ? '' : 'none';
    }

    function showStatus(message, type) {
        const status = document.getElementById('form-status');
        if (!status) return;
        status.textContent = message;
        status.className = `form-status show ${type}`;
    }

    function validate() {
        clearErrors();
        let valid = true;

        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name) {
            showError('name', 'Please enter your name.');
            valid = false;
        }

        if (!message) {
            showError('message', 'Please enter a message.');
            valid = false;
        }

        if (contactMethod === 'email') {
            const email = document.getElementById('email').value.trim();
            if (!email) {
                showError('email', 'Please enter your email.');
                valid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('email', 'Please enter a valid email address.');
                valid = false;
            }
        } else {
            const phone = document.getElementById('phone').value.trim();
            if (!phone) {
                showError('phone', 'Please enter your phone number.');
                valid = false;
            } else if (!/^\+?[\d\s\-()]{7,15}$/.test(phone)) {
                showError('phone', 'Please enter a valid phone number.');
                valid = false;
            }
        }

        return valid;
    }

    /* ── Form submit ── */
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const phone   = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value.trim() || 'No subject';
        const message = document.getElementById('message').value.trim();

        /* ── WhatsApp mode ── */
        if (contactMethod === 'whatsapp') {
            const waText = encodeURIComponent(
                `Hi Hariharan! I'm ${name}.\n\n${message}\n\n— Sent via your portfolio`
            );
            window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`, '_blank');
            setLoading(false);
            showStatus('WhatsApp opened!', 'success');
            Toast.show('WhatsApp chat opened!', 'success');
            form.reset();
            return;
        }

        /* ── Email mode via EmailJS ── */
        if (!window.emailjs) {
            showStatus('Email service unavailable. Please email directly: hari04022005@gmail.com', 'error');
            setLoading(false);
            return;
        }

        /* Shared template variables — must match EmailJS template placeholders exactly */
        const templateParams = {
            from_name:  name,
            user_email: email,
            reply_to:   email,   // used as "To Email" in the auto-reply template
            title:      subject,
            message:    message,
        };

        try {
            /* 1️⃣  Send notification to Hariharan */
            await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_NOTIFICATION,
                templateParams
            );

            /* 2️⃣  Send auto-reply to the sender */
            await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_AUTOREPLY,
                templateParams
            );

            showStatus(
                'Message sent! Check your inbox — a confirmation has been sent to you. I\'ll reply within 24 hours.',
                'success'
            );
            Toast.show('Message delivered + confirmation sent to your email!', 'success');
            form.reset();

        } catch (err) {
            console.error('EmailJS error:', err);
            showStatus(
                'Something went wrong. Please email me directly at hari04022005@gmail.com',
                'error'
            );
            Toast.show('Send failed — please email directly.', 'error');
        } finally {
            setLoading(false);
        }
    });
})();



/* ===== BACK TO TOP ===== */
(function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ===== SMOOTH ENTRANCE ON LOAD ===== */
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => { document.body.style.opacity = '1'; }, 100);

    Toast.init();
});


/* ===== MOBILE: Tap to reveal project details ===== */
(function initProjectTapReveal() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards || !cards.length) return;

    function onCardClick(e) {
        // don't toggle when clicking links or buttons inside the card
        const tag = e.target.tagName.toLowerCase();
        if (tag === 'a' || tag === 'button' || e.target.closest('a') || e.target.closest('button')) return;

        if (window.innerWidth <= 768) {
            this.classList.toggle('expanded');
            // scroll the card into view when expanding for better UX
            if (this.classList.contains('expanded')) this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', onCardClick);
    });

    // Remove expanded states when resizing to desktop to avoid stale states
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            cards.forEach(c => c.classList.remove('expanded'));
        }
    });
})();

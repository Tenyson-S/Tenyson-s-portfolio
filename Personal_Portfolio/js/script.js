/* ============================================================
   HARIHARAN TS — PORTFOLIO JAVASCRIPT
   Features: Particles · Typewriter · ScrollReveal · Filters
   ============================================================ */

/* ===== PARTICLE CANVAS ===== */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    const chars = ['{ }', '</>', '{}', ';', '01', '( )', '=>', '&&', '||', '++', '/*', '*/'];
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(true); }
        reset(initial) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
            this.char = chars[Math.floor(Math.random() * chars.length)];
            this.size = Math.random() * 11 + 9;
            this.speed = Math.random() * 0.4 + 0.15;
            this.opacity = Math.random() * 0.18 + 0.03;
            this.drift = (Math.random() - 0.5) * 0.3;
            this.color = Math.random() > 0.5 ? '#7c3aed' : '#06b6d4';
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift;
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

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        'Software Developer',
        'AI Enthusiast',
        'Problem Solver',
        'Code & Music Lover',
        'Anime Enthusiast'
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

/* ===== NAVBAR SCROLL ===== */
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

/* ===== PROJECT FILTERS ===== */
(function initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                if (match) {
                    card.classList.remove('hidden');
                    card.classList.remove('reveal');
                    void card.offsetWidth; // reflow
                    card.classList.add('reveal');
                    setTimeout(() => card.classList.add('visible'), 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
})();

/* ===== CONTACT FORM ===== */
(function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields before sending.');
            return;
        }

        const body = `Hi Hariharan,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via portfolio contact form.`;

        const mailtoLink = `mailto:hari04022005@gmail.com`
            + `?subject=${encodeURIComponent(subject)}`
            + `&body=${encodeURIComponent(body)}`;

        const btn = document.getElementById('submit-btn');
        btn.innerHTML = '<i class="fas fa-check"></i> Opening Email Client...';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        btn.disabled = true;

        window.location.href = mailtoLink;

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.style.background = '';
            btn.disabled = false;
        }, 3500);
    });
})();

/* ===== SMOOTH ENTRANCE ON LOAD ===== */
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => { document.body.style.opacity = '1'; }, 100);
});

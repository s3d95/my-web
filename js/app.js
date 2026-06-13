// =========================================================
//  SAAD — App logic (UI, interactions, data, bootstrap)
// =========================================================
// Always land at the top of the page (don't restore prior scroll on reload).
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;

/* ---------- Preloader ---------- */
const preloader = document.getElementById('preloader');
const progressBar = document.querySelector('.loader-progress');
const percentEl = document.getElementById('loader-percent');
let progress = 0;
let sceneReady = false;

const fakeLoad = setInterval(() => {
    progress += Math.random() * 9 + 2;
    if (progress >= 90 && !sceneReady) progress = 90;     // wait for the 3D scene
    if (progress > 100) progress = 100;
    if (progressBar) progressBar.style.width = progress + '%';
    if (percentEl) percentEl.textContent = Math.floor(progress);
    if (progress >= 100) { clearInterval(fakeLoad); finishLoading(); }
}, 130);

function finishLoading() {
    if (document.body.classList.contains('loaded')) return;
    document.body.classList.add('loaded');
    // Safeguard: fully remove the preloader from the layer stack after the fade,
    // so it can never trap pointer events regardless of compositor timing.
    setTimeout(() => { if (preloader) preloader.style.display = 'none'; }, 900);
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
        });
    }, 200);
}

// Safety: never let the preloader trap the user.
setTimeout(() => { progress = 100; }, 6000);

/* ---------- Bootstrap the 3D scene (graceful fallback) ---------- */
(async () => {
    const canvas = document.getElementById('scene-canvas');
    const supportsWebGL = (() => {
        try {
            return !!window.WebGLRenderingContext &&
                !!document.createElement('canvas').getContext('webgl2');
        } catch { return false; }
    })();

    if (!canvas || !supportsWebGL) return showFallback();

    try {
        const { initScene } = await import('./scene.js');
        window.__scene = await initScene(canvas, {
            reduceMotion,
            onReady: () => {
                sceneReady = true;
                progress = Math.max(progress, 96);
                document.body.classList.add('scene-ready');
            }
        });
    } catch (err) {
        console.warn('3D scene failed to load — falling back to static emblem.', err);
        showFallback();
    }
})();

function showFallback() {
    sceneReady = true;
    document.body.classList.add('no-webgl');
    const fb = document.querySelector('.hero-fallback');
    if (fb) fb.hidden = false;
}

/* ---------- Smooth scroll (Lenis, optional) ---------- */
(async () => {
    if (reduceMotion || isTouch) return;
    try {
        const Lenis = (await import('lenis')).default;
        const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        window.__lenis = lenis;
        lenis.scrollTo(0, { immediate: true });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener('click', (e) => {
                const id = a.getAttribute('href');
                if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: -40 }); }
            });
        });
    } catch (e) { /* native scroll is fine */ }
})();

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Nav: scrolled state ---------- */
    const nav = document.getElementById('nav');
    const onNavScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();

    /* ---------- Mobile menu ---------- */
    const burger = document.getElementById('nav-burger');
    const menu = document.getElementById('mobile-menu');
    if (burger && menu) {
        const toggle = (open) => {
            burger.classList.toggle('open', open);
            menu.classList.toggle('open', open);
            burger.setAttribute('aria-expanded', open);
            menu.setAttribute('aria-hidden', !open);
            document.body.style.overflow = open ? 'hidden' : '';
        };
        burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
        menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
    }

    /* ---------- Scroll progress bar ---------- */
    const bar = document.querySelector('.scroll-progress span');
    if (bar) {
        const upd = () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
        };
        window.addEventListener('scroll', upd, { passive: true });
        upd();
    }

    /* ---------- Reveal on scroll ---------- */
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    /* ---------- Glass spotlight (mouse-follow glow) ---------- */
    document.querySelectorAll('.glass').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });

    /* ---------- 3D tilt cards ---------- */
    if (!isTouch && window.innerWidth > 900) {
        document.querySelectorAll('.tilt-3d').forEach((card) => {
            card.style.transformStyle = 'preserve-3d';
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform =
                    `perspective(900px) rotateX(${py * -8}deg) rotateY(${px * 10}deg) translateZ(6px)`;
            });
            card.addEventListener('pointerleave', () => {
                card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
            });
        });
    }

    /* ---------- Magnetic buttons ---------- */
    if (!isTouch && window.innerWidth > 900) {
        document.querySelectorAll('.magnetic').forEach((el) => {
            const wrap = el.closest('.magnetic-wrap') || el;
            wrap.addEventListener('pointermove', (e) => {
                const r = wrap.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
            });
            wrap.addEventListener('pointerleave', () => { el.style.transform = 'translate(0,0)'; });
        });
    }

    /* ---------- Terminal typewriter ---------- */
    const termBody = document.getElementById('terminal-body');
    if (termBody) {
        const lines = [
            '$ whoami',
            'saad hwareen',
            '$ cat role.txt',
            'software developer',
            '$ cat builds.txt',
            'windows apps · mobile apps · websites',
            '$ status',
            'open to work — let\'s talk.'
        ];
        let li = 0, ci = 0, lineEl = null, cursor = null;
        const type = () => {
            if (li >= lines.length) return;
            if (ci === 0) {
                lineEl = document.createElement('div');
                lineEl.className = 'term-line';
                lineEl.innerHTML = `<span class="term-prefix">~</span><span class="t"></span><span class="term-cursor"></span>`;
                termBody.appendChild(lineEl);
                cursor = lineEl.querySelector('.term-cursor');
            }
            const str = lines[li];
            const t = lineEl.querySelector('.t');
            if (ci < str.length) {
                t.textContent += str[ci++];
                setTimeout(type, Math.random() * 34 + 12);
            } else {
                if (cursor) cursor.remove();
                li++; ci = 0;
                if (li === lines.length) t.innerHTML += '<span class="term-cursor"></span>';
                else setTimeout(type, 420);
            }
        };
        const to = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { setTimeout(type, 600); to.disconnect(); }
        }, { threshold: 0.4 });
        to.observe(termBody);
    }

    /* ---------- Live GitHub repos ---------- */
    loadRepos();
});

/* ---------- GitHub repos (progressive enhancement) ---------- */
async function loadRepos() {
    const grid = document.getElementById('repos-grid');
    if (!grid) return;
    try {
        const res = await fetch('https://api.github.com/users/s3d95/repos?sort=updated&per_page=100');
        if (!res.ok) throw new Error('GitHub API ' + res.status);
        let repos = await res.json();
        if (!Array.isArray(repos) || repos.length === 0) throw new Error('no repos');

        repos = repos
            .filter((r) => !r.fork)
            .sort((a, b) => (b.stargazers_count - a.stargazers_count) ||
                (new Date(b.updated_at) - new Date(a.updated_at)))
            .slice(0, 6);

        if (repos.length === 0) throw new Error('only forks');

        grid.innerHTML = '';
        repos.forEach((r, i) => {
            const a = document.createElement('a');
            a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener';
            a.className = 'repo-card glass tilt-3d hover-target reveal' + (i % 3 ? ` delay-${i % 3}` : '');
            a.innerHTML = `
                <div class="repo-top"><i class="far fa-folder-open"></i><h3>${escapeHtml(r.name)}</h3></div>
                <p>${escapeHtml(r.description || 'No description provided.')}</p>
                <div class="repo-meta">
                    ${r.language ? `<span><span class="lang-dot"></span>${escapeHtml(r.language)}</span>` : ''}
                    <span><i class="far fa-star"></i>${r.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i>${r.forks_count}</span>
                </div>`;
            grid.appendChild(a);
        });

        // Wire up the freshly-added cards.
        const io = new IntersectionObserver((es, o) => {
            es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } });
        }, { threshold: 0.12 });
        grid.querySelectorAll('.reveal').forEach((el) => io.observe(el));
        if (!isTouch && window.innerWidth > 900) {
            grid.querySelectorAll('.glass').forEach((card) => {
                card.addEventListener('pointermove', (e) => {
                    const rr = card.getBoundingClientRect();
                    card.style.setProperty('--mx', `${e.clientX - rr.left}px`);
                    card.style.setProperty('--my', `${e.clientY - rr.top}px`);
                });
            });
        }
    } catch (err) {
        grid.innerHTML = `
            <div class="repo-card glass reveal in" style="grid-column:1/-1;text-align:center;align-items:center;">
                <i class="fab fa-github" style="font-size:3rem;margin:0 auto .6rem;"></i>
                <h3 style="margin:0 auto;">@s3d95</h3>
                <p style="text-align:center;">A few of my public projects live here.</p>
            </div>`;
    }
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

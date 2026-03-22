// Sa3d95 Portfolio - Ultra Premium Advanced Logic

// --- 0. Elite Preloader Logic ---
const preloader = document.getElementById('preloader');
const loaderProgress = document.querySelector('.loader-progress');
let progress = 0;

const fakeLoading = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    if (loaderProgress) loaderProgress.style.width = `${progress}%`;

    if (progress === 100) {
        clearInterval(fakeLoading);
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }
            // Trigger initial scroll reveals with a slight delay for dramatic effect
            setTimeout(() => {
                document.querySelectorAll('.reveal-up').forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < window.innerHeight) el.classList.add('active');
                });
            }, 300);
        }, 500);
    }
}, 120);

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Spotlight Box Logic --- */
    document.querySelectorAll('.spotlight-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* --- 2. Magnetic Elements (Buttons & Icons) --- */
    const magneticEls = document.querySelectorAll('.magnetic');

    if (window.innerWidth > 768) {
        magneticEls.forEach((el) => {
            const wrapper = el.closest('.magnetic-wrap') || el;
            wrapper.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
            });
            wrapper.addEventListener('mouseleave', () => {
                el.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    /* --- 3. Scroll Reveal Observer --- */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    /* --- 4. Advanced Interactive Canvas Background (Web of Nodes) --- */
    const canvas = document.getElementById('interactive-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            const particleCount = (width * height) / 20000;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.baseRadius = Math.random() * 1.5 + 0.5;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.baseRadius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fill();
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
                this.draw();
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 - distance / 2400})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                if (mouse.x != null) {
                    let dx = particles[i].x - mouse.x;
                    let dy = particles[i].y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }

        initCanvas();
        animateCanvas();
        window.addEventListener('resize', initCanvas);
    }

    /* --- 5. Hover Decrypt Effect (Hacker Text) --- */
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    document.querySelectorAll('.hover-decrypt').forEach(el => {
        el.dataset.value = el.innerText;
        el.addEventListener('mouseenter', event => {
            let iterations = 0;
            const originalText = event.target.dataset.value;
            clearInterval(el.decryptInterval); 
            el.decryptInterval = setInterval(() => {
                event.target.innerText = originalText.split("")
                    .map((letter, index) => {
                        if (index < iterations || originalText[index] === ' ') return originalText[index];
                        return letters[Math.floor(Math.random() * letters.length)];
                    }).join("");
                if (iterations >= originalText.length) clearInterval(el.decryptInterval);
                iterations += 1 / 2;
            }, 30);
        });
    });

    /* --- 6. 3D Tilt Effect on Project Cards --- */
    const projectCards = document.querySelectorAll('.project-card');
    if (window.innerWidth > 768) {
        projectCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    /* --- 7. Aurora Orb Tracker --- */
    const auroraOrb = document.getElementById('aurora-orb');
    window.addEventListener('mousemove', (e) => {
        if (auroraOrb && window.innerWidth > 768) {
            auroraOrb.style.setProperty('--orb-x', `${e.clientX}px`);
            auroraOrb.style.setProperty('--orb-y', `${e.clientY}px`);
        }
    });

    /* --- 8. Mac OS Terminal Typewriter --- */
    const terminalBody = document.getElementById('terminal-body');
    if (terminalBody) {
        const terminalCommands = [
            "ssh saad@root",
            "Access Granted. Authenticated.",
            "Fetching user_profile.json...",
            "Name: Saad",
            "Capabilities loaded: [React, Node.js, UI/UX, RE]",
            "System Performance: 95% Optimized.",
            "Ready to craft dynamic solutions."
        ];
        let termCmdIndex = 0;
        let termCharIndex = 0;
        let lineDiv = null;
        let termCursor = null;

        const typeTerminalLine = () => {
            if (termCmdIndex >= terminalCommands.length) return;
            if (termCharIndex === 0) {
                lineDiv = document.createElement('div');
                lineDiv.className = 'term-line';
                lineDiv.innerHTML = `<span class="term-prefix">~</span><span class="term-text"></span><span class="term-cursor"></span>`;
                terminalBody.appendChild(lineDiv);
                termCursor = lineDiv.querySelector('.term-cursor');
            }
            const currentStr = terminalCommands[termCmdIndex];
            const textEl = lineDiv.querySelector('.term-text');
            if (termCharIndex < currentStr.length) {
                textEl.textContent += currentStr[termCharIndex];
                termCharIndex++;
                setTimeout(typeTerminalLine, Math.random() * 40 + 10);
            } else {
                if (termCursor) termCursor.remove();
                termCmdIndex++;
                termCharIndex = 0;
                if (termCmdIndex === terminalCommands.length) {
                    textEl.innerHTML += `<span class="term-cursor"></span>`;
                } else {
                    setTimeout(typeTerminalLine, 500);
                }
            }
        };

        const termObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(typeTerminalLine, 800);
                termObserver.disconnect();
            }
        }, { threshold: 0.5 });
        termObserver.observe(terminalBody);
    }

});

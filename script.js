// Global variables
let scene, camera, renderer, particles;
let mouse = { x: 0, y: 0 };
let windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let currentSection = 0;
const sections = ['intro', 'about', 'skills', 'contact'];
let isLoading = true;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initThreeJS();
    initNavigation();
    // initCursor(); // Disabled custom cursor
    initAnimations();
    
    // Start loading sequence
    setTimeout(() => {
        hideLoader();
        showSection(0);
    }, 1000);
});

// Loading Screen
function initLoader() {
    const loader = document.getElementById('loading-screen');
    const progress = document.querySelector('.loader-progress');
    
    // Simulate loading progress
    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 15;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
        }
    }, 100);
}

function hideLoader() {
    const loader = document.getElementById('loading-screen');
    loader.classList.add('hidden');
    isLoading = false;
    
    // Start animations after loader is hidden
    setTimeout(() => {
        animateTitle();
    }, 500);
}

// Three.js Setup
function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('webgl-canvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create particle system
    createParticles();
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Handle mouse movement
    document.addEventListener('mousemove', onMouseMove);
}

function createParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Position
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = (Math.random() - 0.5) * 1000;
        
        // Color (white with varying opacity)
        colors[i] = 1;
        colors[i + 1] = 1;
        colors[i + 2] = 1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}



function animate() {
    requestAnimationFrame(animate);
    
    if (!isLoading) {
        // Rotate particles
        if (particles) {
            particles.rotation.x += 0.0005;
            particles.rotation.y += 0.001;
        }
        

        
        // Mouse interaction - improved responsiveness
        camera.position.x += (mouse.x - camera.position.x) * 0.15;
        camera.position.y += (-mouse.y - camera.position.y) * 0.15;
        camera.lookAt(scene.position);
    }
    
    renderer.render(scene, camera);
}

function onMouseMove(event) {
    mouse.x = (event.clientX - windowHalf.x) * 0.3;
    mouse.y = (event.clientY - windowHalf.y) * 0.3;
}

function onWindowResize() {
    windowHalf.x = window.innerWidth / 2;
    windowHalf.y = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showSection(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && currentSection > 0) {
            showSection(currentSection - 1);
        } else if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
            showSection(currentSection + 1);
        }
    });
    
    // Mouse wheel navigation
    let isScrolling = false;
    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        isScrolling = true;
        setTimeout(() => isScrolling = false, 1000);
        
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            showSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            showSection(currentSection - 1);
        }
    });
}

function showSection(index) {
    if (index === currentSection) return;
    
    // Hide current section
    const currentSectionEl = document.getElementById(sections[currentSection]);
    if (currentSectionEl) {
        currentSectionEl.classList.remove('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // Show new section
    setTimeout(() => {
        currentSection = index;
        const newSectionEl = document.getElementById(sections[currentSection]);
        if (newSectionEl) {
            newSectionEl.classList.add('active');
        }
        
        // Update progress indicator
        updateProgress();
        
        // Trigger section-specific animations
        triggerSectionAnimations(currentSection);
    }, 400);
}

function updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const progress = ((currentSection + 1) / sections.length) * 100;
        progressBar.style.height = progress + '%';
    }
}

// Custom Cursor
function initCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('.nav-item, .social-link');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Animations
function initAnimations() {
    // GSAP animations setup (TextPlugin not needed for current animations)
    // gsap.registerPlugin(TextPlugin);
}

function animateTitle() {
    const titleLines = document.querySelectorAll('.title-line');
    
    gsap.fromTo(titleLines, 
        { 
            y: 100, 
            opacity: 0 
        },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            stagger: 0.2, 
            ease: "power3.out" 
        }
    );
    
    // Animate subtitle
    gsap.fromTo('.subtitle', 
        { 
            y: 50, 
            opacity: 0 
        },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            delay: 0.8, 
            ease: "power2.out" 
        }
    );
    
    // Animate description
    gsap.fromTo('.intro-description', 
        { 
            y: 30, 
            opacity: 0 
        },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            delay: 1.2, 
            ease: "power2.out" 
        }
    );
}

function triggerSectionAnimations(sectionIndex) {
    const section = document.getElementById(sections[sectionIndex]);
    if (!section) return;
    
    switch(sectionIndex) {
        case 0: // Intro
            animateTitle();
            break;
            
        case 1: // About
            animateAboutSection();
            break;
            
        case 2: // Skills
            animateSkillsSection();
            break;
            
        case 3: // Contact
            animateContactSection();
            break;
    }
}

function animateAboutSection() {
    const title = document.querySelector('#about .section-title');
    const textElements = document.querySelectorAll('#about .about-text p');
    const statItems = document.querySelectorAll('#about .stat-item');
    
    gsap.fromTo(title, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );
    
    gsap.fromTo(textElements, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, delay: 0.3, ease: "power2.out" }
    );
    
    gsap.fromTo(statItems, 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.6, ease: "back.out(1.7)" }
    );
    
    // Animate stat numbers
    statItems.forEach(item => {
        const number = item.querySelector('.stat-number');
        const finalValue = parseInt(number.getAttribute('data-target'));
        gsap.fromTo(number, 
            { textContent: 0 },
            { 
                textContent: finalValue, 
                duration: 2, 
                delay: 1,
                ease: "power2.out",
                snap: { textContent: 1 },
                onUpdate: function() {
                    number.textContent = Math.ceil(number.textContent);
                }
            }
        );
    });
}

function animateSkillsSection() {
    const title = document.querySelector('#skills .section-title');
    const skillCategories = document.querySelectorAll('#skills .skill-category');
    
    gsap.fromTo(title, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );
    
    gsap.fromTo(skillCategories, 
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, delay: 0.3, ease: "power2.out" }
    );
    
    // Animate skill icons
    skillCategories.forEach((category, categoryIndex) => {
        const skillIcons = category.querySelectorAll('.skill-icon');
        gsap.fromTo(skillIcons, 
            { y: 30, opacity: 0, scale: 0.8 },
            { 
                y: 0, 
                opacity: 1, 
                scale: 1,
                duration: 0.6, 
                stagger: 0.1, 
                delay: 0.6 + (categoryIndex * 0.2), 
                ease: "back.out(1.7)" 
            }
        );
        
        // Add floating animation to icons
        skillIcons.forEach((icon, iconIndex) => {
            gsap.to(icon, {
                y: -5,
                duration: 2 + (iconIndex * 0.2),
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: 1 + (categoryIndex * 0.3) + (iconIndex * 0.1)
            });
        });
    });
}



function animateContactSection() {
    const title = document.querySelector('#contact .section-title');
    const subtitle = document.querySelector('#contact .contact-subtitle');
    const description = document.querySelector('#contact .contact-description');
    const socialIcons = document.querySelectorAll('#contact .social-icon');
    const emailSection = document.querySelector('#contact .email-section');
    
    gsap.fromTo(title, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );
    
    gsap.fromTo(subtitle, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
    );
    
    gsap.fromTo(description, 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: "power2.out" }
    );
    
    gsap.fromTo(socialIcons, 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.6, ease: "back.out(1.7)" }
    );
    
    gsap.fromTo(emailSection, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 1, ease: "power2.out" }
    );
    
    // Add floating animation to social icons
    socialIcons.forEach((icon, index) => {
        gsap.to(icon, {
            y: -10,
            duration: 2 + (index * 0.2),
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: 1.5 + (index * 0.1)
        });
    });
}

// Utility functions
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

// Performance optimization
function optimizePerformance() {
    // Reduce particle count on mobile
    if (window.innerWidth < 768 && particles && particles.geometry) {
        const positions = particles.geometry.attributes.position.array;
        const reducedPositions = new Float32Array(positions.length / 2);
        
        for (let i = 0; i < reducedPositions.length; i++) {
            reducedPositions[i] = positions[i * 2];
        }
        
        particles.geometry.setAttribute('position', new THREE.BufferAttribute(reducedPositions, 3));
    }
}

// Initialize performance optimizations
window.addEventListener('load', optimizePerformance);
window.addEventListener('resize', optimizePerformance);

// Preload assets
function preloadAssets() {
    // Preload any additional assets here
    return Promise.resolve();
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.dispose();
    }
});

// Copy email functionality
document.addEventListener('DOMContentLoaded', function() {
    const copyBtn = document.querySelector('.copy-btn');
    const emailInput = document.querySelector('.email-input');
    
    if (copyBtn && emailInput) {
        copyBtn.addEventListener('click', function() {
            emailInput.select();
            emailInput.setSelectionRange(0, 99999); // For mobile devices
            
            try {
                document.execCommand('copy');
                
                // Visual feedback
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.style.background = 'rgba(34, 197, 94, 0.8)';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.background = 'rgba(99, 102, 241, 0.8)';
                }, 2000);
                
            } catch (err) {
                console.error('Failed to copy email: ', err);
            }
        });
    }
});

// Cleanup on page unload - dispose of Three.js resources
window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.dispose();
    }
    if (particles) {
        if (particles.geometry) particles.geometry.dispose();
        if (particles.material) particles.material.dispose();
    }
});
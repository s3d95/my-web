// Enhanced Portfolio Website JavaScript
// Author: Saad Hwareen
// Version: 2.0

class PortfolioWebsite {
    constructor() {
        this.isLoading = true;
        this.isMobileMenuOpen = false;
        this.currentSection = 'home';
        this.scrollThreshold = 100;
        this.lastScrollY = 0;
        this.ticking = false;
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeWebsite());
        } else {
            this.initializeWebsite();
        }
    }

    initializeWebsite() {
        try {
            this.showLoadingScreen();
            this.initializeParticles();
            this.initializeAnimations();
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.setupPerformanceOptimizations();
            this.hideLoadingScreen();
            this.updateMetaDescription();
            
            console.log('Portfolio website initialized successfully');
        } catch (error) {
            console.error('Error initializing website:', error);
            this.hideLoadingScreen(); // Ensure loading screen is hidden even on error
        }
    }

    // Loading Screen Management
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            loadingScreen.setAttribute('aria-hidden', 'false');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                loadingScreen.setAttribute('aria-hidden', 'true');
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000); // Show loading for at least 1 second
        }
    }

    // Particles.js Configuration
    initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { 
                        value: this.isMobile() ? 40 : 80, 
                        density: { enable: true, value_area: 800 } 
                    },
                    color: { value: '#6c63ff' },
                    shape: { 
                        type: 'circle', 
                        stroke: { width: 0, color: '#000000' } 
                    },
                    opacity: { 
                        value: 0.5, 
                        random: true, 
                        anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } 
                    },
                    size: { 
                        value: 3, 
                        random: true, 
                        anim: { enable: true, speed: 2, size_min: 0.1, sync: false } 
                    },
                    line_linked: { 
                        enable: true, 
                        distance: 150, 
                        color: '#6c63ff', 
                        opacity: 0.4, 
                        width: 1 
                    },
                    move: { 
                        enable: true, 
                        speed: this.isMobile() ? 0.5 : 1, 
                        direction: 'none', 
                        random: true, 
                        straight: false, 
                        out_mode: 'out', 
                        bounce: false, 
                        attract: { enable: false, rotateX: 600, rotateY: 1200 } 
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: { 
                        onhover: { enable: !this.isMobile(), mode: 'grab' }, 
                        onclick: { enable: true, mode: 'push' }, 
                        resize: true 
                    },
                    modes: { 
                        grab: { distance: 140, line_linked: { opacity: 1 } }, 
                        push: { particles_nb: 4 } 
                    }
                },
                retina_detect: true
            });
        }
    }

    // GSAP Animations
    initializeAnimations() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Hero section animations
            const heroTimeline = gsap.timeline({ delay: 1.2 });
            
            heroTimeline
                .from('.greeting', { 
                    duration: 0.8, 
                    y: 50, 
                    opacity: 0, 
                    ease: 'power3.out' 
                })
                .from('.name', { 
                    duration: 1, 
                    y: 50, 
                    opacity: 0, 
                    ease: 'power3.out' 
                }, '-=0.6')
                .from('.tagline', { 
                    duration: 0.8, 
                    y: 30, 
                    opacity: 0, 
                    ease: 'power3.out' 
                }, '-=0.4')
                .from('.hero-buttons .btn', { 
                    duration: 0.6, 
                    y: 30, 
                    opacity: 0, 
                    ease: 'power3.out', 
                    stagger: 0.2 
                }, '-=0.2')
                .from('.avatar-container', { 
                    duration: 1.2, 
                    scale: 0.8, 
                    opacity: 0, 
                    ease: 'back.out(1.7)' 
                }, '-=0.8');

            // Scroll-triggered animations for sections
            this.setupScrollAnimations();

            // Floating animation for skill icons
            this.setupSkillIconAnimations();
        }
    }

    setupScrollAnimations() {
        gsap.utils.toArray('section').forEach(section => {
            const sectionTitle = section.querySelector('.section-title');
            if (sectionTitle) {
                gsap.from(sectionTitle, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }

            const sectionContent = section.querySelectorAll('.about-text, .skills-content, .contact-info, .skill-category, .projects-content');
            if (sectionContent.length > 0) {
                gsap.from(sectionContent, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 75%',
                        toggleActions: 'play none none none'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.out'
                });
            }
        });

        // Animate project cards
        gsap.utils.toArray('.project-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });

        // Animate achievement items
        gsap.utils.toArray('.achievement-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                x: index % 2 === 0 ? -50 : 50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.2,
                ease: 'power3.out'
            });
        });

        // Animate stats counter
        this.setupStatsCounter();
    }

    setupSkillIconAnimations() {
        const skillIcons = document.querySelectorAll('.skill-icon');
        skillIcons.forEach((icon, index) => {
            gsap.fromTo(icon,
                { y: 0 },
                {
                    y: -10,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    delay: index * 0.15
                }
            );
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Mobile menu toggle
        this.setupMobileMenu();
        
        // Smooth scrolling for navigation links
        this.setupSmoothScrolling();
        
        // Copy email functionality
        this.setupEmailCopy();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Window resize handler
        this.setupResizeHandler();
        
        // Scroll handler for header
        this.setupScrollHandler();
        
        // Scroll to top button
        this.setupScrollToTopButton();
    }

    setupMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav-menu');

        if (mobileMenuToggle && nav) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Close menu when clicking on nav background
            nav.addEventListener('click', (e) => {
                if (e.target === nav && this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });

            // Close menu when clicking nav links
            nav.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (this.isMobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                });
            });

            // Close menu with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav-menu');

        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav-menu');

        if (mobileMenuToggle && nav) {
            nav.classList.add('active');
            mobileMenuToggle.classList.add('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            this.isMobileMenuOpen = true;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav-menu');

        if (mobileMenuToggle && nav) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            this.isMobileMenuOpen = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerOffset = document.querySelector('header')?.offsetHeight || 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update active nav link
                    this.updateActiveNavLink(targetId.substring(1));
                }
            });
        });
    }

    setupEmailCopy() {
        const copyEmailBtn = document.getElementById('copyEmailBtn');
        if (copyEmailBtn) {
            const buttonSpan = copyEmailBtn.querySelector('span');
            const originalButtonText = buttonSpan ? buttonSpan.textContent : 'Copy';

            copyEmailBtn.addEventListener('click', async () => {
                const emailInput = document.getElementById('emailCopy');
                if (emailInput) {
                    try {
                        await navigator.clipboard.writeText(emailInput.value);
                        this.showCopyFeedback(copyEmailBtn, buttonSpan, originalButtonText);
                    } catch (err) {
                        console.error('Failed to copy email: ', err);
                        // Fallback for older browsers
                        this.fallbackCopyTextToClipboard(emailInput.value, copyEmailBtn, buttonSpan, originalButtonText);
                    }
                }
            });
        }
    }

    showCopyFeedback(button, span, originalText) {
        const copiedMessage = button.getAttribute('data-copied') || 'Copied!';
        
        if (span) {
            span.textContent = copiedMessage;
        } else {
            const iconElement = button.querySelector('i');
            if (iconElement) {
                button.innerHTML = iconElement.outerHTML + ' ' + copiedMessage;
            } else {
                button.textContent = copiedMessage;
            }
        }

        // Add success class for styling
        button.classList.add('copy-success');

        setTimeout(() => {
            if (span) {
                span.textContent = originalText;
            } else {
                const iconElement = button.querySelector('i');
                if (iconElement) {
                    button.innerHTML = iconElement.outerHTML + ' ' + originalText;
                } else {
                    button.textContent = originalText;
                }
            }
            button.classList.remove('copy-success');
        }, 2000);
    }

    fallbackCopyTextToClipboard(text, button, span, originalText) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showCopyFeedback(button, span, originalText);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    setupKeyboardNavigation() {
        // Tab navigation for skill icons
        document.querySelectorAll('.skill-icon').forEach(icon => {
            icon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    icon.click();
                }
            });
        });

        // Social links keyboard navigation
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    window.open(link.href, '_blank', 'noopener,noreferrer');
                }
            });
        });
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Close mobile menu if window is resized to desktop view
                if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }

                // Refresh ScrollTrigger on resize
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }

                // Update particles count based on screen size
                this.updateParticlesForScreenSize();
            }, 250);
        });
    }

    setupScrollHandler() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        const header = document.querySelector('header');

        // Header background opacity based on scroll
        if (header) {
            const opacity = Math.min(currentScrollY / 100, 0.95);
            header.style.background = `rgba(15, 15, 26, ${opacity})`;
        }

        // Update current section
        this.updateCurrentSection();

        this.lastScrollY = currentScrollY;
    }

    // Intersection Observer for section detection
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNavLink(sectionId);
                }
            });
        }, options);

        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveNavLink(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
        this.currentSection = sectionId;
    }

    updateCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.updateActiveNavLink(section.id);
            }
        });
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup service worker if available
        this.setupServiceWorker();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    preloadCriticalResources() {
        const criticalResources = [
            'saad.png',
            'logo.png'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // Utility Functions
    isMobile() {
        return window.innerWidth <= 768;
    }

    updateParticlesForScreenSize() {
        if (typeof pJSDom !== 'undefined' && pJSDom[0] && pJSDom[0].pJS) {
            const particleCount = this.isMobile() ? 40 : 80;
            pJSDom[0].pJS.particles.number.value = particleCount;
            pJSDom[0].pJS.fn.particlesRefresh();
        }
    }

    updateMetaDescription() {
        const metaDescriptionTag = document.querySelector('meta[name="description"]');
        if (metaDescriptionTag) {
            metaDescriptionTag.setAttribute('content', 
                "Saad Hwareen - Experienced Full Stack Developer & Software Engineer specializing in web applications, mobile apps, and desktop systems. Expert in React, Node.js, MongoDB, and modern development tools."
            );
        }
    }

    // Stats Counter Animation
    setupStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            stat.textContent = Math.floor(current);
                        }, 16);
                        observer.unobserve(stat);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
    }

    // Scroll to Top Button
    setupScrollToTopButton() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (scrollToTopBtn) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', throttle(() => {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            }, 100));

            // Smooth scroll to top when clicked
            scrollToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Keyboard accessibility
            scrollToTopBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    // Error Handling
    handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);
        
        // Send error to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: `${context}: ${error.message}`,
                fatal: false
            });
        }
    }

    // Public API
    scrollToSection(sectionId) {
        const targetElement = document.querySelector(`#${sectionId}`);
        if (targetElement) {
            const headerOffset = document.querySelector('header')?.offsetHeight || 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    getCurrentSection() {
        return this.currentSection;
    }

    refreshAnimations() {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }
}

// Initialize the website
const portfolio = new PortfolioWebsite();

// Expose portfolio instance to global scope for debugging
window.portfolio = portfolio;

// Additional utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
                'TCP Connection': perfData.connectEnd - perfData.connectStart,
                'Request': perfData.responseStart - perfData.requestStart,
                'Response': perfData.responseEnd - perfData.responseStart,
                'DOM Processing': perfData.domContentLoadedEventStart - perfData.responseEnd,
                'Total Load Time': perfData.loadEventEnd - perfData.navigationStart
            });
        }, 0);
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioWebsite;
}

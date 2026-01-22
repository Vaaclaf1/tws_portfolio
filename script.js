document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);

    /* -----------------------------------------------------------------
       SMOOTH SCROLL SETUP (LENIS)
       ----------------------------------------------------------------- */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* -----------------------------------------------------------------
       PRELOADER
       ----------------------------------------------------------------- */
    const counter = document.querySelector('.counter');
    const loaderLine = document.querySelector('.loader-line');
    const preloader = document.querySelector('.preloader');
    let count = 0;
    
    document.body.style.overflow = 'hidden';

    const updateCounter = () => {
        count++;
        counter.textContent = count + '%';
        loaderLine.style.width = count + '%';
        
        if (count < 100) {
            setTimeout(updateCounter, 20);
        } else {
            gsap.to(preloader, {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut",
                delay: 0.2,
                onComplete: () => {
                    document.body.style.overflow = '';
                    initHeroAnimations();
                }
            });
        }
    };
    updateCounter();

    /* -----------------------------------------------------------------
       CORE ANIMATIONS & UI
       ----------------------------------------------------------------- */
    
    // Hero Text Reveal
    function initHeroAnimations() {
        gsap.from(".reveal-text", {
            y: 150, 
            duration: 1.5,
            stagger: 0.1,
            ease: "power4.out"
        });
    }

    // Infinite Marquee
    gsap.to(".marquee", {
        xPercent: -50,
        repeat: -1,
        duration: 12,
        ease: "linear"
    });

    // Parallax Effect on Marquee
    gsap.to(".marquee-wrapper", {
        scrollTrigger: {
            trigger: ".marquee-wrapper",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        x: -50
    });

    /* -----------------------------------------------------------------
       NAVIGATION (MOBILE)
       ----------------------------------------------------------------- */
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.m-link');

    burger.addEventListener('click', () => {
        const isActive = burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        document.body.style.overflow = isActive ? 'hidden' : '';

        if(isActive) {
            gsap.fromTo(mobileLinks, 
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
            );
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* -----------------------------------------------------------------
       INTERACTIONS (CURSOR & HOVER)
       ----------------------------------------------------------------- */
    const cursor = document.querySelector('.cursor');
    const magnets = document.querySelectorAll('.magnet, a, button, input, .project-item');

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    window.addEventListener('mousemove', (e) => {
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
    });

    magnets.forEach(mag => {
        mag.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            gsap.to(cursor, { scale: 1.5, duration: 0.2 });
        });
        mag.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            gsap.to(cursor, { scale: 1, duration: 0.2 });
        });
    });

    // Project Gallery Hover Logic (Desktop Only)
    if (window.matchMedia("(min-width: 1024px)").matches) {
        const workItems = document.querySelectorAll('.project-item');
        const workImages = document.querySelectorAll('.p-img');

        workItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const index = item.getAttribute('data-index');
                workImages.forEach(img => img.classList.remove('active'));
                if(workImages[index]) workImages[index].classList.add('active');
            });
        });
    }

    /* -----------------------------------------------------------------
       SCROLL TRIGGER ANIMATIONS
       ----------------------------------------------------------------- */

    // Projects & Services (Batching for performance)
    const fadeUpBatch = (targets, delay = 0) => {
        ScrollTrigger.batch(targets, {
            start: "top bottom",
            onEnter: batch => gsap.fromTo(batch, 
                { opacity: 0, y: 50 }, 
                { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out", delay: delay, overwrite: true }
            ),
            onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, overwrite: true })
        });
    };

    fadeUpBatch(".project-item");
    fadeUpBatch(".service-item");
    fadeUpBatch(".input-wrap, button");

    // About Section Text Highlight
    gsap.fromTo(".highlight", 
        { color: "#333" }, 
        { 
            color: "#ccff00", 
            scrollTrigger: {
                trigger: ".big-statement",
                start: "top 70%",
                end: "top 30%",
                scrub: true
            }
        }
    );

    /* -----------------------------------------------------------------
       HERO PARALLAX & UTILS
       ----------------------------------------------------------------- */
    
    // Mouse movement parallax (Desktop)
    if (window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) {
        const heroSection = document.querySelector('.hero');
        const heroText = document.querySelector('.hero-text');

        heroSection.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth) - 0.5;
            const yPos = (e.clientY / window.innerHeight) - 0.5;

            gsap.to(heroText, {
                x: xPos * 40, 
                y: yPos * 40,
                rotationY: xPos * 10,
                rotationX: -yPos * 10,
                duration: 1, 
                ease: "power2.out"
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            gsap.to(heroText, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
        });
    }

    // Live Time Clock
    function updateTime() {
        const timeDisplay = document.getElementById('time-display');
        if(timeDisplay) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-GB', { 
                hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Prague'
            });
            timeDisplay.innerHTML = timeString.replace(':', '<span class="blink">:</span>') + ' GMT+1';
        }
    }
    setInterval(updateTime, 1000);
    updateTime();
});
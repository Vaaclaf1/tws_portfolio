document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);
    // === SMOOTH SCROLL (LENIS) ===
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Propojení Lenis a GSAP ScrollTrigger (aby animace neblbly)
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 0. PRELOADER
    const counter = document.querySelector('.counter');
    const loaderLine = document.querySelector('.loader-line');
    const preloader = document.querySelector('.preloader');
    
    let count = 0;
    
    // Zablokujeme scrollování při načítání
    document.body.style.overflow = 'hidden';

    const updateCounter = () => {
        count++;
        counter.textContent = count + '%';
        loaderLine.style.width = count + '%'; // Rozšiřování čáry
        
        if (count < 100) {
            setTimeout(updateCounter, 20); // Rychlost načítání
        } else {
            // Animace zmizení preloaderu
            gsap.to(preloader, {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut",
                delay: 0.2,
                onComplete: () => {
                    // Povolíme scrollování a spustíme animace Hero
                    document.body.style.overflow = '';
                    revealHero();
                }
            });
        }
    };
    
    updateCounter();

    // 1. HERO REVEAL (Zapouzdřeno do funkce, spouští se po preloaderu)
    function revealHero() {
        gsap.from(".reveal-text", {
            y: 150, 
            duration: 1.5,
            stagger: 0.1,
            ease: "power4.out"
        });
    }

    // 2. MARQUEE
    gsap.to(".marquee", {
        xPercent: -50,
        repeat: -1,
        duration: 12,
        ease: "linear"
    });

    // 3. BURGER MENU
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.m-link');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        if(mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            gsap.fromTo(mobileLinks, 
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
            );
        } else {
            document.body.style.overflow = '';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 4. PROJECT GALLERY (NEW LOGIC)
    const workItems = document.querySelectorAll('.project-item');
    const workImages = document.querySelectorAll('.p-img');

    if (window.matchMedia("(min-width: 1024px)").matches) {
        workItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const index = item.getAttribute('data-index');
                
                // Odebrat active class všem
                workImages.forEach(img => img.classList.remove('active'));
                
                // Přidat active class odpovídajícímu obrázku
                if(workImages[index]) {
                    workImages[index].classList.add('active');
                }
            });
        });
    }

   // 5. CUSTOM CURSOR (BULLETPROOF VERZE)
    const cursor = document.querySelector('.cursor');
    const magnets = document.querySelectorAll('.magnet, a, button, input, .project-item');

    // Nastavíme výchozí pozici a centrování
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    // Použijeme jednoduchý event listener s gsap.set = okamžitá reakce bez lagu
    window.addEventListener('mousemove', (e) => {
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
    });

    // Magnetický efekt
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
    // 6. PARALLAX
    gsap.to(".marquee-wrapper", {
        scrollTrigger: {
            trigger: ".marquee-wrapper",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        x: -50
    });
});
// ===========================================
    // FINAL FIX: OBSAH (PROJEKTY A SLUŽBY)
    // ===========================================

    // 7. PROJEKTY - OKAMŽITÁ VIDITELNOST
    // Používáme ScrollTrigger.batch, což je nejspolehlivější metoda
    ScrollTrigger.batch(".project-item", {
        start: "top bottom", // Spustí se hned, jak se dotkne spodku okna
        onEnter: batch => gsap.fromTo(batch, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out", overwrite: true }
        ),
        // Pojistka: když scrollneš zpátky nahoru a dolů, znovu se ukážou
        onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, overwrite: true })
    });

    // 8. SLUŽBY (H3 nadpisy i LI odrážky)
    // Animujeme celý blok služby najednou, aby se to nerozsypalo
    ScrollTrigger.batch(".service-item", {
        start: "top bottom",
        onEnter: batch => gsap.fromTo(batch, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power3.out", overwrite: true }
        )
    });

    // 9. FORMULÁŘ (INPUTY)
    ScrollTrigger.batch(".input-wrap, button", {
        start: "top bottom",
        onEnter: batch => gsap.fromTo(batch, 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out", overwrite: true }
        )
    });

    // 10. ABOUT TEXT (HIGHLIGT)
    // Tohle necháme, to fungovalo (změna barvy)
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
    // ===========================================
    // 13. HERO PARALLAX (TEXT SLEDUJE MYŠ)
    // ===========================================
    const heroSection = document.querySelector('.hero');
    const heroText = document.querySelector('.hero-text');

    // Pouze na desktopu (na mobilu to nedává smysl)
    if (window.matchMedia("(pointer: fine)").matches) {
        
        heroSection.addEventListener('mousemove', (e) => {
            // Vypočítáme pozici myši od středu obrazovky (-0.5 až 0.5)
            const xPos = (e.clientX / window.innerWidth) - 0.5;
            const yPos = (e.clientY / window.innerHeight) - 0.5;

            gsap.to(heroText, {
                // Jemný posun (max 40px do stran)
                x: xPos * 40, 
                y: yPos * 40,
                
                // 3D náklon (rotace)
                rotationY: xPos * 10, // Nakloní se horizontálně
                rotationX: -yPos * 10, // Nakloní se vertikálně
                
                duration: 1, // Plynulý dojezd (žádné sekání)
                ease: "power2.out"
            });
        });

        // Když myš odjede pryč, vrátíme text do středu
        heroSection.addEventListener('mouseleave', () => {
            gsap.to(heroText, {
                x: 0, 
                y: 0, 
                rotationY: 0, 
                rotationX: 0, 
                duration: 1.5, 
                ease: "elastic.out(1, 0.3)" // Efektní zhoupnutí zpět
            });
        });
    }
    // === LIVE TIME ===
    function updateTime() {
        const timeDisplay = document.getElementById('time-display');
        if(timeDisplay) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZone: 'Europe/Prague'
            });
            // Přidáme animovanou dvojtečku (nahradíme statickou)
            timeDisplay.innerHTML = timeString.replace(':', '<span class="blink">:</span>') + ' GMT+1';
        }
    }
    setInterval(updateTime, 1000);
    updateTime(); // Spustit hned
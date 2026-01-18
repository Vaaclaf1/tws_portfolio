document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SMOOTH SCROLLING (Lenis Library Implementation)
    // Provides momentum-based scrolling for modern feel
    const lenis = new Lenis({ 
        duration: 1.2, 
        smooth: true,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    function raf(time) { 
        lenis.raf(time); 
        requestAnimationFrame(raf); 
    }
    requestAnimationFrame(raf);

    // 2. LOADING SCREEN LOGIC
    // Simulates system initialization with a counter
    const preloader = document.getElementById('preloader');
    const counter = document.querySelector('.counter');
    let count = 0;
    
    if (preloader && counter) {
        const interval = setInterval(() => {
            count += Math.floor(Math.random() * 10) + 5; // Random increment
            if (count > 100) count = 100;
            counter.textContent = count + "%";
            
            if (count === 100) {
                clearInterval(interval);
                preloader.classList.add('hidden'); // Fade out CSS class
                setTimeout(() => preloader.style.display = 'none', 600); // Remove from DOM
            }
        }, 30);
    }

    // 3. NAVIGATION (Hamburger & Overlay)
    const hamburger = document.getElementById('hamburger');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuItems = document.querySelectorAll('.menu-item');

    if (hamburger && menuOverlay) {
        // Toggle menu state
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menuOverlay.classList.toggle('open');
        });

        // Close menu when a link is clicked
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                menuOverlay.classList.remove('open');
            });
        });
    }

    // 4. CUSTOM CURSOR LOGIC
    // Replaces default system cursor with a div element
    const cursor = document.getElementById('customCursor');
    // Elements that trigger cursor hover effect
    const hoverElements = document.querySelectorAll('a, button, input, textarea, .menu-item, .logo, .hamburger, .archive-block');

    if (cursor) {
        // Follow mouse movement
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add 'grow' class on hover states
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
        });
    }
});
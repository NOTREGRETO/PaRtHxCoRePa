// Cool Custom Cursor with Trail Effect - Works on Mobile & PC

(function() {
    // Detect if mobile
    const isMobile = window.innerWidth <= 768;
    const trailCount = isMobile ? 5 : 8; // Fewer trails on mobile for performance

    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Create cursor trails
    const trails = [];
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0
        });
    }

    // Cursor position with velocity for smoother movement
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let velocityX = 0;
    let velocityY = 0;

    // Update mouse position (desktop) with throttling for performance
    let lastMoveTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMoveTime > 10) { // Throttle to ~100fps
            mouseX = e.clientX;
            mouseY = e.clientY;
            lastMoveTime = now;
        }
    }, { passive: true });

    // Update touch position (mobile)
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    // Touch start (mobile)
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            cursor.style.opacity = '1';
        }
    }, { passive: true });

    // Ultra-smooth cursor animation with easing
    function animateCursor() {
        // Calculate velocity for smoother movement
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        // Smooth easing with velocity
        velocityX += dx * 0.08;
        velocityY += dy * 0.08;
        
        // Apply friction
        velocityX *= 0.85;
        velocityY *= 0.85;
        
        // Update position
        cursorX += velocityX;
        cursorY += velocityY;

        // Use transform for better performance (GPU accelerated)
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        // Update trails with staggered delay for smooth effect
        trails.forEach((trail, index) => {
            const delay = (index + 1) * 0.08;
            const ease = 0.12 - delay;
            
            trail.x += (cursorX - trail.x) * ease;
            trail.y += (cursorY - trail.y) * ease;
            
            // Use transform for better performance
            trail.element.style.transform = `translate(${trail.x}px, ${trail.y}px)`;
            trail.element.style.opacity = (1 - (index / trailCount)) * 0.7;
        });

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects on clickable elements
    const clickableElements = document.querySelectorAll('a, button, .btn, input, textarea, select, [onclick]');
    
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Click effect (desktop)
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
        createRipple(mouseX, mouseY);
        if (!isMobile) createParticles(mouseX, mouseY); // Particles only on desktop
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });

    // Touch effect (mobile)
    document.addEventListener('touchstart', (e) => {
        cursor.classList.add('click');
        if (e.touches.length > 0) {
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;
            createRipple(x, y);
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        cursor.classList.remove('click');
    }, { passive: true });

    // Create ripple effect on click
    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = (x - 10) + 'px';
        ripple.style.top = (y - 10) + 'px';
        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Create particles on click
    function createParticles(x, y) {
        const particleCount = 6;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'cursor-particle';
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 30 + Math.random() * 20;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    }

    // Text selection cursor
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li');
    
    textElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('text');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('text');
        });
    });

    // Hide cursor when leaving window (desktop)
    document.addEventListener('mouseleave', () => {
        if (!isMobile) {
            cursor.style.opacity = '0';
            trails.forEach(trail => {
                trail.element.style.opacity = '0';
            });
        }
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

    // Hide cursor when touch ends (mobile)
    let touchTimeout;
    document.addEventListener('touchend', () => {
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            cursor.style.opacity = '0';
            trails.forEach(trail => {
                trail.element.style.opacity = '0';
            });
        }, 1000); // Hide after 1 second of no touch
    }, { passive: true });

    // Magnetic effect on special elements
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .logo');
    
    magneticElements.forEach(element => {
        element.classList.add('magnetic-element');
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });

    // Loading cursor on async operations
    window.addEventListener('beforeunload', () => {
        cursor.classList.add('loading');
    });

    console.log('✨ Cool custom cursor loaded!');
})();

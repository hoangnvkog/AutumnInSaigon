/**
 * EM LÀ MÙA THU CỦA ANH
 * Main JavaScript - all interactions, animations, and features
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initCustomCursor();
    initAudioControls();
    initSmoothScroll();
    initNavigationDots();
    initHeroCanvas();
    initTimelineAnimations();
    initLetterSection();
    initNightSky();
    initFinalSection();
    initPolaroidFeature();
    initEasterEggs();
    initKonamiCode();
});

/* ========== LOADING SCREEN ========== */
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    
    const letters = document.querySelectorAll('.loading-letter');
    letters.forEach((letter, index) => {
        letter.style.animationDelay = `${index * 0.05}s`;
    });

    // Fallback timeout - hide after 3 seconds max
    const hideLoading = () => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => { loadingScreen.style.display = 'none'; }, 1000);
    };

    // Set timeout as primary - 3 seconds max
    setTimeout(hideLoading, 3000);
}

/* ========== CUSTOM CURSOR ========== */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .timeline-card, .star, .tree-leaf, .polaroid-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

/* ========== AUDIO CONTROLS (YouTube) ========== */

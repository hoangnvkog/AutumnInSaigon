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

/* ========== AUDIO CONTROLS ========== */
function initAudioControls() {
    const audio = document.getElementById('bg-music');
    const btn = document.getElementById('audio-btn');
    const controls = document.getElementById('audio-controls');
    if (!audio || !btn) return;

    let isPlaying = false;

    btn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            btn.classList.remove('playing');
            controls.classList.remove('playing');
            btn.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            audio.play().catch(() => {});
            btn.classList.add('playing');
            controls.classList.add('playing');
            btn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });

    // Try autoplay (muted first for browser policy)
    audio.volume = 0.5;
    audio.muted = true;
    audio.play().then(() => {
        audio.muted = false;
        btn.classList.add('playing');
        controls.classList.add('playing');
        isPlaying = true;
    }).catch(() => {});
}
/* ========== SMOOTH SCROLL ========== */
function initSmoothScroll() {
    // Lenis smooth scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // GSAP ScrollTrigger integration
        if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
            gsap.registerPlugin(ScrollTrigger);
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => { lenis.raf(time * 1000); });
            gsap.ticker.lagSmoothing(0);
        }
    }
}

/* ========== NAVIGATION DOTS ========== */
function initNavigationDots() {
    const dots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('section');

    // Click to scroll
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(dot.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Active dot on scroll
    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    dots.forEach(dot => dot.classList.remove('active'));
                    const id = entry.target.id;
                    const activeDot = document.querySelector(`.nav-dot[href="#${id}"]`);
                    if (activeDot) activeDot.classList.add('active');
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    }
}

/* ========== HERO CANVAS (Particles) ========== */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            color: ['#F5E6CA', '#D97706', '#B45309', '#7C2D12'][Math.floor(Math.random() * 4)]
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
        animationId = requestAnimationFrame(animate);
    }
    animate();
}

/* ========== TIMELINE ANIMATIONS ========== */
function initTimelineAnimations() {
    const items = document.querySelectorAll('.timeline-item');
    
    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

        items.forEach(item => observer.observe(item));
    } else {
        items.forEach(item => item.classList.add('visible'));
    }
}

/* ========== LETTER SECTION ========== */
function initLetterSection() {
    const envelope = document.getElementById('envelope-front');
    const paper = document.getElementById('letter-paper');
    const dateEl = document.getElementById('letter-date');
    
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    if (envelope && paper) {
        envelope.addEventListener('click', () => {
            envelope.classList.add('open');
            setTimeout(() => {
                paper.classList.add('open');
                // Reveal paragraphs with delay
                setTimeout(() => {
                    document.querySelectorAll('.letter-paragraph').forEach((p, i) => {
                        setTimeout(() => p.classList.add('visible'), i * 200);
                    });
                    // Reveal closing
                    setTimeout(() => {
                        const closing = document.querySelector('.letter-closing');
                        if (closing) closing.classList.add('visible');
                    }, 800);
                }, 500);
            }, 300);
        });
    }
}

/* ========== NIGHT SKY (Stars) ========== */
function initNightSky() {
    const container = document.getElementById('stars-container');
    if (!container) return;

    const starData = [
        { emoji: '⭐', quote: 'Em là ánh sao đầu tiên anh nhìn thấy trong đêm', author: 'Anh' },
        { emoji: '✨', quote: 'Mỗi lần nhìn sao, anh lại nghĩ về em', author: 'Anh' },
        { emoji: '🌟', quote: 'Trong vũ trụ bao la, anh may mắn gặp được em', author: 'Anh' },
        { emoji: '💫', quote: 'Em là điều ước mà anh không dám nói ra', author: 'Anh' },
        { emoji: '🌠', quote: 'Mỗi lần sao băng rơi, anh lại ước một điều giống nhau: được ở bên em', author: 'Anh' },
        { emoji: '⭐', quote: 'Dù đêm có tối đến đâu, em vẫn là ngôi sao sáng nhất', author: 'Anh' },
        { emoji: '✨', quote: 'Anh sẽ là bầu trời đêm, để em luôn là ngôi sao trên đỉnh cao nhất', author: 'Anh' },
        { emoji: '🌟', quote: 'Không cần đèn đường, chỉ cần nụ cười của em là đủ sáng cả đêm', author: 'Anh' }
    ];

    // Create stars
    starData.forEach((data, index) => {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = data.emoji;
        star.style.left = `${10 + (index % 4) * 22 + Math.random() * 10}%`;
        star.style.top = `${15 + Math.floor(index / 4) * 40 + Math.random() * 20}%`;
        star.style.animationDelay = `${index * 0.5}s`;
        
        star.addEventListener('click', () => showStarTooltip(data, star));
        container.appendChild(star);
    });

    function showStarTooltip(data, starEl) {
        const tooltip = document.getElementById('star-tooltip');
        if (!tooltip) return;

        starEl.classList.add('clicked');
        setTimeout(() => starEl.classList.remove('clicked'), 600);

        const rect = starEl.getBoundingClientRect();
        tooltip.querySelector('.tooltip-quote').textContent = '"' + data.quote + '"';
        tooltip.querySelector('.tooltip-author').textContent = '— ' + data.author;

        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - 100) + 'px';
        tooltip.classList.add('visible');

        setTimeout(() => { tooltip.classList.remove('visible'); }, 4000);
    }
}

/* ========== FINAL SECTION ========== */
function initFinalSection() {
    const mapleTree = document.getElementById('maple-tree');
    if (!mapleTree) return;

    const leaves = [
        { text: 'Em', x: 40, y: 10 },
        { text: '18/04', x: 65, y: 25 },
        { text: 'Ấm áp', x: 20, y: 35 },
        { text: 'Dịu dàng', x: 50, y: 45 },
        { text: 'Bình yên', x: 75, y: 55 },
        { text: 'Nhà', x: 35, y: 65 },
        { text: 'Mùa thu', x: 60, y: 75 },
        { text: 'Yêu', x: 25, y: 85 },
        { text: 'Mãi mãi', x: 70, y: 90 }
    ];

    leaves.forEach((leaf, i) => {
        const el = document.createElement('div');
        el.className = 'tree-leaf';
        el.textContent = leaf.text;
        el.style.left = leaf.x + '%';
        el.style.top = leaf.y + '%';
        el.style.animationDelay = (i * 0.3) + 's';
        mapleTree.appendChild(el);
    });

    // Falling leaves animation
    const fallContainer = document.getElementById('final-falling-leaves');
    if (fallContainer) {
        for (let i = 0; i < 20; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'fall-leaf';
            leaf.textContent = ['🍂', '🍁'][Math.floor(Math.random() * 2)];
            leaf.style.left = Math.random() * 100 + '%';
            leaf.style.animationDuration = (8 + Math.random() * 6) + 's';
            leaf.style.animationDelay = Math.random() * 5 + 's';
            leaf.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
            fallContainer.appendChild(leaf);
        }
    }

    // Quote reveal
    const quoteText = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');
    const finalActions = document.querySelector('.final-actions');

    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (quoteText) quoteText.classList.add('visible');
                    if (quoteAuthor) quoteAuthor.classList.add('visible');
                    if (finalActions) finalActions.classList.add('visible');
                }
            });
        }, { threshold: 0.3 });

        if (quoteText) observer.observe(quoteText);
    }
}

/* ========== POLAROID FEATURE ========== */
function initPolaroidFeature() {
    const btn = document.getElementById('polaroid-btn');
    const overlay = document.getElementById('polaroid-overlay');
    const closeBtn = document.getElementById('polaroid-close');
    const downloadBtn = document.getElementById('download-btn');
    const canvas = document.getElementById('polaroid-canvas');
    if (!btn || !overlay || !canvas) return;

    const ctx = canvas.getContext('2d');

    // Load single photo
    const photoUrl = 'assets/photos/polaroid-main.png';
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { drawPolaroid(ctx, canvas, img); };
    img.onerror = () => {};
    img.src = photoUrl;

    btn.addEventListener('click', () => {
        if (img.complete && img.naturalWidth > 0) drawPolaroid(ctx, canvas, img);
        overlay.classList.add('open');
    });

    closeBtn.addEventListener('click', () => { overlay.classList.remove('open'); });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'mua-thu-cua-anh-' + new Date().toISOString().split('T')[0] + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

function drawPolaroid(ctx, canvas, imageObj) {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#F5E6CA';
    ctx.fillRect(0, 0, w, h);

    // Frame
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, w - 40, h - 120);

    // Image area
    const imgX = 35, imgY = 35, imgW = w - 70, imgH = h - 170;

    // Draw photo if available
    if (imageObj && imageObj.complete) {
        ctx.drawImage(imageObj, imgX, imgY, imgW, imgH);
        // Add vintage overlay
        ctx.fillStyle = 'rgba(180, 140, 90, 0.2)';
        ctx.fillRect(imgX, imgY, imgW, imgH);
        // Add slight border effect
        ctx.strokeStyle = 'rgba(139, 90, 43, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(imgX, imgY, imgW, imgH);
    } else {
        // Fallback gradient if no image
        const grd = ctx.createLinearGradient(0, imgY, 0, imgY + imgH);
        grd.addColorStop(0, '#F5E6CA');
        grd.addColorStop(0.5, '#EBC8A2');
        grd.addColorStop(1, '#A0522D');
        ctx.fillStyle = grd;
        ctx.fillRect(imgX, imgY, imgW, imgH);
    }

    // Text
    ctx.fillStyle = '#7C2D12';
    ctx.font = 'bold 20px "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    ctx.fillText('Em là mùa thu của anh', w / 2, h - 85);

    ctx.fillStyle = '#B45309';
    ctx.font = '13px "Dancing Script", cursive';
    ctx.fillText('"Dù bốn mùa có đổi thay,', w / 2, h - 58);
    ctx.fillText('anh vẫn muốn dừng lại', w / 2, h - 42);
    ctx.fillText('ở mùa thu mang tên em."', w / 2, h - 26);
    ctx.font = '11px "Dancing Script", cursive';
    ctx.fillText('— Sunset', w / 2, h - 12);

    // Date
    ctx.fillStyle = '#2B2B2B';
    ctx.font = '11px "Quicksand", sans-serif';
    const now = new Date();
    ctx.fillText(now.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }), w / 2, h - 135);

    // Decorative leaves
    ['🍂', '🍁'].forEach((leaf, i) => {
        ctx.font = '28px serif';
        ctx.fillText(leaf, 55 + i * (w - 110), h - 105);
    });
}

/* ========== EASTER EGGS ========== */
function initEasterEggs() {
    // Type name animation - typing "em" triggers heart rain
    let typed = '';
    const targetName = 'em';
    
    document.addEventListener('keydown', (e) => {
        typed += e.key.toLowerCase();
        if (typed.length > 10) typed = typed.slice(-10);
        
        if (typed.includes(targetName)) {
            triggerHeartRain();
            typed = '';
        }
    });
}

function triggerHeartRain() {
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '-30px';
        heart.style.fontSize = (1 + Math.random() * 2) + 'rem';
        heart.style.zIndex = '9998';
        heart.style.pointerEvents = 'none';
        heart.style.transition = 'all 3s ease-in';
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.style.transform = `translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`;
            heart.style.opacity = '0';
        }, 50);
        
        setTimeout(() => heart.remove(), 3500);
    }
}

/* ========== KONAMI CODE ========== */
function initKonamiCode() {
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konami[index]) {
            index++;
            if (index === konami.length) {
                showKonamiMessage();
                index = 0;
            }
        } else {
            index = 0;
        }
    });
}

function showKonamiMessage() {
    const msg = document.createElement('div');
    msg.textContent = 'I love you 🍂';
    msg.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); font-size:3rem; font-family:"Dancing Script",cursive; color:#F5E6CA; z-index:9999; text-shadow:0 0 20px #D97706; animation:fadeInUp 1s ease;';
    document.body.appendChild(msg);
    
    // Add glow effect
    const glow = document.createElement('div');
    glow.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(217,119,6,0.1); z-index:9998; pointer-events:none; animation:fadeOut 2s ease forwards;';
    document.body.appendChild(glow);
    
    setTimeout(() => {
        msg.style.transition = 'opacity 1s ease';
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 1000);
        glow.remove();
    }, 3000);
}

/* ========== FALLBACK: Initialize everything if Lenis/GSAP not loaded ========== */
if (typeof Lenis === 'undefined') {
    window.Lenis = function() { this.raf = function() {}; this.on = function() {}; };
}
if (typeof gsap === 'undefined') {
    window.gsap = { registerPlugin: function() {}, ticker: { add: function() {}, lagSmoothing: function() {} } };
    window.ScrollTrigger = {};
}
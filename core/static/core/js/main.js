document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       1. PÉTALOS FLOTANDO DE FONDO
       ============================================ */
    const petalsBg = document.getElementById('petalsBg');
    const TOTAL_BG_PETALS = 18;

    for (let i = 0; i < TOTAL_BG_PETALS; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal-float' + (i % 2 === 0 ? ' magenta' : '');
        const left = Math.random() * 100;
        const duration = 10 + Math.random() * 14;
        const delay = Math.random() * -20;
        const drift = (Math.random() * 120 - 60) + 'px';
        const scale = 0.6 + Math.random() * 0.9;

        petal.style.left = left + 'vw';
        petal.style.animationDuration = duration + 's';
        petal.style.animationDelay = delay + 's';
        petal.style.setProperty('--drift', drift);
        petal.style.transform = `scale(${scale})`;

        petalsBg.appendChild(petal);
    }

    /* ============================================
       2. FLOR QUE SE FORMA CON EL SCROLL
       ============================================ */
    const flowerSection = document.getElementById('flowerSection');
    const flowerStage = document.getElementById('flowerStage');
    const flowerCenter = flowerStage.querySelector('.flower-center');
    const flowerCaption = document.getElementById('flowerCaption');

    const TOTAL_PETALS = 12; // un pétalo por mes
    const petalEls = [];

    for (let i = 0; i < TOTAL_PETALS; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        const angle = (360 / TOTAL_PETALS) * i;
        petal.dataset.angle = angle;
        flowerStage.insertBefore(petal, flowerCenter);
        petalEls.push(petal);
    }

    function clamp01(n) {
        return Math.max(0, Math.min(1, n));
    }

    // easeOutCubic para que el movimiento se sienta natural
    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function updateFlower() {
        const rect = flowerSection.getBoundingClientRect();
        const sectionHeight = flowerSection.offsetHeight - window.innerHeight;
        // progreso 0 -> 1 mientras la sección sticky pasa por la pantalla
        let progress = clamp01(-rect.top / sectionHeight);
        const eased = easeOut(progress);

        petalEls.forEach((petal) => {
            const angle = parseFloat(petal.dataset.angle);
            // cada pétalo empieza disperso y lejos, y termina formando la flor
            const scatterRadius = 260;
            const finalRadius = 6;
            const radius = scatterRadius - (scatterRadius - finalRadius) * eased;
            const scatterAngle = angle + (1 - eased) * 140; // giran mientras llegan
            const scale = 0.35 + eased * 0.65;
            const opacity = 0.15 + eased * 0.85;

            petal.style.opacity = opacity;
            petal.style.transform =
                `translate(-50%, -100%) rotate(${scatterAngle}deg) translateY(-${radius}px) scale(${scale})`;
        });

        flowerCenter.style.transform = `translate(-50%, -50%) scale(${eased})`;

        if (progress > 0.85) {
            flowerCaption.classList.add('visible');
        } else {
            flowerCaption.classList.remove('visible');
        }
    }

    /* ============================================
       3. REVELADO DEL POEMA AL HACER SCROLL
       ============================================ */
    const poemLines = document.querySelectorAll('.poem p');
    const reasons = document.querySelectorAll('.reason');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.35 });

    poemLines.forEach((line, i) => {
        line.style.transitionDelay = (i * 0.12) + 's';
        revealObserver.observe(line);
    });

    reasons.forEach((reason, i) => {
        reason.style.transitionDelay = (i * 0.08) + 's';
        revealObserver.observe(reason);
    });

    /* ============================================
       4. SCROLL LISTENER (con requestAnimationFrame)
       ============================================ */
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateFlower();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateFlower();

    /* ============================================
       5. BOTÓN "TE AMO" — LLUVIA DE PÉTALOS
       ============================================ */
    const loveBtn = document.getElementById('loveBtn');

    loveBtn.addEventListener('click', () => {
        const burstCount = 26;
        for (let i = 0; i < burstCount; i++) {
            const petal = document.createElement('div');
            const isYellow = Math.random() > 0.5;
            petal.style.position = 'fixed';
            petal.style.left = (loveBtn.getBoundingClientRect().left + loveBtn.offsetWidth / 2) + 'px';
            petal.style.top = loveBtn.getBoundingClientRect().top + 'px';
            petal.style.width = '10px';
            petal.style.height = '13px';
            petal.style.background = isYellow ? '#ffd23f' : '#f0348f';
            petal.style.borderRadius = '0 100% 0 100%';
            petal.style.pointerEvents = 'none';
            petal.style.zIndex = '999';
            petal.style.opacity = '1';
            document.body.appendChild(petal);

            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 160;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance - 60;
            const rotation = Math.random() * 360;
            const duration = 900 + Math.random() * 500;

            petal.animate([
                { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${x}px, ${y + 220}px) rotate(${rotation}deg)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(.22,.61,.36,1)',
                fill: 'forwards'
            });

            setTimeout(() => petal.remove(), duration + 50);
        }

        loveBtn.textContent = 'Te amo más ♡';
        setTimeout(() => { loveBtn.textContent = 'Te amo'; }, 2200);
    });

});
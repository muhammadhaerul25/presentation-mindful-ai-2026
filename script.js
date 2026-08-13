'use strict';

// ── State ────────────────────────────────────
let currentIndex = 0;
let isAnimating = false;

const STORAGE_KEY = 'slide-pos-index';

// ── DOM refs ─────────────────────────────────
const slides = Array.from(document.querySelectorAll('.slide'));
const totalEl = document.getElementById('totalSlides');
const currentEl = document.getElementById('currentSlide');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// ── Step state per slide ──────────────────────
const stepState = slides.map(() => 0);

function getStepCount(slideEl) {
    return parseInt(slideEl.dataset.steps || '1', 10);
}

function getStepEls(slideEl) {
    return Array.from(slideEl.querySelectorAll('.reveal-step, .grid-step'));
}

function showStep(slideEl, stepIndex) {
    slideEl.setAttribute('data-current-step', stepIndex);
    const stepEls = getStepEls(slideEl);
    if (!stepEls.length) return;
    stepEls.forEach((el, i) => {
        if (el.classList.contains('grid-step')) {
            // Cumulative steps: step 0 = nothing, step 1 = first item, etc.
            el.classList.toggle('active-step', i < stepIndex);
        } else {
            // Exclusive steps: step 0 = first item
            el.classList.toggle('active-step', i === stepIndex);
        }
    });
}

function resetSteps(slideEl) {
    const i = slides.indexOf(slideEl);
    stepState[i] = 0;
    showStep(slideEl, 0);
}

// ── Init ─────────────────────────────────────
function init() {
    totalEl.textContent = slides.length;

    const saved = parseInt(sessionStorage.getItem(STORAGE_KEY), 10);
    const startIndex = (!isNaN(saved) && saved >= 0 && saved < slides.length) ? saved : 0;

    goTo(startIndex, 'none');
    updateControls();
    attachEvents();
}

// ── Navigation ───────────────────────────────
function goTo(index, direction = 'next') {
    if (isAnimating) return;
    if (index < 0 || index >= slides.length) return;

    isAnimating = true;

    const prev = slides[currentIndex];
    const next = slides[index];

    resetSteps(next);

    slides.forEach(s => s.classList.remove('active', 'prev'));
    next.classList.add('active');
    if (direction !== 'none') prev.classList.add('prev');

    currentIndex = index;
    sessionStorage.setItem(STORAGE_KEY, index);
    updateHUD();
    updateControls();

    setTimeout(() => {
        slides.forEach(s => s.classList.remove('prev'));
        isAnimating = false;
    }, 550);
}

function nextSlide() {
    const slide = slides[currentIndex];
    const totalSteps = getStepCount(slide);
    const cur = stepState[currentIndex];

    if (cur < totalSteps - 1) {
        stepState[currentIndex]++;
        showStep(slide, stepState[currentIndex]);
        updateControls();
    } else if (currentIndex < slides.length - 1) {
        goTo(currentIndex + 1, 'next');
    }
}

function prevSlide() {
    const slide = slides[currentIndex];
    const cur = stepState[currentIndex];

    if (cur > 0) {
        stepState[currentIndex]--;
        showStep(slide, stepState[currentIndex]);
        updateControls();
    } else if (currentIndex > 0) {
        goTo(currentIndex - 1, 'prev');
    }
}

// ── HUD ──────────────────────────────────────
function updateHUD() {
    currentEl.textContent = currentIndex + 1;
    const progress = ((currentIndex + 1) / slides.length) * 100;
    progressBar.style.width = progress + '%';
    document.title = 'Mindful AI - Yayasan Khouw Kalbe';
}

function updateControls() {
    const atStart = currentIndex === 0 && stepState[currentIndex] === 0;
    const atEnd = currentIndex === slides.length - 1 &&
        stepState[currentIndex] === getStepCount(slides[currentIndex]) - 1;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
}

// ── Events ───────────────────────────────────
function attachEvents() {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('wheel', debounce(onWheel, 80), { passive: true });
}

// Handle keys
function onKeyDown(e) {
    switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            prevSlide();
            break;
        case 'Home':
            e.preventDefault();
            goTo(0, 'none');
            break;
        case 'End':
            e.preventDefault();
            goTo(slides.length - 1, 'next');
            break;
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
        case 'Escape':
            if (document.fullscreenElement) toggleFullscreen();
            break;
    }
}

function onWheel(e) {
    if (e.deltaY > 0) nextSlide();
    else prevSlide();
}

// ── Fullscreen ───────────────────────────────
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => { });
    } else {
        document.exitFullscreen();
    }
}

// ── Slide Map ─────────────────────────────────
function toggleSlideMap() {
    window.handleSlideJumpCallback = (num) => {
        if (!isNaN(num) && num >= 1 && num <= slides.length) {
            const dir = num - 1 > currentIndex ? 'next' : 'prev';
            goTo(num - 1, dir);
        }
    };
    
    if (typeof openSlideJumpModal === 'function') {
        openSlideJumpModal(slides.length);
    } else {
        const num = parseInt(prompt(`Go to slide (1–${slides.length}):`));
        window.handleSlideJumpCallback(num);
    }
}

// ── Utility ──────────────────────────────────
function debounce(fn, wait) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
}

// ── Keyboard Hint ─────────────────────────────
function hideKeyboardHint() {
    const hint = document.getElementById('keyboardHint');
    if (hint) {
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 0.4s ease';
        setTimeout(() => { if (hint) hint.remove(); }, 450);
    }
    document.removeEventListener('keydown', hideKeyboardHint);
    document.removeEventListener('wheel', hideKeyboardHint);
    document.removeEventListener('click', hideKeyboardHint);
}

document.addEventListener('keydown', hideKeyboardHint, { once: true });
document.addEventListener('wheel', hideKeyboardHint, { once: true });
document.addEventListener('click', hideKeyboardHint, { once: true });

// ── Start ─────────────────────────────────────
init();

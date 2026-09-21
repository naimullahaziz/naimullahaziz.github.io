/* ============================================================
   main.js  |  dipakai bersama oleh semua halaman
   ============================================================ */

// --- MODAL DISUNTIKKAN LEWAT JS ---
// Markup ketiga modal identik di semua halaman, jadi ditulis sekali di sini
// supaya tidak perlu disalin ke tiap file HTML.
document.body.insertAdjacentHTML('beforeend', `
    <div id="project-modal" class="modal-project" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-hidden="true">
        <div class="modal-project-content">
            <button type="button" class="close-btn" data-close="project" aria-label="Close project details">&times;</button>
            <div class="modal-header">
                <h2 id="modal-title">Project title</h2>
                <div id="modal-desc"></div>
            </div>
            <div class="modal-body">
                <div id="modal-sub-grid" class="sub-grid"></div>
            </div>
        </div>
    </div>

    <div id="gallery-modal" class="modal-gallery" role="dialog" aria-modal="true" aria-labelledby="gallery-title" aria-hidden="true">
        <div class="gallery-box">
            <button type="button" class="gallery-close" data-close="gallery" aria-label="Close gallery">&times;</button>
            <div class="gallery-wrapper">
                <button type="button" class="gallery-nav prev" data-slide="-1" aria-label="Previous image">&#10094;</button>
                <img id="gallery-img" src="" alt="">
                <button type="button" class="gallery-nav next" data-slide="1" aria-label="Next image">&#10095;</button>
            </div>
            <div class="gallery-info">
                <h3 id="gallery-title">Image title</h3>
                <p id="gallery-desc"></p>
                <div id="gallery-counter" class="gallery-counter" aria-live="polite">1 / 1</div>
            </div>
        </div>
    </div>

    <div id="iframe-modal" class="modal-iframe" role="dialog" aria-modal="true" aria-label="Embedded project viewer" aria-hidden="true">
        <div class="iframe-container">
            <button type="button" class="iframe-close" data-close="iframe" aria-label="Close viewer">&times;</button>

            <!-- Teks pengumuman deck. Hanya tampil untuk pemicu ber-atribut
                 data-deck. Ubah kalimatnya di sini, berlaku di semua halaman. -->
            <div class="iframe-head" id="iframe-head" hidden>
                <span class="badge">Previous portfolio</span>
                <h2>Migration in progress</h2>
                <p>I am moving everything into this site right now, and there are plenty of new projects still waiting to be added. In the meantime, here is my previous portfolio in full.</p>
                <a class="archive-link" href="https://www.canva.com/design/DAGU3RvRqQU/Gkyj56FhjJ_AcBzM4mVnHQ/view?utm_content=DAGU3RvRqQU&amp;utm_campaign=designshare&amp;utm_medium=link2&amp;utm_source=uniquelinks&amp;utlId=h632df97047" target="_blank" rel="noopener noreferrer">
                    Prefer a new tab? <span>Open it on Canva &#8599;</span>
                </a>
            </div>

            <div class="iframe-stage">
                <iframe id="modal-iframe" src="" title="Embedded project viewer" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            </div>
        </div>
    </div>
`);

// --- MOBILE NAV ---
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});


// --- SCROLL LOCK (modal bisa bertumpuk) ---
let openModalCount = 0;
function lockScroll() {
    openModalCount++;
    document.body.style.overflow = 'hidden';
}
function unlockScroll() {
    openModalCount = Math.max(0, openModalCount - 1);
    if (openModalCount === 0) document.body.style.overflow = '';
}

let lastFocused = null;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea';

function trapFocus(container, e) {
    const items = Array.from(container.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

function topmostModal() {
    if (iframeModal.style.display === 'flex') return iframeModal;
    if (modalGallery.style.display === 'flex') return modalGallery;
    if (modalProject.style.display === 'flex') return modalProject;
    return null;
}


// --- MODAL 1 (PROJECT LIST) ---
const modalProject = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalGrid = document.getElementById('modal-sub-grid');

function openProject(cardElement) {
    const details = cardElement.querySelector('.hidden-details');
    const subCards = details ? details.querySelectorAll('.sub-card') : [];

    // Satu sub-project saja: langsung buka galerinya, jangan paksa dua klik.
    if (subCards.length === 1 && subCards[0].hasAttribute('data-gallery')) {
        lastFocused = cardElement;
        openGallery(subCards[0]);
        return;
    }

    lastFocused = cardElement;
    modalTitle.innerHTML = cardElement.querySelector('.card-title').innerHTML;
    modalDesc.innerHTML = cardElement.querySelector('.card-desc').innerHTML;
    modalGrid.innerHTML = details ? details.innerHTML : '';

    modalProject.style.display = 'flex';
    modalProject.setAttribute('aria-hidden', 'false');
    lockScroll();
    modalProject.querySelector('.close-btn').focus();
}

function closeProject() {
    modalProject.style.display = 'none';
    modalProject.setAttribute('aria-hidden', 'true');
    modalGrid.innerHTML = '';
    unlockScroll();
    if (lastFocused) { lastFocused.focus(); lastFocused = null; }
}

modalProject.addEventListener('click', (e) => {
    if (e.target === modalProject) closeProject();
});


// --- MODAL 2 (IMAGE GALLERY) ---
let currentImages = [];
let currentIndex = 0;
const modalGallery = document.getElementById('gallery-modal');
const galleryImg = document.getElementById('gallery-img');
const galleryCounter = document.getElementById('gallery-counter');
const galleryTitle = document.getElementById('gallery-title');
const galleryDesc = document.getElementById('gallery-desc');

function openGallery(subCardElement) {
    const galleryData = subCardElement.getAttribute('data-gallery');
    if (!galleryData) return;

    currentImages = galleryData.split(',').map(item => item.trim()).filter(Boolean);
    if (!currentImages.length) return;

    if (!lastFocused) lastFocused = subCardElement;

    currentIndex = 0;
    galleryTitle.innerHTML = subCardElement.querySelector('.sub-title').innerHTML;
    galleryDesc.innerHTML = subCardElement.querySelector('.sub-desc').innerHTML;

    updateGalleryContent();
    modalGallery.style.display = 'flex';
    modalGallery.setAttribute('aria-hidden', 'false');
    lockScroll();
    modalGallery.querySelector('.gallery-close').focus();
}

function closeGallery() {
    modalGallery.style.display = 'none';
    modalGallery.setAttribute('aria-hidden', 'true');
    unlockScroll();
    if (modalProject.style.display !== 'flex' && lastFocused) {
        lastFocused.focus();
        lastFocused = null;
    }
}

function changeSlide(direction) {
    if (currentImages.length < 2) return;
    currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
    updateGalleryContent();
}

function updateGalleryContent() {
    galleryImg.style.opacity = '0';
    setTimeout(() => {
        galleryImg.src = currentImages[currentIndex];
        galleryImg.alt = galleryTitle.textContent + ', image ' + (currentIndex + 1);
        galleryImg.style.opacity = '1';
    }, 150);
    galleryCounter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;

    const single = currentImages.length < 2;
    modalGallery.querySelectorAll('.gallery-nav').forEach(btn => {
        btn.style.display = single ? 'none' : 'flex';
    });
}

modalGallery.addEventListener('click', (e) => {
    // Hanya latar di luar kotak yang menutup galeri.
    if (e.target === modalGallery) closeGallery();
});

modalGallery.querySelectorAll('[data-slide]').forEach(btn => {
    btn.addEventListener('click', () => changeSlide(Number(btn.dataset.slide)));
});

// Swipe di layar sentuh
let touchStartX = 0;
modalGallery.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
modalGallery.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 50) changeSlide(delta < 0 ? 1 : -1);
}, { passive: true });


// --- MODAL 3 (IFRAME URL POPUP) ---
const iframeModal = document.getElementById('iframe-modal');
const modalIframe = document.getElementById('modal-iframe');

let iframeOpener = null;

function openIframe(url, opener, isDeck) {
    iframeOpener = opener || document.activeElement;
    const head = document.getElementById('iframe-head');
    if (head) head.hidden = !isDeck;
    modalIframe.src = url;
    iframeModal.style.display = 'flex';
    iframeModal.setAttribute('aria-hidden', 'false');

    lockScroll();
    iframeModal.querySelector('.iframe-close').focus();
}

function closeIframe() {
    iframeModal.style.display = 'none';
    iframeModal.setAttribute('aria-hidden', 'true');
    modalIframe.src = '';
    unlockScroll();
    // Elemen pemicu bisa sudah hilang kalau modal induknya ditutup duluan.
    if (iframeOpener && document.contains(iframeOpener)) iframeOpener.focus();
    iframeOpener = null;
}

iframeModal.addEventListener('click', (e) => {
    if (e.target === iframeModal) closeIframe();
});


// --- CLOSE BUTTONS ---
document.addEventListener('click', (e) => {
    const closer = e.target.closest('[data-close]');
    if (!closer) return;
    if (closer.dataset.close === 'project') closeProject();
    if (closer.dataset.close === 'gallery') closeGallery();
    if (closer.dataset.close === 'iframe') closeIframe();
});


// --- CARD ACTIVATION (mouse + keyboard) ---
function activate(el) {
    if (el.classList.contains('card')) return openProject(el);
    if (el.classList.contains('sub-card')) {
        const url = el.getAttribute('data-iframe');
        if (url) return openIframe(url);
        return openGallery(el);
    }
}

document.addEventListener('click', (e) => {
    // Apa pun yang punya data-iframe membuka viewer, termasuk tombol
    // "Open full portfolio deck" di hero dan kartu video featured.
    const frameTrigger = e.target.closest('[data-iframe]');
    if (frameTrigger) {
        // Pemicu bisa berupa <a href="#">, jadi lompatan default dicegah.
        e.preventDefault();
        openIframe(frameTrigger.dataset.iframe, frameTrigger, frameTrigger.hasAttribute('data-deck'));
        return;
    }
    const target = e.target.closest('.sub-card, .card[role="button"]');
    if (target) activate(target);
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const target = e.target.closest('.sub-card, .card[role="button"]');
    if (!target) return;
    e.preventDefault();
    activate(target);
});


// --- KEYBOARD: ESC, ARROWS, FOCUS TRAP ---
document.addEventListener('keydown', (e) => {
    const modal = topmostModal();
    if (!modal) return;

    if (e.key === 'Escape') {
        if (modal === iframeModal) closeIframe();
        else if (modal === modalGallery) closeGallery();
        else closeProject();
        return;
    }

    if (e.key === 'Tab') trapFocus(modal, e);

    if (modal === modalGallery) {
        if (e.key === 'ArrowRight') changeSlide(1);
        if (e.key === 'ArrowLeft') changeSlide(-1);
    }
});



// --- SOROT YANG MENGIKUTI KURSOR DI KARTU ---
const spotlightCards = document.querySelectorAll('.card, .sub-card, .home-card, .video-card, .stat');
spotlightCards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
});


// --- REVEAL ON SCROLL ---
// Elemen yang bersaudara dalam satu grid muncul berurutan, bukan serentak,
// supaya tidak terasa monoton.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
const revealAll = () => revealItems.forEach(el => el.classList.add('in-view'));

function staggerIndex(el) {
    if (!el.parentElement) return 0;
    return [...el.parentElement.children].filter(c => c.classList.contains('reveal')).indexOf(el);
}

// Angka statistik menghitung naik saat pertama kali terlihat
function countUp(el) {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }

    const duration = 1100;
    const start = performance.now();
    function frame(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = target.toFixed(decimals) + suffix;
    }
    el.textContent = (0).toFixed(decimals) + suffix;
    requestAnimationFrame(frame);
}

try {
    if (!('IntersectionObserver' in window)) throw new Error('unsupported');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (!reduceMotion) el.style.animationDelay = (staggerIndex(el) * 0.11) + 's';
            el.classList.add('in-view');
            const num = el.querySelector('[data-count]');
            if (num) setTimeout(() => countUp(num), staggerIndex(el) * 110 + 180);
            observer.unobserve(el);
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
    revealItems.forEach(el => observer.observe(el));
} catch (err) {
    revealAll();
    document.querySelectorAll('[data-count]').forEach(countUp);
}

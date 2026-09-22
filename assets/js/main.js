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

    <div id="timeline-modal" class="modal-timeline" role="dialog" aria-modal="true" aria-labelledby="tl-modal-role" aria-hidden="true">
        <div class="tl-box">
            <button type="button" class="tl-close" data-close="timeline" aria-label="Close role details">&times;</button>
            <span id="tl-modal-when"></span>
            <h2 id="tl-modal-role">Role</h2>
            <p id="tl-modal-org"></p>
            <div id="tl-modal-body"></div>
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
    if (typeof modalTimeline !== "undefined" && modalTimeline && modalTimeline.style.display === "flex") return modalTimeline;
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
    if (closer.dataset.close === "iframe") closeIframe();
    if (closer.dataset.close === "timeline") window.closeTimeline();
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
        else if (typeof modalTimeline !== "undefined" && modal === modalTimeline) window.closeTimeline();
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
const spotlightCards = document.querySelectorAll('.card, .sub-card, .home-card, .video-card, .rule-card, .stat');
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


// --- MODAL 4 (TIMELINE KARIER DI BERANDA) ---
// Titiknya <button> sungguhan, jadi Enter dan Space jalan sendiri tanpa
// handler keyboard tambahan. Isi jendelanya disalin dari .tl-details yang
// tersembunyi di dalam tiap titik, supaya tidak ada data kembar antara
// HTML dan JS: yang perlu diubah cukup HTML-nya.
const modalTimeline = document.getElementById('timeline-modal');

if (modalTimeline) {
    const tlWhen = document.getElementById('tl-modal-when');
    const tlRole = document.getElementById('tl-modal-role');
    const tlOrg = document.getElementById('tl-modal-org');
    const tlBody = document.getElementById('tl-modal-body');

    window.openTimeline = function (item) {
        if (!item) return;
        const d = item.querySelector('.tl-details');
        if (!d) return;

        lastFocused = item.querySelector('.tl-dot');
        tlWhen.textContent = d.querySelector('.tl-when').textContent;
        tlRole.innerHTML = d.querySelector('.tl-role').innerHTML;
        tlOrg.innerHTML = d.querySelector('.tl-org').innerHTML;

        const scope = d.querySelector('.cv-scope');
        const list = d.querySelector('ul');
        tlBody.innerHTML = (scope ? scope.outerHTML : '') + (list ? list.outerHTML : '');

        modalTimeline.style.display = 'flex';
        modalTimeline.setAttribute('aria-hidden', 'false');
        lockScroll();
        modalTimeline.querySelector('.tl-close').focus();
    };

    window.closeTimeline = function () {
        modalTimeline.style.display = 'none';
        modalTimeline.setAttribute('aria-hidden', 'true');
        tlBody.innerHTML = '';
        unlockScroll();
        if (lastFocused) { lastFocused.focus(); lastFocused = null; }
    };

    modalTimeline.addEventListener('click', (e) => {
        if (e.target === modalTimeline) window.closeTimeline();
    });

    // Label di sebelah titik ikut bisa diklik, sasarannya jadi lebih lega.
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.tl-dot, .tl-tag');
        if (trigger) window.openTimeline(trigger.closest('.tl-item'));
    });
}




// --- GRAFIK PERJALANAN KARIER ---
// Datanya yang menggambar kurvanya, bukan sebaliknya. Tinggi tiap titik
// diambil dari data-level (0 di dasar, 100 di puncak) pada elemennya,
// lalu kurva mulus ditarik melewati titik-titik itu. Kalau mau mengubah
// bentuk grafiknya, ubah data-level di index.html, jangan sentuh sini.
//
// Sumbu tegaknya JANGKAUAN DAN TANGGUNG JAWAB, bukan jumlah orang.
// Semua peran global duduk di atas semua peran lokal. Jumlah orang
// ditandai ukuran titik (.is-lead), supaya dua hal itu tidak tertukar.
//
// Labelnya dikunci ke dua pita tetap, atas dan bawah, lalu disambung
// garis tipis. Kalau label ditempel ke titiknya, label di atas titik
// rendah dan label di bawah titik tinggi bisa mendarat sama tinggi.
(function () {
    const route = document.getElementById('tl-route');
    const track = document.querySelector('.tl-track');
    if (!route || !track) return;

    const items = Array.from(track.querySelectorAll('.tl-item'));
    if (items.length < 2) return;

    const VB_W = 1200;
    const VB_H = 420;
    // Tepi kiri disisakan lebar untuk nama sumbu Local dan International,
    // kalau tidak, namanya bertabrakan dengan titik pertama.
    const X0 = 155, X1 = 1110;
    const Y_TOP = 95, Y_BOTTOM = 325;  // level 100 dan level 0
    const EDGE = 4;                // jarak label dari tepi atas atau bawah

    const levels = items.map(it => Number(it.dataset.level) || 0);
    const pts = levels.map((lv, i) => ({
        x: X0 + (X1 - X0) * (i / (items.length - 1)),
        y: Y_BOTTOM - (Y_BOTTOM - Y_TOP) * (lv / 100)
    }));

    // Catmull-Rom diubah jadi kubik bezier, supaya kurvanya benar-benar
    // lewat titiknya, bukan sekadar mendekat seperti bezier biasa.
    function smooth(p) {
        const T = 0.2;
        let d = 'M ' + p[0].x.toFixed(1) + ' ' + p[0].y.toFixed(1);
        for (let i = 0; i < p.length - 1; i++) {
            const p0 = p[i - 1] || p[i];
            const p1 = p[i];
            const p2 = p[i + 1];
            const p3 = p[i + 2] || p2;
            const c1x = p1.x + (p2.x - p0.x) * T;
            const c1y = p1.y + (p2.y - p0.y) * T;
            const c2x = p2.x - (p3.x - p1.x) * T;
            const c2y = p2.y - (p3.y - p1.y) * T;
            d += ' C ' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) +
                 ', ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) +
                 ', ' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
        }
        return d;
    }

    route.setAttribute('d', smooth(pts));
    track.style.setProperty('--len', Math.ceil(route.getTotalLength()));

    // Pemisah lokal dan global ditaruh di tengah celah antara peran lokal
    // tertinggi dan peran global terendah, jadi ikut kalau datanya diubah.
    const cross = items.findIndex((it, i) => i > 0 && it.hasAttribute('data-zone'));
    if (cross > 0) {
        const topLocal = Math.min.apply(null, pts.slice(0, cross).map(p => p.y));
        const lowGlobal = Math.max.apply(null, pts.slice(cross).map(p => p.y));
        track.style.setProperty('--divide', ((topLocal + lowGlobal) / 2 / VB_H * 100).toFixed(2) + '%');
    }

    // Tombolnya tanpa teks, jadi namanya diambil dari keterangannya.
    items.forEach(it => {
        const dot = it.querySelector('.tl-dot');
        const role = it.querySelector('.tl-role');
        const when = it.querySelector('.tl-when');
        if (dot && role) {
            dot.setAttribute('aria-label', role.textContent.trim() + (when ? ', ' + when.textContent.trim() : ''));
        }
    });

    function place() {
        if (window.matchMedia('(max-width: 900px)').matches) {
            items.forEach(it => {
                it.style.removeProperty('--x');
                it.style.removeProperty('--y');
                it.style.removeProperty('--label-dy');
                it.style.removeProperty('--connector');
            });
            return;
        }

        const trackH = track.getBoundingClientRect().height;

        items.forEach((it, i) => {
            it.style.setProperty('--x', (pts[i].x / VB_W * 100).toFixed(3) + '%');
            it.style.setProperty('--y', (pts[i].y / VB_H * 100).toFixed(3) + '%');
            it.classList.toggle('tl-above', i % 2 === 0);
            it.classList.toggle('tl-below', i % 2 === 1);
        });

        // Tinggi label baru bisa diukur setelah kelasnya terpasang.
        items.forEach((it, i) => {
            const tag = it.querySelector('.tl-tag');
            if (!tag) return;
            const h = tag.offsetHeight;
            const dotY = pts[i].y / VB_H * trackH;
            const dy = (i % 2 === 0) ? EDGE - dotY : trackH - h - EDGE - dotY;
            it.style.setProperty('--label-dy', Math.round(dy) + 'px');
            it.style.setProperty('--connector',
                Math.max(0, Math.round(Math.abs(dy)) - (i % 2 === 0 ? h : 0) - 10) + 'px');
        });
    }

    place();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(place, 120);
    });
})();

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
    if (!open) closeNavMenus();
});
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        closeNavMenus();
    }
});

// --- LACI DI NAVBAR ---
// Satu laci saja yang boleh terbuka. Atribut hidden yang menentukan
// tampil atau tidak, bukan kelas, supaya isinya tetap tersembunyi dari
// pembaca layar dan dari urutan Tab selama masih tertutup.
const navParents = Array.from(document.querySelectorAll('.nav-parent'));

function closeNavMenus(except) {
    navParents.forEach(btn => {
        if (btn === except) return;
        btn.setAttribute('aria-expanded', 'false');
        const menu = document.getElementById(btn.getAttribute('aria-controls'));
        if (menu) menu.hidden = true;
    });
}

// Laci terbuka begitu kursor mendekat, tanpa menunggu diklik. Hanya pada
// alat yang benar-benar punya kursor DAN hanya pada tata letak lebar: di
// layar sempit navbar-nya menumpuk ke bawah, dan pada layar sentuh hover
// ikut terpicu oleh sentuhan, jadi lacinya akan terbuka sendiri saat
// orang cuma bermaksud menggulung.
const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');
const wideLayout = window.matchMedia('(min-width: 981px)');
const canHover = () => hoverCapable.matches && wideLayout.matches;

let hoverTimer;

navParents.forEach(btn => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;
    const group = btn.closest('.nav-group');

    const open = () => {
        closeNavMenus(btn);
        btn.setAttribute('aria-expanded', 'true');
        menu.hidden = false;
    };
    const shut = () => {
        btn.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
    };

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(hoverTimer);
        if (btn.getAttribute('aria-expanded') === 'true') shut(); else open();
    });

    group.addEventListener('mouseenter', () => {
        if (!canHover()) return;
        clearTimeout(hoverTimer);
        open();
    });

    // Jeda kecil sebelum menutup. Tanpa itu, kursor yang sedang bergerak
    // dari tombolnya menuju isi lacinya sempat keluar dari .nav-group dan
    // lacinya tertutup persis saat orang mau memakainya.
    group.addEventListener('mouseleave', () => {
        if (!canHover()) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(shut, 160);
    });
});

// Klik di luar navbar menutup laci yang sedang terbuka.
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-group')) closeNavMenus();
});

// Escape menutup laci lebih dulu, sebelum urusan modal.
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (navParents.some(b => b.getAttribute('aria-expanded') === 'true')) {
        closeNavMenus();
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
    // Kartu arsip di halaman studi kasus memakai nama kelas sendiri karena
    // tampilannya meminjam .release dari halaman music, bukan .sub-card.
    const titleEl = subCardElement.querySelector(".sub-title, .shot-title");
    const descEl = subCardElement.querySelector(".sub-desc, .shot-desc");
    if (!titleEl || !descEl) return;
    galleryTitle.innerHTML = titleEl.innerHTML;
    galleryDesc.innerHTML = descEl.innerHTML;

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
    modalGallery.querySelectorAll(".gallery-nav").forEach(btn => {
        btn.style.display = single ? "none" : "flex";
    });
    // "1 / 1" tidak memberi tahu apa pun, jadi disembunyikan kalau
    // gambarnya memang cuma satu.
    galleryCounter.style.display = single ? "none" : "";
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
    if (el.classList.contains("card")) return openProject(el);
    if (el.classList.contains("shot")) return openGallery(el);
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
    // .shot adalah <button> sungguhan, jadi Enter dan Spasi sudah
    // menghasilkan click sendiri. Sengaja TIDAK ditambahkan ke penangan
    // keydown di bawah, kalau tidak pop-upnya terbuka dua kali.
    const target = e.target.closest(".sub-card, .card[role='button'], .shot");
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

        // Grafik karier dipicu dari titiknya, langkah di studi kasus dari
        // tombolnya sendiri. Fokus dikembalikan ke mana pun asalnya.
        lastFocused = item.querySelector('.tl-dot') || item.querySelector('.pb-step') || item;
        tlWhen.textContent = d.querySelector('.tl-when').textContent;
        tlRole.innerHTML = d.querySelector('.tl-role').innerHTML;
        tlOrg.innerHTML = d.querySelector('.tl-org').innerHTML;
        // Empat bagian opsional, urutannya tetap: keterangan cakupan,
        // lalu .tl-extra (diagram di studi kasus, pratinjau foto di
        // beranda), lalu butirannya, lalu .tl-cta untuk tombolnya.
        // Urutan di sini yang menentukan tampilan jendela, bukan urutan
        // di HTML-nya, jadi jangan disusun ulang tanpa alasan.
        const scope = d.querySelector('.cv-scope');
        const extra = d.querySelector('.tl-extra');
        const list = d.querySelector('ul');
        const cta = d.querySelector('.tl-cta');
        tlBody.innerHTML = (scope ? scope.outerHTML : '') +
            (extra ? extra.outerHTML : '') +
            (list ? list.outerHTML : '') +
            (cta ? cta.outerHTML : '');
        // Warna langkahnya ikut dibawa masuk. Tanpa ini keempat diagram
        // tampil biru semua, karena jendela ini berada di luar section-nya
        // dan mewarisi aksen bawaan dari :root. Hanya untuk langkah studi
        // kasus, supaya jendela grafik karier tidak ikut berubah.
        const isStep = !!item.querySelector('.pb-step');
        tlBody.className = isStep ? (item.className.match(/hue-[a-z]+/) || [''])[0] : '';
        // Animasi diagramnya baru jalan setelah masuk jendela ini, dan
        // menghitung ulang tata letak di sini yang membuatnya benar-benar
        // diputar ulang setiap kali jendelanya dibuka.
        void tlBody.offsetWidth;
        tlBody.classList.add(reduceMotion ? 'pb-still' : 'pb-play');

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
        const trigger = e.target.closest('.tl-dot, .tl-tag, .pb-step');
        if (trigger) window.openTimeline(trigger.closest('.tl-item, .pb-move'));
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
    // Tepi kiri dan kanan plot. Di beranda tepi kirinya sengaja lebar untuk
    // nama sumbu Local dan International; halaman lain yang tidak punya nama
    // sumbu bisa memepetkannya lewat data-x0 dan data-x1 pada .tl-track.
    const X0 = Number(track.dataset.x0) || 155;
    const X1 = Number(track.dataset.x1) || 1110;
    const Y_TOP = 95, Y_BOTTOM = 325;  // level 100 dan level 0
    const EDGE = 4;                // jarak label dari tepi atas atau bawah
    // data-labels="near" menempelkan label ke titiknya dan mematikan garis
    // penyambung. Hanya aman kalau titiknya sedikit dan berjauhan; di beranda
    // yang sembilan titik, label begini bisa mendarat sama tinggi dan saling
    // menimpa, jadi di sana labelnya tetap dikunci ke pita.
    const nearLabels = track.dataset.labels === "near";
    const NEAR_GAP = 20;           // jarak label ke titiknya, mode near

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
            const c2x = p2.x - (p3.x - p1.x) * T;
            // Titik kendali ditahan di antara kedua ujung ruasnya, supaya
            // kurvanya tidak pernah melewati nilai datanya. Tanpa ini, dua
            // titik yang sama tinggi bisa menghasilkan gelembung ke atas,
            // dan grafiknya jadi menunjukkan angka yang tidak pernah ada.
            const lo = Math.min(p1.y, p2.y);
            const hi = Math.max(p1.y, p2.y);
            const hold = v => Math.max(lo, Math.min(hi, v));
            const c1y = hold(p1.y + (p2.y - p0.y) * T);
            const c2y = hold(p2.y - (p3.y - p1.y) * T);
            d += ' C ' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) +
                 ', ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) +
                 ', ' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
        }
        return d;
    }

    route.setAttribute('d', smooth(pts));
    track.style.setProperty('--len', Math.ceil(route.getTotalLength()));
    // Garis pencapaian ditaruh di tengah celah antara peran lokal
    // tertinggi dan peran internasional terendah, jadi tingginya ikut
    // data. Kalau nanti ada level lokal yang melewati level
    // internasional terendah, celah itu hilang dan garisnya tidak lagi
    // memisahkan apa pun.
    const cross = items.findIndex((it, i) => i > 0 && it.hasAttribute("data-zone"));
    if (cross > 0) {
        const topLocal = Math.min.apply(null, pts.slice(0, cross).map(p => p.y));
        const lowIntl = Math.max.apply(null, pts.slice(cross).map(p => p.y));
        track.style.setProperty("--divide", ((topLocal + lowIntl) / 2 / VB_H * 100).toFixed(2) + "%");
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

            if (nearLabels) {
                it.style.setProperty("--label-dy",
                    ((i % 2 === 0) ? -(h + NEAR_GAP) : NEAR_GAP) + "px");
                it.style.setProperty("--connector", "0px");
                return;
            }

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


// --- LOMPATAN KE #anchor ---
// Lompatan bawaan browser ke fragmen URL tidak selalu terjadi di sini,
// jadi diulang sekali sesudah load.
//
// behavior 'auto' itu WAJIB, bukan pilihan gaya. html punya
// scroll-behavior: smooth, dan gulungan mulus bisa dipotong gulungan
// berikutnya. Versi pertama fungsi ini memanggil scrollIntoView empat
// kali berturut-turut untuk mengejar pergeseran tata letak yang ternyata
// tidak ada: keempatnya saling memotong dan halaman mendarat di tempat
// acak, terukur 292px terlalu rendah sekali jalan dan 108px terlalu
// tinggi di jalan berikutnya. Satu lompatan tegas sudah cukup.
//
// Jaraknya dari navbar diatur scroll-margin-top pada section, jadi di
// sini tidak ada angka yang perlu disamakan dengan tinggi navbar.
(function () {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;

    // Kalau pembacanya sudah menggulung sendiri selama halaman dimuat,
    // posisinya jangan direbut.
    let userMoved = false;
    ['wheel', 'touchstart', 'keydown'].forEach(evt => {
        window.addEventListener(evt, () => { userMoved = true; }, { passive: true, once: true });
    });

    window.addEventListener('load', () => {
        if (userMoved) return;
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
})();

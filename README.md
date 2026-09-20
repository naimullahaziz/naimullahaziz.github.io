# Portfolio — Na'imullah Aziz

Situs statis, tanpa build tool. Upload semua isi folder ini ke repo GitHub,
lalu aktifkan GitHub Pages di Settings > Pages.

## Struktur

    index.html              Beranda
    work.html               Daftar semua pekerjaan
    about.html              Latar belakang dan karya kreatif
    contact.html            Kontak
    project-pwb.html        Case study 01
    project-web.html        Case study 02
    project-campaigns.html  Case study 03
    project-live.html       Case study 04
    assets/css/site.css     Semua gaya, satu file
    assets/js/site.js       Semua interaksi, satu file
    assets/img/             Gambarmu

## Daftar gambar yang dipakai

Nama file harus persis seperti di bawah ini. Huruf kecil semua.
GitHub Pages membedakan huruf besar dan kecil.

    assets/img/hero/hero-01.webp        Slideshow beranda, potret, sisi kanan
    assets/img/hero/hero-02.webp
    assets/img/hero/hero-03.webp
    assets/img/hero/hero-04.webp

    assets/img/work/pwb-01.webp         Case study 01, juga jadi sampul
    assets/img/work/pwb-02.webp
    assets/img/work/pwb-03.webp
    assets/img/work/pwb-04.webp

    assets/img/work/web-01.webp         Case study 02, juga jadi sampul
    assets/img/work/web-02.webp
    assets/img/work/web-03.webp

    assets/img/work/campaign-01.webp    Case study 03, juga jadi sampul
    assets/img/work/campaign-02.webp
    assets/img/work/campaign-03.webp

    assets/img/work/live-01.webp        Case study 04, juga jadi sampul
    assets/img/work/live-02.webp

    assets/img/creative/music-01.webp
    assets/img/creative/film-01.webp
    assets/img/creative/doc-01.webp

    assets/img/about/portrait.webp
    assets/img/about/teaching.webp

Kalau sebuah file belum ada, kotaknya otomatis jadi placeholder garis
putus-putus dan halaman tetap rapi. Tidak ada gambar rusak.

## Ukuran gambar

Lebar maksimal 1600px, ekspor ke WebP, target di bawah 300KB per file.
Gambar sampul dipotong 16:10, slideshow beranda dipotong 4:5 di layar
lebar dan 16:10 di HP, galeri dipotong 4:3. Taruh objek utama di tengah
supaya aman saat dipotong.

## Video

Jangan taruh video di repo. Upload ke YouTube, lalu ubah figure menjadi:

    <figure class="media vid" data-yt="ID_VIDEO" tabindex="0">
      <figcaption>Judul video</figcaption>
    </figure>

## Form kontak

Lihat komentar di dalam contact.html. Butuh endpoint Formspree.

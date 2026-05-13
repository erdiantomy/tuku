## Goal

Ubah `Colophon` dan chapter eyebrow (label "CH · 04 — PERGESERAN" dst.) dari elemen statis jadi interaktif: hover memunculkan hint halus, klik membuka panel detail singkat di tempat — tetap editorial, tanpa library tambahan.

## Scope (presentational only, file: `src/routes/index.tsx`)

### 1. Chapter eyebrow → komponen `ChapterEyebrow` interaktif

- Ganti dua eyebrow inline yang sudah ada (line 399 "CH · 04 — PERGESERAN", line 540 "CH · 09 — UNDANGAN") dengan `<ChapterEyebrow n="04" label="PERGESERAN" title="..." note="..." />`.
- Tambah satu `ChapterEyebrow` baru di puncak `NarrativeHero` ("CH · 01 — PEMBUKA") supaya pola konsisten sejak awal.
- Behaviour:
  - Render sebagai `<button>` inline, gaya tetap uppercase mono kecil seperti sekarang.
  - Hover: underline tipis muncul dari kiri (animasi `transform: scaleX`), kursor jadi help, dan caret kecil "＋" muncul di akhir.
  - Klik: toggle panel kecil tepat di bawah eyebrow (max-width ~520px) berisi:
    - judul bab ringkas (Playfair italic),
    - 1–2 kalimat catatan editorial,
    - garis tipis + meta "halaman X dari IX".
  - Esc / klik di luar / klik eyebrow lagi → tutup. `aria-expanded`, `aria-controls` lengkap.
  - State lokal `useState<string|null>` di komponen induk (atau di dalam komponen sendiri pakai `useState<boolean>` masing-masing — pilih per-komponen agar tidak perlu prop drilling).

### 2. `Colophon` → setiap kartu jadi tile interaktif

Empat kolom (Logo, Huruf, Palet, Edisi) dibungkus komponen `ColophonTile` baru:

- Hover: ring tipis `${C.aren}40`, latar sedikit terangkat (`background: C.warmWhite`), label uppercase berubah warna ke `C.aren`, dan hint mikro "klik untuk detail" muncul di pojok kanan bawah dengan opacity transition.
- Klik: tile expand di tempat (grid item span penuh row, height auto) menampilkan detail:
  - **Logo**: deskripsi singkat lambang (gelas + biji), tagline "Rukun Tetangga Digital", tahun berdiri.
  - **Huruf**: tiap nama font dapat baris contoh pangram + peran (Display, Body, Hand, Utility).
  - **Palet**: tiap swatch jadi tombol; klik swatch menampilkan nama warna, kode hex/oklch, dan peran ("latar utama", "aksen", dll.).
  - **Edisi**: ringkasan edisi 01 (tema, jumlah bab, tanggal cetak digital).
- Tombol "tutup ✕" kecil di pojok panel detail; klik tile lain otomatis menutup yang sebelumnya (state `openTile` di `Colophon`).
- `prefers-reduced-motion`: skip transisi tinggi/transform, biarkan hanya fade.

### 3. Komponen baru & util kecil

- `ChapterEyebrow({ n, label, title, note, page })` — self-contained, inline keyframes + style object.
- `ColophonTile({ id, label, children, detail, openId, setOpenId })` — wrapper umum; konten ringkas vs detail diselipkan via props.
- Tambah satu keyframe `revealDown` (opacity 0→1, translateY 4→0, 220ms) untuk panel detail; `caretFade` untuk "＋" eyebrow.

## Non-goals

- Tidak mengubah konten naratif lain, tipografi global, atau struktur route.
- Tidak menambah dependency (no Radix Popover) — semua pakai state lokal + style inline, konsisten dengan pola file ini.
- Tidak menyentuh app MVP (`Application`, tab Cerita/Paspor, dll.).

## Verifikasi

- `bunx tsc --noEmit` lulus.
- Cek di preview: hover & klik dua eyebrow lama + satu baru, klik tiap tile colophon, klik swatch warna, tombol tutup, Esc, dan toggle ulang.

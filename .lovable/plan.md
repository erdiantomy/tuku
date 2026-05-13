## Masalah saat ini

Sumber gambar logo (`tuku-logo-dark.png`, `tuku-logo-light.png`) berisi gelas + wordmark yang ditumpuk vertikal dengan banyak whitespace di atas/bawah, rasio aktual ~1.8:1 (lebar > tinggi). Komponen `TukuLogo` membungkusnya dalam kotak `size × size` (atau `size × size*0.6` saat tanpa wordmark) dengan `objectFit: contain` → logo tampil jauh lebih kecil dari nilai `size` yang diharapkan, dan ukuran piksel tetap (mis. `size={120}`, `size={140}`, `size={520}`) tidak menyusut di mobile sehingga bisa terlihat oversized atau memicu horizontal overflow.

Sticky/fixed: `Masthead` (line 96) sticky di proposal — sudah benar. `AppTopBar` (line ~440) sticky di frame app — sudah benar. Yang perlu dijaga: keduanya tidak rusak / overflow di lebar 320–375 px, dan logo tetap tajam saat header bertransisi ke "solid" pada scroll.

## Scope (presentational, satu file: `src/routes/index.tsx`)

### 1. `TukuLogo` jadi responsif & rasio benar

- Tambah prop opsional `minSize?: number` dan `maxSize?: number`. Jika diberikan, render `width: clamp(minSize, sizeVw, maxSize)` di mana `sizeVw` ditarik dari prop `size` sebagai baseline desktop (mis. `size={120}` → `clamp(64px, 14vw, 120px)`).
- Perbaiki rasio: ganti `width: size, height: size` (atau `size*0.6`) jadi `width: clamp(...)`, `height: auto`, dengan `aspectRatio: withWordmark ? "1456 / 812" : "1456 / 520"` (perkiraan dari sumber). Hasil: nilai `size` benar-benar lebar visual logo, tanpa kotak kosong di atas/bawah.
- `objectFit` tetap `contain` sebagai pengaman; tambah `display: block` untuk hindari baseline gap.
- Pertahankan back-compat: jika `minSize`/`maxSize` tidak diberikan, tetap pakai `size` fixed agar pemanggilan lain tidak berubah.

### 2. Penyesuaian per pemanggilan

- **Masthead** (line 115): `size={34}` → `minSize={26} maxSize={34}`. Tag "RUKUN TETANGGA DIGITAL" sudah `display:none` di <640 px, OK. Tambah `flex-wrap` aman + `min-width: 0` di kontainer kiri agar tidak overflow saat sangat sempit.
- **Hero** (line 516): `size={120}` → `minSize={72} maxSize={120}`. Drop-shadow tetap.
- **NarrativeReframe watermark** (line 630): `size={520}` → `minSize={280} maxSize={520}`. Posisi `right:-80 bottom:-60` diubah ke persentase agar tidak menggeser konten di mobile (mis. `right: -10vw, bottom: -8vw`).
- **NarrativeCTA** (line 774): `size={88}` → `minSize={56} maxSize={88}`.
- **Splash** (line 2119): `size={140}` → `minSize={88} maxSize={140}`.
- **Footer** (line 2202): `size={64}` → `minSize={48} maxSize={64}`.
- **AppTopBar** (line 446) & **Colophon tile** (line 372): biarkan ukuran tetap (sudah kecil & dalam frame terkontrol), hanya dapat manfaat dari rasio yang dibetulkan.

### 3. Sticky behavior tetap stabil saat scroll

- `Masthead`: tambah `will-change: background, backdrop-filter` supaya transisi mulus, dan kunci `height` minimum (mis. `min-height: 56px`) agar tidak loncat saat state `solid` berubah.
- Di `Masthead`, gunakan `containIntrinsicSize` via `min-width: 0` pada child kanan supaya layout tidak bergeser ketika scrollbar muncul/hilang.
- `AppTopBar` sudah sticky di dalam frame 420 px — tidak perlu perubahan, hanya pastikan logo `withWordmark={false}` memakai aspect ratio baru.

## Verifikasi

- `bunx tsc --noEmit` lulus.
- Cek visual di tiga viewport:
  - mobile 375×812 (preview_ui set ke mobile)
  - tablet 768
  - desktop 1280
- Scroll dari atas ke bawah: pastikan masthead tidak loncat, watermark di NarrativeReframe tidak menyebabkan horizontal scroll, dan logo hero/CTA/footer proporsional.

## Non-goals

- Tidak mengubah konten naratif, navigasi, atau logika MVP.
- Tidak menyentuh asset PNG (sumber tetap sama).
- Tidak menambah dependency.

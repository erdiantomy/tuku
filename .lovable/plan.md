
## Tujuan

Tambahkan tampilan peta visual di tab Paspor yang menunjukkan rute ekspedisi (dari rumah `TUKU Cipete` ke setiap kota yang dikunjungi) dan lokasi toko di tiap kota. Murni UI inline (SVG) — tanpa library peta eksternal, tanpa API key.

## Pendekatan

Komponen baru `ExpeditionMap` yang dipasang di sub-tab "Paspor" (`AppPaspor`) di atas section "Jejak Tetangga Berkunjung". Dua mode:

1. **World view** (default) — peta dunia stilistik, pin tiap kota yang sudah dikunjungi, garis putus-putus rute dari Cipete ke tiap kota.
2. **City view** — saat user mengetuk satu pin atau kartu kota, kanvas zoom ke kota tsb dan menampilkan tile peta-kota stilistik dengan marker tiap toko.

Toggle balik ke world via tombol "← Semua kota". Tidak menambah dependency.

## Implementasi (semua di `src/routes/index.tsx`)

### 1. Data koordinat

Tambah field opsional ke `STORES_VISITED`:

- `coord: { x, y }` — koordinat di viewBox 360×200 untuk world map.
- `home?: boolean` — true untuk Jakarta (kota rumah).
- `stores: { name, x, y }[]` — koordinat tile kota 320×220 untuk tiap toko (Jakarta 4 toko diberi posisi yang menyebar; kota lain 1 toko di tengah).

Koordinat awal (approx, stilistik bukan geografis akurat):

- Jakarta (home) → world (245, 152)
- Bandung → (256, 154)
- Surabaya → (275, 155)
- Amsterdam → (162, 58)

Stores Jakarta di tile kota: Cipete (160, 145) home, Kemang (175, 130), GBK (140, 110), Jatinegara (200, 95).

### 2. Komponen `ExpeditionMap`

Props: `cities: typeof STORES_VISITED`, `homeCity: string`.

State: `selectedCity: string | null`.

Render:

**World view (`selectedCity === null`)**

- Container kartu: `background: C.warmWhite`, border halus, padding, radius 16.
- Header kecil: "Peta Ekspedisi" + chip "{n} kota · {m} toko".
- SVG `viewBox="0 0 360 200"`, height ~200px:
  - Background `C.parchment` dengan grid titik halus (pattern `<circle>` sparse) untuk efek paspor.
  - Siluet benua sebagai `<path>` blob disederhanakan (Asia Tenggara + Eropa + Australia) dengan fill `${C.softBrown}25`. Tidak akurat geografis — gaya stempel.
  - Garis rute dari home (Cipete/Jakarta) ke tiap kota lain: `<path>` kurva quadratic, `stroke-dasharray="3 4"`, warna `C.aren`, animasi `dashFlow` (stroke-dashoffset bergerak).
  - Pin tiap kota: lingkaran 6px (`C.aren` untuk visited, `C.leaf` untuk home), halo pulse (`@keyframes pinPulse`), label kota di atas pin (font kecil uppercase). Tap → `setSelectedCity(c.city)`.
  - Pin home diberi ikon 🏠 kecil di tengah.
- Legend mini di bawah SVG: `🏠 Rumah · ● Dikunjungi · ╌ Rute`.

**City view (`selectedCity !== null`)**

- Header: tombol back "← Semua kota" + nama kota + chip jumlah toko.
- SVG `viewBox="0 0 320 220"`:
  - Background tile kota: `C.parchment`, garis-garis "jalan" abstrak (beberapa `<path>` lengkung tipis `C.softBrown`40`), 1-2 blob "taman/sungai" (`C.leaf`20` rounded blob).
  - Marker tiap toko: pin "tear-drop" SVG (`<path>` ukuran 14×18) warna `C.aren` (atau `C.leaf` jika store rumah Cipete), dengan label nama toko di sampingnya. Pin home diberi badge 🏠 kecil.
  - Untuk kota dengan 1 toko, pin di tengah.
- Catatan pendek di bawah: jumlah kunjungan ke toko home (gunakan `USER.visits` jika home), atau "Pertama dijelajahi" untuk kota lain (statis sederhana).

### 3. Animasi

Tambahkan dalam `<style>` lokal komponen:

```text
@keyframes pinPulse { 0%,100% { r: 6 } 50% { r: 8 } }
@keyframes haloPulse { 0% { opacity: 0.5; r: 8 } 100% { opacity: 0; r: 18 } }
@keyframes dashFlow { to { stroke-dashoffset: -14 } }
@keyframes mapFade { from { opacity: 0; transform: scale(0.98) } to { opacity: 1; transform: none } }
```

SVG kanvas `key={selectedCity ?? "world"}` agar transisi `mapFade` muncul saat ganti view.

### 4. Penempatan di `AppPaspor`

Sisipkan `<ExpeditionMap cities={STORES_VISITED} homeCity={USER.rumah} />` di dalam `sub === "p"`, **di atas** judul "Jejak Tetangga Berkunjung" yang sudah ada (kartu list tetap dipertahankan sebagai daftar tekstual lengkap).

### 5. Tidak diubah

- Tidak menambah library (react-leaflet, mapbox, dsb.) — semua SVG inline.
- Tidak mengubah backend/data global selain field koordinat di `STORES_VISITED`.
- Tab nav, Cerita, Pesan, dll tidak tersentuh.

## Catatan teknis

```text
World view             City view (Jakarta)
┌────────────────┐     ┌────────────────┐
│ AMS●           │     │   ● GBK        │
│   ╲╌╌╌╌╌╮      │ →   │       ● Kemang │
│         ╲      │     │ ● Cipete 🏠    │
│          🏠JKT │     │           ●Jat │
│    ●BDG ●SBY   │     │                │
└────────────────┘     └────────────────┘
```

Karena kanvas kecil (lebar app ~420px), label kota memakai font uppercase 9–10px supaya tidak tabrakan; jika dua pin terlalu dekat (Jakarta–Bandung–Surabaya), label dirender bergantian di atas/bawah pin.

Aksesibilitas: tiap pin adalah `<g role="button" tabIndex={0}>` dengan `aria-label`, `onClick` + `onKeyDown(Enter)`.

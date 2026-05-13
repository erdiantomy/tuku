## Diagnosis singkat

Saat ini animasi tersebar dengan timing & easing yang tidak konsisten:

- `Fade` (intersection): 900 ms `ease`, translateY(24px) — kelewat lambat dan terasa "berat".
- Splash open: 600 ms; splash close: 400 ms; spinner `loaderSlide 1.4s` linear.
- App screen masuk: `fadeIn 0.4s ease` (cuma opacity, tanpa lift).
- AppTopBar: teks eyebrow & tab name berganti instan tanpa transisi.
- Tab icon: campuran `transform 0.6s` + `background 0.3s` + `color 0.3s`.
- Masthead solid: `0.3s ease`.

## Tujuan

Satu bahasa motion editorial: cepat-tapi-mengalir, easing seragam, durasi terukur. Tetap jadi UI editorial (bukan playful spring).

## Token motion (top of `src/routes/index.tsx`)

```ts
const M = {
  // Durations
  fast:  160,   // micro hover
  base:  240,   // umumnya UI feedback
  med:   420,   // section reveal, tab swap
  slow:  680,   // splash opening
  // Easing — satu kurva editorial untuk semua
  out:   "cubic-bezier(0.22, 1, 0.36, 1)",   // ease-out kuat
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",   // halus untuk loop / sticky
};
```

## Perubahan (presentational, satu file)

### 1. `Fade` jadi seragam & lebih ringan
- Durasi 900 ms `ease` → `M.med` (420 ms) `M.out`.
- `translateY(24px)` → `translateY(14px)` supaya gerakan terasa terhubung, tidak kelewat jauh.
- Tambah `prefers-reduced-motion`: opacity-only.

### 2. Splash / transition antar mode (narrative ↔ app)
- Bungkus dengan `<div style={{ animation: "shellFade <M.med>ms <M.out> both" }}>` di luar konten splash; logo + caption + bar dibungkus pula dengan `staggerIn` 80 ms beruntun.
- Durasi `setTimeout(setMode("app"), 600)` → samakan dengan token: open 680 ms (`M.slow`), close 420 ms (`M.med`).
- Ganti `pulseGlow` (scale 1↔1.08) jadi nafas halus 1.4s `M.inOut` scale 1↔1.04 supaya tidak "berdetak".
- `loaderSlide` 1.4s linear → 1.6s `M.inOut`.
- Tambah `crossFade` saat keluar transition: pakai `pointer-events:none` + opacity fade-out 240 ms sebelum pindah, agar tidak ada "jump".

### 3. AppTopBar — transisi saat ganti tab
- Bungkus eyebrow + tab name dalam `<div key={tab}>` dengan animasi `topbarSwap M.base M.out both` (opacity 0→1 + translateY 6→0). Karena `key` berubah per tab, React remount → animasi berjalan tiap pindah.
- TukuLogo di top bar tetap (tidak dianimasi).

### 4. App screen swap (di `appRef` div)
- Sekarang `animation: fadeIn 0.4s ease`. Ganti jadi `screenSwap M.med M.out both` (opacity 0→1 + translateY 8→0). Tetap pakai `key={tab}` agar replay tiap pindah.
- Sertakan reset scrollTop yang sudah ada.

### 5. Masthead sticky
- Transisi `0.3s ease` → `M.base M.out` untuk `background`, `border-color`, `backdrop-filter`. Tidak mengubah min-height.

### 6. TabIcon (bottom nav)
- Satukan transisi: `transition: transform M.base M.out, background M.base M.out, color M.base M.out, opacity M.base M.out`.
- Hapus `0.6s` yang berbeda.

### 7. Bagian utama (section reveal)
- Tetap pakai `Fade` yang sudah disamakan; tidak menambah library.
- Untuk `NarrativeGap` & `NarrativeReframe` (yang punya entrance dramatik), biarkan stagger antar `Fade delay` yang ada — hanya nilai delay dirapikan jadi kelipatan 120 ms (120/240/360/480) supaya berirama satu ketuk.

### 8. Reduced motion
- Satu blok `<style>` global di komponen utama:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
  }
  ```

## Non-goals

- Tidak menambah Framer Motion / library animasi.
- Tidak mengubah konten teks, layout, warna, atau navigasi.
- Tidak menyentuh animasi konten yang sangat lokal (`batchPulse`, `mapFade`, `dashFlow`, lvSheet) — sudah bagian dari karakter masing-masing scene.

## Verifikasi

- `bunx tsc --noEmit` lulus.
- Cek visual: scroll melewati setiap section (Fade reveal terasa satu irama), buka splash → app (timing nyambung), pindah tab di app (top bar + content swap halus & sinkron), kembali ke proposal (close splash juga halus).

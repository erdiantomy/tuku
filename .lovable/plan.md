## Diagnosis

Tiga elemen editorial sudah ada tapi tersebar tidak merata:
- **Grain**: hanya di Hero, Reframe, CTA, splash, footer.
- **Corner ticks**: hanya di Reframe & CTA.
- **Watermark logo**: hanya di Reframe.

Section lain (Letter, Gap, Pillars, Traktir, Global, Colophon) terasa "telanjang" dibanding section dramatik. App MVP (frame 420 px) sama sekali tidak punya tekstur editorial → terasa beda kanvas dengan proposal.

## Tujuan

Satu lapisan editorial yang konsisten dari proposal sampai MVP, dengan **opacity sangat rendah** supaya tidak mengganggu keterbacaan teks/UI. Bukan dekorasi keras — sebatas tekstur kertas.

## Implementasi (presentational, satu file)

### 1. Komponen baru: `EditorialFrame`

Wrapper opsional yang membungkus `<section>` content. Render absolute children: grain + corner ticks + watermark, semua `pointer-events:none` dan di belakang konten (z-index relative).

```tsx
<EditorialFrame
  tone="light" | "dark"           // pilih warna ticks/watermark
  intensity="subtle" | "soft" | "feature"
  watermark="cup" | "wordmark" | "none"
  watermarkPos="br" | "bl" | "tr" | "tl"  // default br
>
  ...children...
</EditorialFrame>
```

Mapping intensity → nilai konkret:
- `subtle`: grain 0.03, ticks opacity 0.10, watermark opacity 0.025
- `soft`: grain 0.05, ticks 0.18, watermark 0.04
- `feature`: grain 0.09, ticks 0.30, watermark 0.05 (untuk section dramatik dark)

`EditorialFrame` membungkus konten dengan `position: relative; overflow: hidden` dan menambahkan satu `<div style={{ position:"relative", zIndex:1 }}>` untuk children agar tidak tertimpa overlay. Section yang dipakai sudah `position: relative` → tidak break layout existing.

### 2. Pemakaian di proposal (samakan tone)

Pakai `EditorialFrame intensity="subtle"` di section terang (Letter, Gap, Pillars, Traktir, Global, Colophon, "Kenapa Sekarang") — watermark `cup` kecil di pojok kanan bawah `tone="light"` (variant dark logo, opacity ≤0.04).

Section dark dramatik (Hero, Reframe, CTA) **upgrade** dari dekorasi manual sekarang ke `EditorialFrame intensity="feature" tone="dark" watermark="cup"` — hapus `<GrainOverlay>` & `<CornerTicks>` & watermark manual yang ada untuk hindari duplikasi (Reframe sudah punya watermark besar — biarkan watermark besar custom-nya, set `watermark="none"` agar tidak dobel, tetap ambil grain+ticks dari frame).

Footer: ganti grain manual jadi `EditorialFrame intensity="soft" tone="dark" watermark="none"` (footer sudah punya logo besar di kontennya).

### 3. Pemakaian di MVP (lebih halus, jaga keterbacaan)

App shell (mode === "app", `<div maxWidth: 420 ...>`):
- Tambah satu lapis grain `intensity="subtle"` (opacity 0.025) sebagai overlay di luar `appRef` (di bawah AppTopBar dan bottom nav, behind content) → membuat seluruh kanvas app punya tekstur kertas yang sama dengan proposal.
- Tambah corner ticks tipis di shell (opacity 0.10, color `${C.softBrown}`) → memperkuat kesan kartu editorial.
- TIDAK menyentuh tiap screen (Home, Pesan, dll.) supaya komponen UI (form, list, harga) tetap bersih dan kontras.

Splash transition: sudah punya grain — tambah ticks `${C.cream}20` agar konsisten dengan section dark.

### 4. Aturan keterbacaan

- Semua overlay `pointerEvents: "none"` dan `mixBlendMode: "overlay"` (sudah default `GrainOverlay`).
- Nilai opacity dipatok di range [0.025–0.09] grain, [0.10–0.30] ticks, [0.025–0.05] watermark — tidak boleh lebih tinggi tanpa diskusi ulang.
- Watermark di `tone="light"` pakai logo dark dengan opacity ≤0.04 → secara visual jadi shading hangat, tidak berbentuk tegas yang mengganggu mata.
- Tidak ada overlay di area MVP screen content (cukup di shell) supaya angka, harga, dan tombol tetap jelas.

### 5. Refactor minor

- Pindahkan `GrainOverlay` & `CornerTicks` (sudah ada) menjadi internal helper `EditorialFrame`. Tetap export keduanya in-file (mungkin masih dipakai di splash). 
- Tambah util `Watermark({ tone, pos, opacity })` yang me-render `<TukuLogo>` cup-only besar (size 240 mobile / 420 desktop via clamp) dengan `position: absolute`.

## Non-goals

- Tidak menambah library/animasi.
- Tidak mengubah konten teks, urutan section, atau warna semantik.
- Tidak menerapkan watermark pada tiap screen MVP — hanya shell.

## Verifikasi

- `bunx tsc --noEmit` lulus.
- Cek visual:
  - Scroll proposal: tiap section punya grain+ticks halus yang seragam, watermark tidak mendominasi background.
  - MVP shell: ada tekstur kertas konsisten, tapi konten (list pesanan, harga, form) tetap tajam.
  - Mode dark (Hero/Reframe/CTA/splash/footer): ticks & grain terlihat tapi tidak menutupi headline.

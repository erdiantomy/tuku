## Tujuan

1. Pasang logo TUKU (handmade bucket + wordmark) di section yang relevan — masthead proposal, splash app, header app, paspor card, footer.
2. Naikkan keseluruhan rasa visual proposal (NarrativeHero → Footer) dan layar MVP jadi *editorial cinematic*: tipografi lebih dramatis, framing magazine, separator chapter, tonal kontras gelap-terang, sinematik full-bleed, grain halus.

## Aset

- Salin `user-uploads://IMG_0651-2.png` → `src/assets/tuku-logo-dark.png` (logo hitam untuk background terang).
- Salin `user-uploads://IMG_0652-2.png` → `src/assets/tuku-logo-light.png` (logo putih untuk background gelap).
- Buat komponen `<TukuLogo variant="dark" | "light" size={...} />` di file yang sama (pakai `<img>` import ES6).

## Penempatan logo

| Lokasi | Varian | Ukuran |
|---|---|---|
| `Masthead` baru di top proposal (sticky, transparan→solid setelah scroll) | dark | wordmark 28px |
| `NarrativeHero` di atas headline | dark | logo+wordmark 96px |
| `NarrativeReframe` (background gelap) sebagai watermark besar di kanan bawah, opacity 0.06 | light | 480px |
| Splash transition (mode "transition") menggantikan ☕ emoji | light | logo 120px dengan halo |
| App header bar baru di phone frame (di atas konten masing-masing screen) | dark | wordmark kecil 22px + label "Rukun Tetangga Digital" |
| `AppPaspor` kartu identitas — watermark logo di pojok | light | 80px opacity 0.18 |
| Footer | light | logo 56px tengah |

Tidak menambah logo di header AppHome lama (ada teks "Halo, Andi 👋"). Header app baru tampil di atas semua tab kecuali ChatDetail (yang punya header sendiri).

## Editorial / cinematic upgrades (proposal)

### Global
- **Magazine masthead bar** sticky di paling atas: kiri = `<TukuLogo>` + tagline "EDISI 01 · RUKUN TETANGGA DIGITAL"; kanan = "PROPOSAL · 2026". Latar kremasi semi-transparan dengan blur saat di-scroll.
- **Chapter dividers**: tiap section narrative didahului penanda numerik besar serif italic — `I`, `II`, `III`, … di pinggir kiri (margin) seperti coffee table book.
- **Grain overlay** halus (SVG noise data-uri) jadi ::after pada section gelap supaya terasa film.
- **Vertikal rhythm dinaikkan**: padding section 140–180px, max-width body 720, headline boleh sampai clamp(56px, 10vw, 132px).
- **Drop cap** Playfair pada paragraf pertama tiap surat/section panjang.
- **Pull quote treatment**: italic Playfair besar (clamp 32–56px) dengan tanda kutip raksasa berwarna `C.aren` di belakang.
- **Cinematic frame**: section gelap pakai inset border 1px `${C.cream}15` + corner ticks (4 garis pendek di sudut) ala film slate.
- **Eyebrow chapter**: `Label` dipertahankan tapi ditambah nomor chapter monospace di sebelahnya (`CH·02 — YANG KAMI AMATI`).

### Section per section
1. **NarrativeHero** — full-bleed cream→warmWhite gradient, logo besar di atas, headline naik ke clamp(56,10vw,140), tambah "issue plate" kecil bawah headline ("VOL.01 / OKT 2026 / JAKARTA → AMSTERDAM"). Scroll cue dengan garis vertikal animated.
2. **NarrativeLetter** — drop cap "S" pada paragraf pertama; tanda tangan handwriting Caveat di akhir ("— hormat kami,") + paraf garis. Garis kerangka serbet di samping.
3. **NarrativeGap** — angka "80%" diperbesar jadi numeral display (clamp 120–220px) sebagai latar di belakang teks.
4. **NarrativeReframe** — background `C.coffee` dengan watermark logo TUKU light raksasa kanan bawah; pull quote Starbucks vs TUKU dibingkai ganda.
5. **NarrativePillars** — kartu pilar diubah jadi editorial "spread": nomor besar (01/02/03) sebagai numeral background card; gambar kotak duotone (hanya CSS gradient + ikon emoji besar di tengah lingkaran texture). Tata kolom asimetris pada desktop.
6. **NarrativeTraktir** — pull quote ala majalah, kutipan barista jadi "callout box" dengan tepi double border.
7. **NarrativeGlobal** — peta minimalis SVG titik Cipete↔Amsterdam (sudah punya world map di ExpeditionMap; reuse style sederhana). Ada timestamp baris ("07.42 WIB · CIPETE — 02.42 CET · AMSTERDAM").
8. **NarrativeCTA** — background gelap, logo light di atas tombol, tombol jadi outlined dengan tipografi serif ("Open the door" + sub Indonesia), micro-credit di bawah.
9. **Closing sections** — tambah **colophon** ala buku: typeface, palette swatch, tahun, dengan logo light kecil. Footer pakai layout 3 kolom mini: logo · credit · year.

### Layar MVP (app)

- Masukkan **ApplicationFrame** baru: bar atas berisi logo + nama tab aktif (uppercase tracking lebar) di dalam phone frame, mengganti tombol "← Proposal" lama (tombol dipindah ke kiri bar). Latar bar `C.snow` dengan border bawah hairline.
- Tipografi tab judul dinaikkan jadi serif italic (Playfair italic 14) berdampingan dengan eyebrow uppercase tipis.
- Splash transition: gradient radial coffee→hitam, logo light pulse, garis loader tipis horizontal bergeser kanan.
- Kartu Paspor (AppPaspor header gradient) tambah watermark logo light dan ticket-edge perforation kecil di kiri/kanan untuk feel boarding pass sinematik.
- Tab nav: ikon active dapat underline tipis aren + label uppercase tracking 1.5; tombol tengah Traktir tetap, halo pulse halus.
- Cerita header dapat eyebrow "CHAPTER · BATCH AKTIF" + numeral besar di pojok.

### Penambahan utility

- Tambah komponen kecil di file yang sama:
  - `Masthead`
  - `ChapterMarker` (angka romawi serif italic + garis tipis)
  - `PullQuote`
  - `GrainOverlay` (absolute positioned div with SVG noise)
  - `Colophon`
  - `AppTopBar`

Tidak ada perubahan business logic / data / routing. Hanya presentasi.

## Catatan teknis

- Asset dipakai via `import logoDark from "@/assets/tuku-logo-dark.png"`.
- Tidak menambah dependency baru. Semua animasi pakai keyframes inline `<style>`.
- Pertahankan kontras AA: warna teks tetap `C.coffee/coffeeMid` di terang, `C.cream/arenGlow` di gelap.
- Edit terbatas pada `src/routes/index.tsx` + 2 file aset baru di `src/assets/`.

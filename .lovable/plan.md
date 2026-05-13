
## Tujuan

Tambahkan kartu ringkasan kecil di atas halaman Cerita (di bawah header "Cerita Kopi", sebelum kartu profil Petani) yang merangkum batch aktif: kota asal, tanggal panen, dan profil perajin (petani kopi + perajin gula aren).

## Perubahan

Semua di `src/routes/index.tsx`, dalam komponen `AppCerita` saja. Murni UI/presentational.

### 1. Data turunan dari batch aktif

Di dalam `AppCerita`, tambahkan turunan dari `item` (sudah ada):
- `origin` — kota asal kopi. Diambil dari `FARMER.region` (default "Takengon, Aceh") dengan override per batch via field opsional baru di MENU jika label menyiratkan asal lain (mis. Cold Drip → "Ende, Flores", Robusta → "Lampung"). Tetap memakai `FARMER.region` sebagai default.
- `harvest` — `FARMER.harvest` ("Januari 2026") sebagai default.
- `farmerName` — `FARMER.name`.
- `sugarName` — "Mang Ade" / Cianjur (sudah hardcoded di section gula aren).

Untuk menjaga konsistensi tanpa menambah dependency: tambahkan field opsional `origin` dan `harvest` di tipe `MenuItem` (sudah ada `batchStep`, `batchLabel`). Diisi untuk 4 item kopi:
- Es Kopi Susu Tetangga → origin "Takengon, Aceh", harvest "Januari 2026"
- Kopi Hitam Tetangga → origin "Lampung Barat", harvest "Desember 2025"
- Cappuccino → origin "Takengon, Aceh", harvest "Januari 2026"
- Cold Drip Santai → origin "Ende, Flores", harvest "November 2025"

Default fallback bila tidak ada batch dipilih: Takengon, Aceh · Januari 2026.

### 2. Komponen kartu ringkasan

Diletakkan tepat setelah blok header (setelah `<p>Batch aktif · …</p>`), sebelum kartu Petani Kopi. Layout kompak satu kartu warna parchment dengan border halus:

```text
┌──────────────────────────────────────────────────────┐
│ RINGKASAN BATCH                              [aktif] │
│ ──────────────────────────────────────────────────── │
│ 📍 Takengon, Aceh    📅 Panen Jan 2026               │
│ ──────────────────────────────────────────────────── │
│ 🌿 Pak Ahmad Saleh · Petani Kopi                     │
│ 🌴 Mang Ade · Perajin Gula Aren, Cianjur             │
└──────────────────────────────────────────────────────┘
```

Detail visual:
- Background `C.warmWhite`, border `1px solid ${C.softBrown}25`, radius 14, padding 14, marginBottom 16.
- Eyebrow kecil: "Ringkasan Batch" (uppercase, `C.aren`).
- Dua baris info utama dalam grid 2 kolom: ikon emoji + label uppercase kecil + nilai bold.
- Divider tipis (`${C.softBrown}20`).
- Dua baris perajin: avatar bulat kecil (28px) dengan emoji 🌿 dan 🌴 dan teks nama + peran.
- Tombol/teks halus "Lihat detail ↓" yang scroll ke kartu petani (gunakan `id="batch-petani"` pada kartu petani + `<a href="#batch-petani">`). Opsional ringan, tetap include karena memudahkan.
- Re-mount halus saat batch berubah lewat `key={batchId ?? "default"}` + animasi `batchFade` (sudah didefinisikan di komponen).

### 3. Tidak mengubah hal lain

Header "Cerita Kopi", kartu profil Petani/Perajin, paragraf cerita, dan timeline "Perjalanan kopimu" tetap apa adanya. Tidak ada perubahan tab nav, state global, atau backend.

## Catatan teknis

- Tipe `MenuItem` ditambah dua field opsional: `origin?: string; harvest?: string`.
- Resolver di `AppCerita`:
  - `origin = item?.origin ?? FARMER.region`
  - `harvest = item?.harvest ?? FARMER.harvest`
- Tidak menambah dependency baru, tetap memakai sistem token `C` dan `F`.

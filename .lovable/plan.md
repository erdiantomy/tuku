
## Tujuan

Saat pengguna menekan tautan "🌱 lihat batch ini →" pada item kopi di halaman Pesan, halaman Cerita harus terbuka dengan langkah aktif pada timeline "Perjalanan kopimu" yang disorot sesuai batch yang dipilih (bukan hanya pindah tab).

## Perubahan

Semua di `src/routes/index.tsx` (UI/presentational saja).

### 1. State batch terpilih di tingkat App

- Tambah state `selectedBatchId: string | null` di komponen root tempat `tab`/`setTab` dideklarasikan.
- Buat helper `openBatch(id)` yang men-set `selectedBatchId` lalu `setTab(3)` (Cerita).
- Teruskan `openBatch` ke `<AppOrder />` (menggantikan/melengkapi `goTo` untuk tombol "lihat batch ini").
- Teruskan `selectedBatchId` ke `<AppCerita />`.

### 2. Metadata batch pada MENU

Tiap item kopi di `MENU` diberi dua field opsional:
- `batchStep: number` — indeks langkah aktif (0–4) pada timeline.
- `batchLabel?: string` — label singkat (mis. "Es Kopi Susu Tetangga · Gayo").

Default jika item tidak punya `batchStep`: langkah terakhir ("Diseduh").

Pemetaan awal yang masuk akal:
- Es Kopi Susu Tetangga → step 4 (Diseduh)
- V60 / pour-over single origin → step 3 (Di-roast)
- Cold brew batch baru → step 2 (Diproses)
- House blend musim panen baru → step 1 (Dipanen)

### 3. AppOrder

- Tombol "🌱 lihat batch ini →" memanggil `openBatch(item.id)` alih-alih `goTo(3)`.

### 4. AppCerita — highlight langkah aktif

- Terima props `batchId?: string`.
- Resolve `item = MENU.find(...)`; tentukan `activeStep = item?.batchStep ?? 4` dan `headerSub = item?.batchLabel ?? "Es Kopi Susu Tetangga"`.
- Subjudul header diubah jadi: `Batch aktif · {headerSub}`.
- Pada timeline (array 5 langkah saat ini), tiap baris dirender sesuai status:
  - `i < activeStep` → "completed": lingkaran terisi `C.leaf`, ikon diganti centang kecil tetap menampilkan emoji asli di bawah, garis penghubung warna `C.leaf`.
  - `i === activeStep` → "active": lingkaran lebih besar (44×44), background `C.aren`, ikon putih, ring/halo lembut (`box-shadow: 0 0 0 4px ${C.aren}25`), label memakai warna `C.aren` + bold, sub-deskripsi penuh, ditambah chip kecil "Sekarang".
  - `i > activeStep` → "upcoming": lingkaran outline tipis, opacity 0.5, label/sub muted.
- Garis penghubung antar langkah ikut warna: solid `C.leaf` sebelum/at active, dashed `C.softBrown` setelahnya.
- Animasi ringan: keyframe `fadeIn` pada item active saat `batchId` berubah (gunakan `key={batchId}` di kontainer timeline supaya re-mount halus).

### 5. Tidak ada perubahan logika bisnis lain

Tidak menyentuh data backend, tidak menambah dependensi, tidak mengubah struktur navigasi tab. Hanya state UI + render highlight.

## Catatan teknis

```text
[Pesan] item.id ──openBatch──▶ root state ──prop──▶ [Cerita]
                                                   └─▶ Perjalanan kopimu
                                                       langkah aktif disorot
```

Setelah perubahan, membuka Cerita lewat tab nav (tanpa menekan "lihat batch ini") tetap menampilkan default (langkah terakhir aktif) sehingga halaman tidak pernah tampak kosong.

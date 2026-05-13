
## Tujuan

Tambahkan kontrol filter kota (Semua / Nusantara / Global) dan input pencarian toko di sub-tab Paspor. Hasil filter berlaku konsisten untuk Peta Ekspedisi dan kartu "Jejak Tetangga Berkunjung".

## Scope

Semua perubahan di `src/routes/index.tsx`, dalam komponen `AppPaspor` + `ExpeditionMap`. UI/state lokal saja, tanpa backend, tanpa router/search params.

## Implementasi

### 1. State filter di `AppPaspor`

Tambahkan dua state lokal:

- `region: "all" | "nusantara" | "global"` (default `"all"`)
- `query: string` (default `""`)

Klasifikasi region berdasar `flag`: `🇮🇩` → Nusantara, lainnya → Global.

Hitung `filteredCities` (memo):
- Filter region dulu (kecuali `all`).
- Untuk tiap kota, filter `stores` berdasarkan `q = query.trim().toLowerCase()` cocok dengan `store.name.toLowerCase()` ATAU `city.toLowerCase()` (agar query "jak" tetap menampilkan kota Jakarta beserta semua tokonya).
- Buang kota yang `stores` kosong setelah filter (saat ada query) supaya hasilnya bersih.
- Saat `query` kosong: semua toko kota tersangkut tetap ditampilkan.

### 2. UI kontrol di atas Peta Ekspedisi

Sisipkan blok kontrol di sub-tab Paspor, **tepat sebelum** `<ExpeditionMap />`, di bawah section "Ekspedisi Tetangga".

Layout (kompak, satu kartu):

```text
┌──────────────────────────────────────────────┐
│ [🔎  Cari toko atau kota …          ✕]       │
│ ( Semua )  ( 🇮🇩 Nusantara )  ( 🌍 Global )    │
└──────────────────────────────────────────────┘
```

- Input search: `<input>` styled (background `C.parchment`, radius 10, padding kiri untuk ikon 🔎). Tombol clear "✕" muncul saat ada query.
- Segmented chips region (3 tombol pill): aktif → background `C.coffee` text `C.cream`; non-aktif → background `C.parchment` text `C.coffeeMid`. Mengikuti pola tab cat di `AppOrder`.
- Counter kecil di bawah kontrol: `{n} kota · {m} toko ditemukan` (warna `C.warmGray`, font uppercase 10).

### 3. Hubungkan ke Peta Ekspedisi

`ExpeditionMap` sudah menerima `cities`. Teruskan `filteredCities`:

- Jika hasil kosong → render placeholder dalam kartu peta: ikon 🔎, teks "Tidak ada toko cocok" + tombol "Bersihkan filter" yang panggil callback `onClear` (prop baru opsional).
- Jika hasil non-kosong tetapi `home` (Cipete) ter-filter (mis. region=Global): jangan crash — `home` jatuh ke `cities[0]`. Sembunyikan rute (tidak gambar route lines) saat tidak ada `home` Indonesia di hasil. Logika: `const home = cities.find(c => c.home)`; jika `undefined`, lewati blok rute.
- Saat user sudah membuka City view dan kota tsb hilang akibat filter berubah → reset `selected` ke `null` via `useEffect([cities])`.
- Highlight match di City view: jika `query` cocok dengan nama toko, beri ring tambahan (lingkaran tambahan radius 12 stroke `C.aren` dashed) pada pin yang match. Pin yang tidak match → opacity 0.45.

### 4. Hubungkan ke kartu "Jejak Tetangga Berkunjung"

Render `filteredCities` (bukan `STORES_VISITED` mentah). Jika kosong → tampilkan baris empty state ringkas: "Tidak ada hasil. Coba kata kunci lain atau ganti region."

Highlight ringan teks store yang match query: bungkus substring match dengan `<mark style={{ background: ${C.aren}30, color: C.coffee, padding: "0 2px", borderRadius: 3 }}>`.

### 5. Tidak tersentuh

- Tab nav, screens lain.
- Data `STORES_VISITED` (hanya dibaca-filter).
- Sub-tab Toserbaku.
- ExpeditionMap behavior internal selain prop input + handle empty/`home` undefined + highlight match.

## Catatan teknis

- Tidak menambah dependency.
- Tidak memakai URL search params (di luar scope; UI lokal tab cukup).
- Memo `filteredCities` dengan `useMemo([region, query])`.
- Aksesibilitas: input punya `aria-label="Cari toko atau kota"`; chips region adalah `<button>` dengan `aria-pressed`.

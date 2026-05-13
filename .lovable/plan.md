
## Tujuan

Saat user mengetuk salah satu lencana di section "Lencana Pencapaian" pada Paspor, tampilkan halaman detail (overlay modal) berisi: ikon besar, nama, status, syarat, progres, dan tanggal earned.

## Scope

Semua di `src/routes/index.tsx`, dalam `AppPaspor`. UI/state lokal — tanpa backend.

## Implementasi

### 1. Naikkan data lencana ke konstanta

Pindahkan array inline ke konstanta `BADGES` di luar komponen, dengan tipe lengkap:

```ts
type Badge = {
  id: string;
  icon: string;
  name: string;
  sub?: string;
  desc: string;          // narasi singkat lencana
  req: string;           // syarat raih (1 kalimat)
  current: number;
  target: number;
  unit: string;          // "kunjungan" / "kota" / "traktir" / "batch"
  earned: boolean;
  earnedAt?: string;     // ISO date, hanya untuk earned
};
```

Isi 8 lencana yang sudah ada, contoh nilai (current/target/earnedAt) konsisten dengan `USER`:

- `seruput` ☕ Seruput Pertama — req "Pesan kopi pertamamu" · 1/1 · earned 12 Mar 2023
- `cipete` 🏠 Warga Cipete — req "20 kunjungan ke TUKU rumah" · 147/20 · earned 4 Jul 2023
- `tetangga` 🤝 Tetangga Baik — req "Traktir 10 tetangga" · 12/10 · earned 19 Sep 2024
- `penjelajah` 🗺️ Penjelajah — req "Kunjungi 3 kota berbeda" · 4/3 · earned 5 Feb 2025
- `pelancong` ✈️ Pelancong Global — req "Kunjungi 1 toko di luar negeri" · 1/1 · earned 21 Apr 2025
- `setia100` 💯 Setia 100 — req "100 kunjungan total" · 147/100 → **earned**? Jika current ≥ target → earned otomatis (auto-derive). Tapi tampilan saat ini "5/8 terkumpul" dan ini ditandai `earned: false`. Untuk mempertahankan tampilan: tetap `earned: false` di prototype, anggap badge ini "naik kelas" → ubah `target` jadi 200 supaya konsisten (147/200, belum earned).
- `petani` 🌱 Sahabat Petani — req "Pesan dari 5 batch petani berbeda" · 2/5
- `sesepuh` 👑 Sesepuh — req "Kunjungi semua kota TUKU (71)" · 6/71

Counter "5 dari 8 terkumpul" dihitung dari `BADGES.filter(b => b.earned).length`.

### 2. State + interaksi di `AppPaspor`

Tambahkan state lokal: `selectedBadge: string | null`.

Di grid lencana, ubah tiap cell jadi `<button>` (all-unset, cursor pointer) dengan `onClick={() => setSelectedBadge(b.id)}` dan `aria-label`. Sisanya tampilan tetap (ikon, name, sub).

### 3. Komponen overlay `BadgeDetail`

Modal positioned `position: absolute` di dalam frame app (parent sudah `position: relative` via container max-w 420). Tidak `position: fixed` global supaya overlay tetap di dalam mockup HP.

Layout:

- Backdrop semi-transparan `${C.coffee}55` dengan `backdropFilter: blur(2px)`. Click → close.
- Card panel: bottom-sheet style — `position: absolute`, bottom 0, left 0, right 0, radius top 20, background `C.snow`, padding 22, max-height 80%, overflow-y auto. Slide-up animation.
- Tombol close "✕" pojok kanan atas.
- Header:
  - Ikon besar 64px dalam lingkaran 88px (background `${C.aren}20` jika earned, `${C.softBrown}20` jika belum). Earned diberi efek halo (`box-shadow: 0 0 0 6px ${C.aren}25`).
  - Nama lencana (display font 22, bold).
  - Chip status: "✓ Sudah diraih" warna leaf (jika earned) atau "🔒 Belum" warna warmGray.
- Section "Syarat" — paragraf `req` dengan eyebrow uppercase kecil "SYARAT".
- Section "Progres" — bar progres (height 9, radius 999, background parchment, fill `C.aren`/`C.leaf` jika earned). Label di atas bar: `{current}/{target} {unit}` + persentase di kanan. Cap visual 100% jika current ≥ target.
- Section "Tanggal" — jika earned: 📅 + format Indonesia (`tgl bulan tahun`, contoh "21 April 2025") menggunakan `Date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })`. Jika belum: tampilan estimatif "Berikutnya: butuh {target - current} {unit} lagi".
- CTA bawah:
  - Earned → tombol sekunder "Tutup".
  - Belum → tombol utama warna aren "Lanjutkan ekspedisi" yang menutup modal (placeholder, tidak navigate ke tab lain agar scope kecil).
- ESC key untuk close (`useEffect` keydown listener).

### 4. Animasi

Tambah `<style>` dalam komponen modal:

```text
@keyframes badgeIn { from { transform: translateY(20px); opacity: 0 } to { transform: none; opacity: 1 } }
@keyframes backdropIn { from { opacity: 0 } to { opacity: 1 } }
```

Backdrop pakai `backdropIn 0.2s`, panel pakai `badgeIn 0.28s ease`.

### 5. Tidak diubah

- Layout grid lencana, posisi section.
- Sub-tab Toserbaku, peta, filter, dll.

## Catatan teknis

- Tidak tambah dependency.
- Karena container app sudah `position: relative` dengan `overflow-y: auto`, modal `position: absolute; inset: 0;` cukup. Pastikan `z-index` lebih tinggi dari nav bawah.
- Jika user pindah sub-tab atau tab utama, modal otomatis unmount karena state lokal `AppPaspor`.

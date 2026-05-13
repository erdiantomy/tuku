import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback, type ReactNode, type CSSProperties } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TUKU — Rukun Tetangga Digital" },
      { name: "description", content: "Membawa jiwa tetangga ke dunia digital — dari Cipete hingga Amsterdam." },
      { property: "og:title", content: "TUKU — Rukun Tetangga Digital" },
      { property: "og:description", content: "Proposal + Interactive MVP untuk Kopi Tuku." },
    ],
  }),
  component: TukuRukunTetangga,
});

/* ═══════════════════════════════════════════════════════
   TUKU — RUKUN TETANGGA DIGITAL
   Proposal + Interactive MVP
   ═══════════════════════════════════════════════════════ */

const C = {
  cream: "#F5F0E8", warmWhite: "#FAF7F2", snow: "#FDFBF7",
  coffee: "#3C2415", coffeeMid: "#5C3D2E", coffeeLight: "#7A5C4F",
  aren: "#C4943B", arenLight: "#D4A84B", arenGlow: "#E8C878", arenSoft: "#C4943B20",
  leaf: "#4A6741", leafLight: "#6B8F62", leafSoft: "#4A674115",
  warmGray: "#9C8E82", softBrown: "#B8A898", parchment: "#EDE6D8",
  white: "#FFFFFF",
};

const F = {
  d: "'Playfair Display', serif",
  h: "'Caveat', cursive",
  b: "'Source Serif 4', serif",
  u: "'DM Sans', sans-serif",
};

// ── Shared Components ──

function Fade({ children, className, delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Dots() {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "32px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: C.aren, opacity: 0.5 }} />
      ))}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <div style={{ fontFamily: F.u, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.aren, marginBottom: 14 }}>{children}</div>;
}

function Badge({ children, color = C.aren }: { children: ReactNode; color?: string }) {
  return <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 999, background: color + "20", color, fontFamily: F.u, fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>{children}</span>;
}

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

// ── Mock Data ──
const USER = { name: "Andi", rumah: "TUKU Cipete", since: "2023", visits: 147, traktirGiven: 12, citiesVisited: 4 };
const STORES_VISITED = [
  { city: "Jakarta", stores: ["Cipete", "Kemang", "GBK", "Jatinegara"], flag: "🇮🇩" },
  { city: "Bandung", stores: ["Ambon"], flag: "🇮🇩" },
  { city: "Surabaya", stores: ["Darmo"], flag: "🇮🇩" },
  { city: "Amsterdam", stores: ["Centrum"], flag: "🇳🇱" },
];
const MENU = [
  { id: 1, name: "Es Kopi Susu Tetangga", price: 22000, cat: "coffee", desc: "Signature. Espresso + susu + gula aren", pop: true },
  { id: 2, name: "Kopi Hitam Tetangga", price: 18000, cat: "coffee", desc: "Iced black. Robusta murni." },
  { id: 3, name: "Cappuccino", price: 28000, cat: "coffee", desc: "Classic, creamy, warm" },
  { id: 4, name: "Cold Drip Santai", price: 32000, cat: "coffee", desc: "12-hour slow drip" },
  { id: 5, name: "Es Teh Susu Tetangga", price: 18000, cat: "non", desc: "Teh tarik khas TUKU" },
  { id: 6, name: "Teh Asam Jawa", price: 16000, cat: "non", desc: "Segar, asam manis" },
  { id: 7, name: "Donat Kampung", price: 12000, cat: "food", desc: "Donat klasik, empuk" },
  { id: 8, name: "Bolu Piscok", price: 15000, cat: "food", desc: "Pisang cokelat homemade" },
];
const FARMER = {
  name: "Pak Ahmad Saleh", region: "Takengon, Aceh", alt: "1.400 mdpl",
  harvest: "Januari 2026", var: "Arabika Gayo — Catimor & Typica", proc: "Full Washed",
  story: "Pak Ahmad menanam kopi sejak 1989. Kebunnya seluas 2 hektar di lereng Gunung Gayo. Musim panen tahun ini menghasilkan biji dengan karakter citrus dan cokelat — salah satu batch terbaik dalam 5 tahun.",
  sugar: "Mang Ade — Perajin Gula Aren, Cianjur",
};
const KABAR = [
  { icon: "🎉", title: "Coffee Tasting Sabtu Ini", desc: "TUKU Cipete undang tetangga icip kopi baru dari Flores. Gratis.", time: "2 jam" },
  { icon: "💪", title: "Gotong Royong: 87/100", desc: "13 lagi → Barista Workshop gratis bulan ini!", time: "hari ini" },
  { icon: "🤝", title: "3 Kopi Tersedia", desc: "Tetangga baik meninggalkan 3 gelas. Siapa cepat, dia dapat.", time: "30 min" },
  { icon: "🌱", title: "Panen Baru: Flores Ende", desc: "Biji dari Bu Maria di Ende. Notes: dark chocolate, rempah.", time: "kemarin" },
];
const MERCH = [
  { name: "Tumbler TUKU", price: 175000, icon: "🥤" },
  { name: "Tasting Cup Lanyard", price: 99000, icon: "☕" },
  { name: "Coaster Ampas Kopi", price: 50000, icon: "🪵" },
  { name: "Kaus TENCEL TUKU", price: 190000, icon: "👕" },
  { name: "Biji Tetangga Blend 250g", price: 193000, icon: "🫘" },
  { name: "TUKUCUR 1 Liter", price: 85000, icon: "🧴" },
];

// ═══════════════════════════════════════════════════════
// NARRATIVE SECTIONS
// ═══════════════════════════════════════════════════════

function NarrativeHero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 24px", background: `linear-gradient(180deg, ${C.cream} 0%, ${C.warmWhite} 100%)`, textAlign: "center" }}>
      <Fade>
        <Label>sebuah undangan untuk bertetangga</Label>
      </Fade>
      <Fade delay={200}>
        <h1 style={{ fontFamily: F.d, fontSize: "clamp(48px, 9vw, 104px)", fontWeight: 700, color: C.coffee, lineHeight: 1.05, margin: "12px 0 28px", letterSpacing: -1.5 }}>
          Rukun Tetangga<br />
          <span style={{ fontStyle: "italic", color: C.aren }}>Digital</span>
        </h1>
      </Fade>
      <Fade delay={400}>
        <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, maxWidth: 580, lineHeight: 1.6, margin: 0 }}>
          Membawa jiwa tetangga ke dunia digital — dari Cipete hingga Amsterdam.
        </p>
      </Fade>
      <Fade delay={800}>
        <div style={{ marginTop: 80, fontFamily: F.h, fontSize: 18, color: C.warmGray }}>gulir ke bawah ↓</div>
      </Fade>
    </section>
  );
}

function NarrativeLetter() {
  return (
    <section style={{ padding: "120px 24px", background: C.warmWhite }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Fade><Label>Surat untuk Tetangga</Label></Fade>
        <Fade delay={150}>
          <p style={{ fontFamily: F.h, fontSize: 32, color: C.coffee, lineHeight: 1.4, margin: "0 0 32px" }}>Mas Tyo,</p>
        </Fade>
        <Fade delay={300}>
          <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8, marginBottom: 24 }}>
            Sepuluh tahun lalu, dari kios 16 meter persegi di Cipete, kamu mulai sesuatu yang sederhana: kopi enak, harga terjangkau, buat semua orang.
          </p>
        </Fade>
        <Fade delay={450}>
          <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8, marginBottom: 24 }}>
            Hari ini — 72 toko. 1.040 barista. 78.000 gelas per hari. 630 petani kopi. Satu nama stasiun MRT. Dan satu toko baru di Amsterdam.
          </p>
        </Fade>
        <Fade delay={600}>
          <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8, marginBottom: 24 }}>
            Tapi yang paling berharga bukan angkanya. Yang paling berharga adalah kata <em style={{ color: C.aren, fontStyle: "italic" }}>"tetangga."</em>
          </p>
        </Fade>
        <Fade delay={750}>
          <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8 }}>
            Ini tentang bagaimana membawa jiwa itu ke tempat yang belum dijelajahi — dunia digital. Dengan cara yang hanya TUKU bisa.
          </p>
        </Fade>
        <Dots />
      </div>
    </section>
  );
}

function NarrativeGap() {
  return (
    <section style={{ padding: "120px 24px", background: C.cream }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Fade><Label>Yang Kami Amati</Label></Fade>
        <Fade delay={150}>
          <h2 style={{ fontFamily: F.d, fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, color: C.coffee, lineHeight: 1.1, margin: "12px 0 36px", letterSpacing: -1 }}>
            80% tetangga TUKU<br />
            <span style={{ fontStyle: "italic", color: C.aren }}>tidak terlihat.</span>
          </h2>
        </Fade>
        <Fade delay={300}>
          <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8, marginBottom: 22 }}>
            Mereka datang. Minum Es Kopi Susu Tetangga. Tersenyum ke barista. Dan pergi.
          </p>
        </Fade>
        <Fade delay={450}>
          <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8, marginBottom: 22 }}>
            TUKU tidak punya cara menyapa mereka lagi. Tidak ada data. Tidak ada koneksi lanjutan.
          </p>
        </Fade>
        <Fade delay={600}>
          <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8 }}>
            Mereka mencintai TUKU — tapi TUKU belum bisa membalas cinta itu secara digital. Kartu Rukun Tetangga sudah ada. Namanya sempurna. Jiwanya benar. Tapi infrastrukturnya belum mencerminkan kebesaran visinya.
          </p>
        </Fade>
      </div>
    </section>
  );
}

function NarrativeReframe() {
  return (
    <section style={{ padding: "120px 24px", background: C.coffee, color: C.cream }}>
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <Fade>
          <Label>Pergeseran</Label>
        </Fade>
        <Fade delay={150}>
          <p style={{ fontFamily: F.d, fontSize: "clamp(28px, 4vw, 40px)", color: C.cream, lineHeight: 1.3, margin: "12px 0 40px", opacity: 0.7 }}>
            Setiap brand kopi di dunia membangun<br />
            <span style={{ fontStyle: "italic" }}>loyalty program.</span>
          </p>
        </Fade>
        <Fade delay={400}>
          <h2 style={{ fontFamily: F.d, fontSize: "clamp(36px, 6vw, 64px)", color: C.arenGlow, lineHeight: 1.15, margin: "0 0 48px", letterSpacing: -1, fontWeight: 700 }}>
            TUKU bisa membangun yang belum pernah ada:<br />
            <span style={{ fontStyle: "italic" }}>sebuah rukun tetangga.</span>
          </h2>
        </Fade>
        <Fade delay={650}>
          <p style={{ fontFamily: F.h, fontSize: 26, color: C.cream, opacity: 0.8, marginBottom: 12 }}>
            Starbucks memberi reward karena kamu belanja.
          </p>
          <p style={{ fontFamily: F.h, fontSize: 30, color: C.arenGlow, fontWeight: 600 }}>
            TUKU memberi reward karena kamu tetangga yang baik.
          </p>
        </Fade>
      </div>
    </section>
  );
}

function NarrativePillars() {
  const pills = [
    { n: "01", icon: "🏠", t: "Rumah", sub: "Your store. Your people.", desc: "Setiap tetangga punya 'rumah' — toko TUKU-nya. Bukan sekadar lokasi, tapi komunitas kecil. Kamu kenal baristanya. Ada event khusus untuk warganya. Dan ketika berkunjung ke TUKU di kota lain — kamu bukan orang asing. Kamu tetangga berkunjung." },
    { n: "02", icon: "📖", t: "Cerita", sub: "Every cup tells a story.", desc: "630 petani. 275 perajin gula aren. Hubungan langsung yang tidak dimiliki brand manapun. Bayangkan setiap gelas terhubung ke cerita nyata — siapa petaninya, dari mana, bagaimana panen tahun ini. Commerce menjadi narasi." },
    { n: "03", icon: "🤝", t: "Gotong Royong", sub: "The neighborhood helps each other.", desc: "Pilar paling berani. Mekanisme sosial, bukan transaksional. Tetangga mentraktir tetangga. Komunitas satu toko unlock pengalaman bersama. Kebaikan jadi currency. Ini bukan loyalty — ini gotong royong digital." },
  ];
  return (
    <section style={{ padding: "120px 24px", background: C.warmWhite }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <Fade><Label>Tiga Pilar</Label></Fade>
          <Fade delay={150}>
            <h2 style={{ fontFamily: F.d, fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 700, color: C.coffee, lineHeight: 1.1, margin: "12px 0 0", letterSpacing: -1 }}>
              Arsitektur<br />
              <span style={{ fontStyle: "italic", color: C.aren }}>Rukun Tetangga Digital</span>
            </h2>
          </Fade>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
          {pills.map((p, i) => (
            <Fade key={p.n} delay={i * 150}>
              <div style={{ background: C.snow, borderRadius: 20, padding: 36, border: `1px solid ${C.softBrown}25`, height: "100%", boxSizing: "border-box" }}>
                <div style={{ fontFamily: F.u, fontSize: 12, fontWeight: 700, color: C.aren, letterSpacing: 2, marginBottom: 16 }}>{p.n}</div>
                <div style={{ fontSize: 44, marginBottom: 16 }}>{p.icon}</div>
                <h3 style={{ fontFamily: F.d, fontSize: 28, fontWeight: 700, color: C.coffee, margin: "0 0 6px" }}>{p.t}</h3>
                <p style={{ fontFamily: F.h, fontSize: 18, color: C.aren, margin: "0 0 18px" }}>{p.sub}</p>
                <p style={{ fontFamily: F.b, fontSize: 15.5, color: C.coffeeMid, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function NarrativeTraktir() {
  return (
    <section style={{ padding: "120px 24px", background: `linear-gradient(180deg, ${C.cream} 0%, ${C.parchment} 100%)` }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Fade><Label>Yang Akan Dibicarakan Dunia</Label></Fade>
        <Fade delay={150}>
          <h2 style={{ fontFamily: F.d, fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, color: C.coffee, lineHeight: 1.1, margin: "12px 0 32px", letterSpacing: -1 }}>
            Traktir <span style={{ fontStyle: "italic", color: C.aren }}>Tetangga</span>
          </h2>
        </Fade>
        <Fade delay={300}>
          <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8, marginBottom: 22 }}>
            Konsep <em>suspended coffee</em> dari Napoli — dibawa ke era digital, dengan jiwa Indonesia.
          </p>
        </Fade>
        <Fade delay={450}>
          <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8, marginBottom: 22 }}>
            Seseorang beli kopi untuk orang yang belum dikenal. Tukang ojek, mahasiswa, siapapun. Di layar barista: <em style={{ color: C.coffee }}>"Ada 3 kopi dari tetangga baik hari ini."</em>
          </p>
        </Fade>
        <Fade delay={600}>
          <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8, marginBottom: 36 }}>
            Dan bayangkan ini di Amsterdam — Indonesian kindness, dalam secangkir kopi, di jantung Eropa.
          </p>
        </Fade>
        <Fade delay={750}>
          <div style={{ borderLeft: `3px solid ${C.aren}`, paddingLeft: 22, fontFamily: F.h, fontSize: 22, color: C.coffeeMid, lineHeight: 1.5 }}>
            Ini bukan fitur. Ini filosofi yang jadi fitur. Akan diliput. Ditiru. Tapi tidak ada yang bisa meniru dengan jiwa yang sama — karena hanya TUKU yang membangun brand di atas kata "tetangga."
          </div>
        </Fade>
      </div>
    </section>
  );
}

function NarrativeGlobal() {
  return (
    <section style={{ padding: "120px 24px", background: C.warmWhite }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Fade><Label>Dari Cipete ke Dunia</Label></Fade>
        <Fade delay={150}>
          <h2 style={{ fontFamily: F.d, fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 700, color: C.coffee, lineHeight: 1.1, margin: "12px 0 32px", letterSpacing: -1 }}>
            Digital backbone untuk<br />
            <span style={{ fontStyle: "italic", color: C.aren }}>ekspansi global</span>
          </h2>
        </Fade>
        <Fade delay={300}>
          <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8, marginBottom: 22 }}>
            Amsterdam buka. Bali segera. Target 100 toko. Setiap kota baru butuh infrastruktur digital yang menyatukan — tanpa kehilangan rasa lokal.
          </p>
        </Fade>
        <Fade delay={450}>
          <p style={{ fontFamily: F.h, fontSize: 24, color: C.aren, lineHeight: 1.5 }}>
            Tetangga dari Cipete liburan di Amsterdam, buka app: "Selamat datang, Tetangga Berkunjung. Barista hari ini: Anna."
          </p>
        </Fade>
      </div>
    </section>
  );
}

function NarrativeCTA({ onOpen }: { onOpen: () => void }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => { const i = setInterval(() => setPulse(p => !p), 1800); return () => clearInterval(i); }, []);
  return (
    <section style={{ padding: "140px 24px", background: C.coffee, color: C.cream, textAlign: "center" }}>
      <Fade>
        <p style={{ fontFamily: F.h, fontSize: 32, color: C.arenGlow, marginBottom: 12 }}>
          Sekarang, bayangkan kamu<br />membuka app ini.
        </p>
      </Fade>
      <Fade delay={200}>
        <p style={{ fontFamily: F.b, fontSize: 17, color: C.cream, opacity: 0.7, marginBottom: 56, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Ini bukan mockup. Ini sketsa di serbet — yang bisa kamu sentuh.
        </p>
      </Fade>
      <Fade delay={400}>
        <button onClick={onOpen} style={{
          all: "unset", cursor: "pointer", display: "inline-block",
          background: C.aren, color: C.coffee, padding: "20px 44px",
          borderRadius: 999, fontFamily: F.u, fontSize: 17, fontWeight: 700,
          letterSpacing: 0.5, transform: pulse ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.6s ease", boxShadow: `0 8px 32px ${C.aren}50`,
        }}>
          ☕  Buka Pintunya
        </button>
      </Fade>
      <Fade delay={600}>
        <p style={{ fontFamily: F.h, fontSize: 18, color: C.cream, opacity: 0.5, marginTop: 24 }}>
          tap untuk merasakan Rukun Tetangga Digital
        </p>
      </Fade>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// APP SCREENS (MVP)
// ═══════════════════════════════════════════════════════

function TabIcon({ icon, label, active, onClick, center }: { icon: string; label: string; active: boolean; onClick: () => void; center?: boolean }) {
  return (
    <button onClick={onClick} style={{ all: "unset", cursor: "pointer", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 0" }}>
      {center ? (
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: active ? C.aren : C.coffee, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -16, boxShadow: `0 6px 18px ${C.coffee}40`, transition: "background 0.2s" }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
        </div>
      ) : (
        <div style={{ fontSize: 22, opacity: active ? 1 : 0.4, transition: "opacity 0.2s" }}>
          {icon}
        </div>
      )}
      <span style={{ fontFamily: F.u, fontSize: 10, fontWeight: 600, color: active ? C.coffee : C.warmGray }}>{label}</span>
    </button>
  );
}

function AppHome({ goTo }: { goTo: (n: number) => void }) {
  return (
    <div style={{ padding: "20px 18px 28px" }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: F.u, fontSize: 12, color: C.warmGray, margin: 0 }}>Selamat siang,</p>
        <h2 style={{ fontFamily: F.d, fontSize: 28, color: C.coffee, margin: "2px 0 0", fontWeight: 700 }}>Halo, {USER.name} 👋</h2>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.coffee} 0%, ${C.coffeeMid} 100%)`, borderRadius: 18, padding: 20, color: C.cream, marginBottom: 20 }}>
        <p style={{ fontFamily: F.u, fontSize: 10, opacity: 0.7, margin: 0, letterSpacing: 1.5, textTransform: "uppercase" }}>Rumah saya</p>
        <h3 style={{ fontFamily: F.d, fontSize: 22, margin: "4px 0 6px", fontWeight: 700 }}>🏠 {USER.rumah}</h3>
        <p style={{ fontFamily: F.h, fontSize: 16, color: C.arenGlow, margin: 0 }}>Barista: Rizky & Amel</p>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.cream}20`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: F.d, fontSize: 24, fontWeight: 700, color: C.arenGlow }}>{USER.visits}</div>
            <div style={{ fontFamily: F.u, fontSize: 10, opacity: 0.7 }}>kunjungan</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, overflowX: "auto", marginBottom: 22, paddingBottom: 4 }}>
        {[{ icon: "☕", label: "Pesan", t: 1 }, { icon: "🤝", label: "Traktir", t: 2 }, { icon: "🌱", label: "Cerita", t: 3 }, { icon: "🛍️", label: "Toserbaku", t: 4 }].map((a) => (
          <button key={a.label} onClick={() => goTo(a.t)} style={{
            all: "unset", cursor: "pointer", flex: "0 0 auto", background: C.warmWhite,
            border: `1px solid ${C.softBrown}25`, borderRadius: 13, padding: "12px 18px",
            textAlign: "center", minWidth: 64,
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{a.icon}</div>
            <div style={{ fontFamily: F.u, fontSize: 11, fontWeight: 600, color: C.coffeeMid }}>{a.label}</div>
          </button>
        ))}
      </div>

      <div style={{ background: C.leafSoft, borderRadius: 16, padding: 18, marginBottom: 22, border: `1px solid ${C.leaf}25` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontFamily: F.u, fontSize: 12, fontWeight: 700, color: C.leaf }}>🤝 Gotong Royong Cipete</span>
          <span style={{ fontFamily: F.u, fontSize: 11, color: C.leaf, fontWeight: 600 }}>87 / 100</span>
        </div>
        <div style={{ height: 8, background: C.white, borderRadius: 999, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", width: "87%", background: C.leaf, borderRadius: 999 }} />
        </div>
        <p style={{ fontFamily: F.b, fontSize: 13, color: C.coffeeMid, margin: 0, lineHeight: 1.5 }}>
          13 kunjungan lagi → Barista Workshop gratis untuk warga Cipete!
        </p>
      </div>

      <h3 style={{ fontFamily: F.d, fontSize: 20, color: C.coffee, margin: "0 0 12px", fontWeight: 700 }}>Kabar Tetangga</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {KABAR.map((k, i) => (
          <div key={i} style={{ background: C.warmWhite, borderRadius: 13, padding: 14, border: `1px solid ${C.softBrown}20` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <span style={{ fontFamily: F.u, fontSize: 13, fontWeight: 700, color: C.coffee }}>{k.icon} {k.title}</span>
              <span style={{ fontFamily: F.u, fontSize: 10, color: C.warmGray }}>{k.time}</span>
            </div>
            <p style={{ fontFamily: F.b, fontSize: 13, color: C.coffeeMid, margin: 0, lineHeight: 1.5 }}>{k.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppOrder({ goTo }: { goTo: (n: number) => void }) {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cat, setCat] = useState("coffee");
  const [done, setDone] = useState(false);
  const total = Object.entries(cart).reduce((s, [id, q]) => { const m = MENU.find(x => x.id === +id); return s + (m ? m.price * q : 0); }, 0);
  const cnt = Object.values(cart).reduce((s, q) => s + q, 0);

  if (done) return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 18 }}>✅</div>
      <h2 style={{ fontFamily: F.d, fontSize: 26, color: C.coffee, margin: "0 0 8px", fontWeight: 700 }}>Pesanan Diterima!</h2>
      <p style={{ fontFamily: F.h, fontSize: 20, color: C.aren, marginBottom: 22 }}>Barista Rizky sedang menyiapkan</p>
      <p style={{ fontFamily: F.b, fontSize: 14, color: C.coffeeMid, lineHeight: 1.6, maxWidth: 280, margin: "0 auto 22px" }}>
        Ambil di TUKU Cipete dalam ~8 menit. Langsung bilang namamu.
      </p>
      <div style={{ background: C.leafSoft, padding: "12px 18px", borderRadius: 12, display: "inline-block", border: `1px solid ${C.leaf}25` }}>
        <p style={{ fontFamily: F.b, fontSize: 13, color: C.leaf, margin: 0, fontWeight: 600 }}>🌱 Kopimu dari kebun Pak Ahmad, Takengon</p>
      </div>
      <br />
      <button onClick={() => { setDone(false); setCart({}); }} style={{ all: "unset", cursor: "pointer", marginTop: 20, fontFamily: F.u, fontSize: 13, color: C.aren, fontWeight: 600 }}>← Kembali</button>
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      <div style={{ padding: 18, paddingBottom: cnt > 0 ? 96 : 20 }}>
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontFamily: F.u, fontSize: 11, color: C.aren, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Pesan dari</p>
          <h2 style={{ fontFamily: F.d, fontSize: 24, color: C.coffee, margin: "4px 0 4px", fontWeight: 700 }}>☕ Dapur TUKU Cipete</h2>
          <p style={{ fontFamily: F.b, fontSize: 13, color: C.warmGray, margin: 0 }}>Ambil langsung · ~8 menit</p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["coffee", "Kopi"], ["non", "Non-Kopi"], ["food", "Makanan"]].map(([k, l]) => (
            <button key={k} onClick={() => setCat(k)} style={{ all: "unset", cursor: "pointer", padding: "7px 16px", borderRadius: 18, fontFamily: F.u, fontSize: 12, fontWeight: 600, background: cat === k ? C.coffee : C.parchment, color: cat === k ? C.cream : C.coffeeMid, transition: "all 0.2s" }}>{l}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MENU.filter(m => m.cat === cat).map(item => (
            <div key={item.id} style={{ background: C.warmWhite, borderRadius: 13, padding: 14, border: `1px solid ${C.softBrown}20`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontFamily: F.u, fontSize: 14, fontWeight: 700, color: C.coffee }}>{item.name}</span>
                  {item.pop && <Badge>★</Badge>}
                </div>
                <p style={{ fontFamily: F.b, fontSize: 12, color: C.warmGray, margin: "0 0 4px", lineHeight: 1.4 }}>{item.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <p style={{ fontFamily: F.u, fontSize: 13, color: C.aren, fontWeight: 700, margin: 0 }}>{fmt(item.price)}</p>
                  {item.cat === "coffee" && (
                    <button onClick={() => goTo(3)} style={{ all: "unset", cursor: "pointer", fontFamily: F.u, fontSize: 11, fontWeight: 600, color: C.leaf, borderBottom: `1px dashed ${C.leaf}80` }}>
                      🌱 lihat batch ini →
                    </button>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {cart[item.id] > 0 && (
                  <>
                    <button onClick={() => setCart(p => { const n = { ...p }; if (n[item.id] > 1) n[item.id]--; else delete n[item.id]; return n; })} style={{ all: "unset", cursor: "pointer", width: 26, height: 26, borderRadius: "50%", border: `1.5px solid ${C.softBrown}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: C.coffeeMid }}>−</button>
                    <span style={{ fontFamily: F.u, fontSize: 13, fontWeight: 700, color: C.coffee, minWidth: 12, textAlign: "center" }}>{cart[item.id]}</span>
                  </>
                )}
                <button onClick={() => setCart(p => ({ ...p, [item.id]: (p[item.id] || 0) + 1 }))} style={{ all: "unset", cursor: "pointer", width: 26, height: 26, borderRadius: "50%", background: C.aren, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: C.white }}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cnt > 0 && (
        <div style={{ position: "sticky", bottom: 0, left: 0, right: 0, background: C.coffee, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: `0 -4px 20px ${C.coffee}30` }}>
          <div>
            <div style={{ fontFamily: F.u, fontSize: 11, color: C.cream, opacity: 0.7 }}>{cnt} item</div>
            <div style={{ fontFamily: F.d, fontSize: 18, color: C.arenGlow, fontWeight: 700 }}>{fmt(total)}</div>
          </div>
          <button onClick={() => setDone(true)} style={{ all: "unset", cursor: "pointer", background: C.aren, borderRadius: 11, padding: "11px 22px", fontFamily: F.u, fontSize: 13, fontWeight: 700, color: C.white }}>Pesan →</button>
        </div>
      )}
    </div>
  );
}

function AppTraktir() {
  const [step, setStep] = useState(0);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  if (step === 1) return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 18 }}>🤝</div>
      <h2 style={{ fontFamily: F.d, fontSize: 26, color: C.coffee, margin: "0 0 8px", fontWeight: 700 }}>Terima kasih, Tetangga Baik!</h2>
      <p style={{ fontFamily: F.h, fontSize: 22, color: C.aren, marginBottom: 22 }}>{qty} gelas menunggu tetangga berikutnya</p>
      <p style={{ fontFamily: F.b, fontSize: 14, color: C.coffeeMid, lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>
        Kopimu diberikan ke siapapun yang membutuhkan di TUKU Cipete.
      </p>
      {note && <p style={{ fontFamily: F.h, fontSize: 18, color: C.coffeeMid, marginTop: 18, fontStyle: "italic" }}>"{note}"</p>}
      <br />
      <button onClick={() => { setStep(0); setQty(1); setNote(""); }} style={{ all: "unset", cursor: "pointer", marginTop: 20, fontFamily: F.u, fontSize: 13, color: C.aren, fontWeight: 600 }}>← Kembali</button>
    </div>
  );

  return (
    <div style={{ padding: 18 }}>
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontFamily: F.u, fontSize: 11, color: C.aren, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Kebaikan dalam satu tap</p>
        <h2 style={{ fontFamily: F.d, fontSize: 26, color: C.coffee, margin: "4px 0 6px", fontWeight: 700 }}>Traktir Tetangga</h2>
        <p style={{ fontFamily: F.b, fontSize: 13, color: C.coffeeMid, margin: 0, lineHeight: 1.5 }}>
          Belikan kopi untuk seseorang yang tidak kamu kenal. Barista bilang: "Ada kopi dari tetangga baik."
        </p>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.aren} 0%, ${C.arenLight} 100%)`, borderRadius: 16, padding: 20, color: C.white, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 38, marginBottom: 4 }}>☕</div>
        <div style={{ fontFamily: F.d, fontSize: 36, fontWeight: 700 }}>3</div>
        <p style={{ fontFamily: F.h, fontSize: 17, margin: 0, opacity: 0.95 }}>kopi dari tetangga baik hari ini</p>
      </div>

      <div style={{ background: C.warmWhite, borderRadius: 16, padding: 18, border: `1px solid ${C.softBrown}20` }}>
        <h3 style={{ fontFamily: F.d, fontSize: 17, color: C.coffee, margin: "0 0 14px", fontWeight: 700 }}>Traktir Es Kopi Susu Tetangga</h3>

        <p style={{ fontFamily: F.u, fontSize: 11, fontWeight: 600, color: C.coffeeMid, margin: "0 0 8px", letterSpacing: 1, textTransform: "uppercase" }}>Jumlah</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[1, 3, 5].map(n => (
            <button key={n} onClick={() => setQty(n)} style={{ all: "unset", cursor: "pointer", width: 44, height: 44, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.u, fontSize: 17, fontWeight: 700, background: qty === n ? C.coffee : C.parchment, color: qty === n ? C.cream : C.coffeeMid, transition: "all 0.2s" }}>{n}</button>
          ))}
        </div>

        <p style={{ fontFamily: F.u, fontSize: 11, fontWeight: 600, color: C.coffeeMid, margin: "0 0 8px", letterSpacing: 1, textTransform: "uppercase" }}>Pesan (opsional)</p>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Semangat, tetangga!" style={{ width: "100%", padding: "11px 14px", borderRadius: 11, border: `1px solid ${C.softBrown}35`, background: C.cream, fontFamily: F.h, fontSize: 15, color: C.coffee, outline: "none", boxSizing: "border-box" }} />

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.softBrown}25`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: F.u, fontSize: 11, color: C.warmGray }}>Total</div>
            <div style={{ fontFamily: F.d, fontSize: 22, color: C.coffee, fontWeight: 700 }}>{fmt(22000 * qty)}</div>
          </div>
          <button onClick={() => setStep(1)} style={{ all: "unset", cursor: "pointer", background: C.aren, borderRadius: 11, padding: "12px 24px", fontFamily: F.u, fontSize: 14, fontWeight: 700, color: C.white }}>Traktir 🤝</button>
        </div>
      </div>

      <p style={{ fontFamily: F.b, fontSize: 13, color: C.warmGray, marginTop: 18, textAlign: "center", lineHeight: 1.5 }}>
        Kamu sudah mentraktir <strong style={{ color: C.aren }}>{USER.traktirGiven} gelas</strong> sejak bergabung. 🙏
      </p>
    </div>
  );
}

function AppCerita() {
  return (
    <div style={{ padding: 18 }}>
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontFamily: F.u, fontSize: 11, color: C.aren, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Di balik gelasmu</p>
        <h2 style={{ fontFamily: F.d, fontSize: 26, color: C.coffee, margin: "4px 0 0", fontWeight: 700 }}>Cerita Kopi</h2>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.leaf} 0%, ${C.leafLight} 100%)`, borderRadius: 18, padding: 22, color: C.white, marginBottom: 20 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🌿</div>
        <h3 style={{ fontFamily: F.d, fontSize: 22, margin: "0 0 4px", fontWeight: 700 }}>{FARMER.name}</h3>
        <p style={{ fontFamily: F.h, fontSize: 18, margin: 0, opacity: 0.95 }}>{FARMER.region}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
        {[["Ketinggian", FARMER.alt], ["Panen", FARMER.harvest], ["Varietas", FARMER.var], ["Proses", FARMER.proc]].map(([l, v], i) => (
          <div key={i} style={{ background: C.warmWhite, borderRadius: 11, padding: 12, border: `1px solid ${C.softBrown}20` }}>
            <div style={{ fontFamily: F.u, fontSize: 10, color: C.warmGray, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
            <div style={{ fontFamily: F.b, fontSize: 13, color: C.coffee, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: F.b, fontSize: 14.5, color: C.coffeeMid, lineHeight: 1.7, marginBottom: 20 }}>{FARMER.story}</p>

      <div style={{ background: C.arenSoft, borderRadius: 13, padding: 14, marginBottom: 22, border: `1px solid ${C.aren}30` }}>
        <p style={{ fontFamily: F.u, fontSize: 11, color: C.aren, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px" }}>Gula Aren dari</p>
        <p style={{ fontFamily: F.d, fontSize: 17, color: C.coffee, margin: "0 0 4px", fontWeight: 700 }}>🌴 {FARMER.sugar}</p>
        <p style={{ fontFamily: F.b, fontSize: 12.5, color: C.coffeeMid, margin: 0, lineHeight: 1.5 }}>Gula aren cair — karakter karamel alami Kopi Susu Tetangga.</p>
      </div>

      <h3 style={{ fontFamily: F.d, fontSize: 18, color: C.coffee, margin: "0 0 12px", fontWeight: 700 }}>Perjalanan kopimu</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {[["🌱", "Ditanam", "Kebun Pak Ahmad, 1.400 mdpl"], ["🫘", "Dipanen", "Januari 2026"], ["🏭", "Diproses", "Full washed"], ["🔥", "Di-roast", "Medium, Adena Coffee"], ["☕", "Diseduh", "Barista Rizky, hari ini"]].map(([ic, l, d], i, arr) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.warmWhite, border: `1.5px solid ${C.aren}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{ic}</div>
              {i < arr.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 18, background: C.softBrown, opacity: 0.4 }} />}
            </div>
            <div style={{ paddingTop: 6, paddingBottom: i < arr.length - 1 ? 14 : 0 }}>
              <div style={{ fontFamily: F.u, fontSize: 13, fontWeight: 700, color: C.coffee }}>{l}</div>
              <div style={{ fontFamily: F.b, fontSize: 12.5, color: C.coffeeMid }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppPaspor() {
  const [sub, setSub] = useState("p");
  return (
    <div style={{ padding: 18 }}>
      <div style={{ background: `linear-gradient(135deg, ${C.coffee} 0%, ${C.coffeeMid} 100%)`, borderRadius: 18, padding: 22, color: C.cream, textAlign: "center", marginBottom: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.aren, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontFamily: F.d, fontSize: 28, fontWeight: 700, color: C.coffee }}>{USER.name[0]}</div>
        <h2 style={{ fontFamily: F.d, fontSize: 22, margin: "0 0 4px", fontWeight: 700 }}>{USER.name}</h2>
        <p style={{ fontFamily: F.h, fontSize: 16, color: C.arenGlow, margin: 0 }}>Tetangga sejak {USER.since}</p>

        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.cream}20`, display: "flex", justifyContent: "space-around" }}>
          {[[USER.visits, "Kunjungan"], [USER.traktirGiven, "Traktir"], [USER.citiesVisited, "Kota"]].map(([n, l], i) => (
            <div key={i}>
              <div style={{ fontFamily: F.d, fontSize: 22, fontWeight: 700, color: C.arenGlow }}>{n}</div>
              <div style={{ fontFamily: F.u, fontSize: 10, opacity: 0.7 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", background: C.parchment, borderRadius: 11, padding: 4, marginBottom: 18 }}>
        {[["p", "🌍 Paspor"], ["t", "🛍️ Toserbaku"]].map(([k, l]) => (
          <button key={k} onClick={() => setSub(k)} style={{ all: "unset", cursor: "pointer", flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 9, fontFamily: F.u, fontSize: 12, fontWeight: 600, background: sub === k ? C.white : "transparent", color: sub === k ? C.coffee : C.warmGray, transition: "all 0.2s" }}>{l}</button>
        ))}
      </div>

      {sub === "p" ? (
        <div>
          <h3 style={{ fontFamily: F.d, fontSize: 18, color: C.coffee, margin: "0 0 12px", fontWeight: 700 }}>Jejak Tetangga Berkunjung</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {STORES_VISITED.map((c, i) => (
              <div key={i} style={{ background: C.warmWhite, borderRadius: 13, padding: 14, border: `1px solid ${C.softBrown}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: F.d, fontSize: 17, fontWeight: 700, color: C.coffee }}>{c.flag} {c.city}</span>
                  <Badge>{c.stores.length}</Badge>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.stores.map((s, j) => (
                    <span key={j} style={{ fontFamily: F.u, fontSize: 11, color: C.coffeeMid, background: C.parchment, padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>TUKU {s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3 style={{ fontFamily: F.d, fontSize: 18, color: C.coffee, margin: "0 0 4px", fontWeight: 700 }}>Toserbaku Digital</h3>
          <p style={{ fontFamily: F.h, fontSize: 16, color: C.aren, margin: "0 0 12px" }}>Langsung dari TUKU</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {MERCH.map((m, i) => (
              <div key={i} style={{ background: C.warmWhite, borderRadius: 13, padding: 14, border: `1px solid ${C.softBrown}20`, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{m.icon}</div>
                <div style={{ fontFamily: F.u, fontSize: 12, fontWeight: 700, color: C.coffee, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontFamily: F.u, fontSize: 12, color: C.aren, fontWeight: 700, marginBottom: 8 }}>{fmt(m.price)}</div>
                <button style={{ all: "unset", cursor: "pointer", padding: "6px 12px", borderRadius: 8, background: C.coffee, color: C.cream, fontFamily: F.u, fontSize: 11, fontWeight: 600 }}>+ Keranjang</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

function TukuRukunTetangga() {
  const [mode, setMode] = useState<"narrative" | "transition" | "app">("narrative");
  const [tab, setTab] = useState(0);
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Caveat:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (appRef.current) appRef.current.scrollTop = 0;
  }, [tab]);

  const openApp = useCallback(() => {
    setMode("transition");
    setTimeout(() => setMode("app"), 600);
  }, []);

  const backToNarrative = useCallback(() => {
    setMode("transition");
    setTimeout(() => setMode("narrative"), 400);
  }, []);

  if (mode === "transition") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: C.coffee, display: "flex",
        flexDirection: "column", justifyContent: "center", alignItems: "center",
        zIndex: 999,
      }}>
        <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes pulseGlow { 0%,100% { transform: scale(1); opacity: 0.8 } 50% { transform: scale(1.15); opacity: 1 } }`}</style>
        <div style={{ fontSize: 56, animation: "pulseGlow 1.2s ease-in-out infinite" }}>☕</div>
        <p style={{ fontFamily: F.h, fontSize: 22, color: C.arenGlow, marginTop: 18 }}>Membuka pintu tetangga…</p>
      </div>
    );
  }

  if (mode === "app") {
    const screens = [
      <AppHome key="h" goTo={setTab} />,
      <AppOrder key="o" goTo={setTab} />,
      <AppTraktir key="t" />,
      <AppCerita key="c" />,
      <AppPaspor key="p" />,
    ];
    return (
      <div style={{ minHeight: "100vh", background: C.cream, display: "flex", justifyContent: "center", alignItems: "stretch" }}>
        <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
        <div style={{ width: "100%", maxWidth: 420, background: C.snow, position: "relative", display: "flex", flexDirection: "column", boxShadow: `0 0 40px ${C.coffee}15` }}>
          <button onClick={backToNarrative} style={{ all: "unset", cursor: "pointer", position: "absolute", top: 16, right: 16, zIndex: 10, fontFamily: F.u, fontSize: 11, fontWeight: 600, color: C.warmGray, background: C.warmWhite, padding: "6px 12px", borderRadius: 999, border: `1px solid ${C.softBrown}25` }}>← Proposal</button>

          <div ref={appRef} style={{ flex: 1, overflowY: "auto", paddingBottom: 70, animation: "fadeIn 0.4s ease" }}>
            {screens[tab]}
          </div>

          <nav style={{ position: "sticky", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `1px solid ${C.softBrown}25`, display: "flex", padding: "8px 4px", boxShadow: `0 -2px 12px ${C.coffee}08` }}>
            <TabIcon icon="🏡" label="Rumah" active={tab === 0} onClick={() => setTab(0)} />
            <TabIcon icon="☕" label="Pesan" active={tab === 1} onClick={() => setTab(1)} />
            <TabIcon icon="🤝" label="Traktir" active={tab === 2} onClick={() => setTab(2)} center />
            <TabIcon icon="🌱" label="Cerita" active={tab === 3} onClick={() => setTab(3)} />
            <TabIcon icon="🪪" label="Paspor" active={tab === 4} onClick={() => setTab(4)} />
          </nav>
        </div>
      </div>
    );
  }

  // Narrative mode
  return (
    <main style={{ background: C.cream, color: C.coffee }}>
      <NarrativeHero />
      <NarrativeLetter />
      <NarrativeGap />
      <NarrativeReframe />
      <NarrativePillars />
      <NarrativeTraktir />
      <NarrativeGlobal />
      <NarrativeCTA onOpen={openApp} />

      <section style={{ padding: "100px 24px", background: C.warmWhite }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Fade><Label>Kenapa Sekarang</Label></Fade>
          <Fade delay={150}>
            <p style={{ fontFamily: F.b, fontSize: 19, color: C.coffeeMid, lineHeight: 1.8 }}>
              10 tahun. Amsterdam baru buka. 80% tetangga belum tersentuh digital. Kartu Rukun Tetangga sudah ada — tinggal dihidupkan.
            </p>
          </Fade>
        </div>
      </section>

      <section style={{ padding: "60px 24px", background: C.cream, textAlign: "center" }}>
        <Fade>
          <p style={{ fontFamily: F.h, fontSize: 26, color: C.coffee, margin: "0 0 6px" }}>Ini bukan pitch dari konsultan ke klien.</p>
          <p style={{ fontFamily: F.h, fontSize: 30, color: C.aren, fontWeight: 600 }}>Ini undangan dari tetangga ke tetangga.</p>
        </Fade>
      </section>

      <section style={{ padding: "40px 24px 80px", background: C.cream }}>
        <Fade>
          <p style={{ fontFamily: F.b, fontSize: 17, color: C.coffeeMid, lineHeight: 1.7, maxWidth: 620, margin: "0 auto", textAlign: "center", fontStyle: "italic" }}>
            Sesuatu yang belum pernah dilakukan brand kopi manapun — harus dimulai dari percakapan yang jujur, di atas secangkir Kopi Susu Tetangga.
          </p>
        </Fade>
      </section>

      <footer style={{ padding: "60px 24px", background: C.coffee, color: C.cream, textAlign: "center" }}>
        <p style={{ fontFamily: F.h, fontSize: 24, color: C.arenGlow, margin: "0 0 12px" }}>Mari bertetangga baik. 🤝</p>
        <p style={{ fontFamily: F.u, fontSize: 12, color: C.cream, opacity: 0.6, lineHeight: 1.7, margin: 0 }}>
          Strategic Advisory · Digital Transformation<br />
          F&amp;B &amp; Coffee Industry Practice
        </p>
      </footer>
    </main>
  );
}

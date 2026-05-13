import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode, type CSSProperties } from "react";
import logoDark from "@/assets/tuku-logo-dark.png";
import logoLight from "@/assets/tuku-logo-light.png";

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

// ── Motion tokens — one editorial language for every transition ──
const M = {
  fast: 160, base: 240, med: 420, slow: 680,
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
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
      transform: v ? "translateY(0)" : "translateY(14px)",
      transition: `opacity ${M.med}ms ${M.out} ${delay}ms, transform ${M.med}ms ${M.out} ${delay}ms`,
      willChange: "opacity, transform",
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

function TukuLogo({
  variant = "dark", size = 48, withWordmark = true, minSize, maxSize, style,
}: {
  variant?: "dark" | "light"; size?: number; withWordmark?: boolean;
  minSize?: number; maxSize?: number; style?: CSSProperties;
}) {
  const src = variant === "dark" ? logoDark : logoLight;
  // Native aspect ratios of the trimmed source files.
  const fullRatio = variant === "dark" ? 1424 / 748 : 1246 / 848;
  // When wordmark hidden we crop to the top portion (cup glyph only) — roughly square.
  const ratio = withWordmark ? fullRatio : 1;

  const max = maxSize ?? size;
  const min = minSize ?? size;
  // Fluid scaling between min and max, baseline ~12vw of viewport so it grows with width.
  const widthCss = min === max ? `${max}px` : `clamp(${min}px, ${Math.round((max / 1280) * 100)}vw, ${max}px)`;

  return (
    <img
      src={src}
      alt="TUKU"
      draggable={false}
      style={{
        width: widthCss,
        height: "auto",
        aspectRatio: String(ratio),
        objectFit: withWordmark ? "contain" : "cover",
        objectPosition: withWordmark ? "center" : "center top",
        display: "block", userSelect: "none", pointerEvents: "none",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function Masthead() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12,
      padding: "10px clamp(14px, 3vw, 22px)",
      minHeight: 56, boxSizing: "border-box",
      background: solid ? `${C.cream}EE` : "transparent",
      backdropFilter: solid ? "blur(8px)" : "none",
      WebkitBackdropFilter: solid ? "blur(8px)" : "none",
      borderBottom: solid ? `1px solid ${C.softBrown}30` : "1px solid transparent",
      transition: `background ${M.base}ms ${M.out}, border-color ${M.base}ms ${M.out}, backdrop-filter ${M.base}ms ${M.out}`,
      willChange: "background, backdrop-filter",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: "1 1 auto" }}>
        <TukuLogo variant="dark" size={34} minSize={28} maxSize={34} />
        <div style={{ borderLeft: `1px solid ${C.softBrown}80`, paddingLeft: 12, display: "none", minWidth: 0 }} className="masthead-tag">
          <div style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.warmGray }}>EDISI 01</div>
          <div style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, letterSpacing: 1.4, color: C.coffee, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>RUKUN TETANGGA DIGITAL</div>
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.warmGray }}>PROPOSAL</div>
        <div style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 13, color: C.coffee, lineHeight: 1 }}>MMXXVI</div>
      </div>
      <style>{`@media (min-width: 640px) { .masthead-tag { display: block !important; } }`}</style>
    </div>
  );
}

function ChapterMarker({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
      <span style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 56, fontWeight: 400, color: C.aren, lineHeight: 0.8, letterSpacing: -1 }}>{n}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.aren}80, transparent)` }} />
      <span style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.warmGray, textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function ChapterEyebrow({
  n, label, title, note, page, total = "IX", tone = "light", align = "left",
}: {
  n: string; label: string; title: string; note: string; page: string;
  total?: string; tone?: "light" | "dark"; align?: "left" | "center";
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = `eb-${n}-${label}`.replace(/\s+/g, "-").toLowerCase();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDoc); };
  }, [open]);

  const dark = tone === "dark";
  const ink = dark ? C.arenGlow : C.aren;
  const subInk = dark ? `${C.cream}` : C.coffee;
  const noteInk = dark ? `${C.cream}cc` : C.coffeeMid;
  const panelBg = dark ? `${C.coffee}f2` : C.warmWhite;
  const panelBorder = dark ? `${C.arenGlow}40` : `${C.aren}35`;

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", textAlign: align }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-expanded={open}
        aria-controls={id}
        style={{
          all: "unset", cursor: "help", display: "inline-flex", alignItems: "center", gap: 8,
          padding: dark ? "5px 14px" : "4px 10px",
          border: dark ? `1px solid ${C.arenGlow}40` : `1px solid transparent`,
          borderRadius: 999,
          fontFamily: F.u, fontSize: dark ? 9 : 10, fontWeight: 700, letterSpacing: dark ? 3 : 4,
          color: ink, textTransform: "uppercase", position: "relative",
        }}
      >
        <span>CH · {n} — {label}</span>
        <span aria-hidden style={{
          display: "inline-block", width: 12, textAlign: "center",
          opacity: hover || open ? 1 : 0, transform: open ? "rotate(45deg)" : "rotate(0)",
          transition: "opacity 200ms ease, transform 220ms ease", color: ink, fontSize: 11,
        }}>＋</span>
        <span aria-hidden style={{
          position: "absolute", left: 10, right: 10, bottom: 2, height: 1, background: ink,
          transform: hover || open ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left",
          transition: "transform 260ms ease", opacity: 0.7,
        }} />
      </button>
      {open && (
        <div
          id={id}
          role="region"
          style={{
            position: "absolute", top: "calc(100% + 10px)",
            ...(align === "center" ? { left: "50%", transform: "translateX(-50%)" } : { left: 0 }),
            width: "min(92vw, 360px)", textAlign: "left", zIndex: 20,
            background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: 4,
            padding: "16px 18px 14px",
            boxShadow: dark ? `0 24px 60px ${C.coffee}80` : `0 18px 40px ${C.coffee}25`,
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            animation: "ebReveal 240ms ease-out both",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <span style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: dark ? C.arenGlow : C.warmGray }}>BAB {n}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Tutup" style={{ all: "unset", cursor: "pointer", fontFamily: F.u, fontSize: 11, color: dark ? `${C.cream}80` : C.warmGray, padding: "0 4px" }}>✕</button>
          </div>
          <p style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 22, color: subInk, lineHeight: 1.2, margin: "6px 0 10px", fontWeight: 400 }}>{title}</p>
          <p style={{ fontFamily: F.b, fontSize: 13.5, color: noteInk, lineHeight: 1.55, margin: 0 }}>{note}</p>
          <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${dark ? `${C.cream}20` : `${C.softBrown}40`}`, display: "flex", justifyContent: "space-between", fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: dark ? `${C.cream}90` : C.warmGray }}>
            <span>HALAMAN {page}</span><span>DARI {total}</span>
          </div>
        </div>
      )}
      <style>{`@keyframes ebReveal { from { opacity: 0; transform: translateY(-4px) ${align === "center" ? "translateX(-50%)" : ""}; } to { opacity: 1; transform: translateY(0) ${align === "center" ? "translateX(-50%)" : ""}; } } @media (prefers-reduced-motion: reduce) { [id^="eb-"] { animation: none !important; } }`}</style>
    </div>
  );
}

const GRAIN_BG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>")`;

function GrainOverlay({ opacity = 0.06 }: { opacity?: number }) {
  return <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: GRAIN_BG, opacity, pointerEvents: "none", mixBlendMode: "overlay" }} />;
}

function CornerTicks({ color }: { color: string }) {
  const tick = (pos: CSSProperties) => <div style={{ position: "absolute", width: 14, height: 14, ...pos }}>
    <div style={{ position: "absolute", inset: 0, borderColor: color, borderStyle: "solid", borderWidth: 0, ...((pos as any).borderTop ? {} : {}) }} />
  </div>;
  void tick;
  const base: CSSProperties = { position: "absolute", width: 18, height: 18, borderColor: color, borderStyle: "solid" };
  return (
    <>
      <div aria-hidden style={{ ...base, top: 14, left: 14, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 }} />
      <div aria-hidden style={{ ...base, top: 14, right: 14, borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 0, borderBottomWidth: 0 }} />
      <div aria-hidden style={{ ...base, bottom: 14, left: 14, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 0, borderTopWidth: 0 }} />
      <div aria-hidden style={{ ...base, bottom: 14, right: 14, borderBottomWidth: 1, borderRightWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }} />
    </>
  );
}

type FrameIntensity = "subtle" | "soft" | "feature";
type FrameTone = "light" | "dark";
type WatermarkKind = "cup" | "wordmark" | "none";
type WatermarkPos = "br" | "bl" | "tr" | "tl";

const INTENSITY: Record<FrameIntensity, { grain: number; ticks: number; mark: number }> = {
  subtle:  { grain: 0.03, ticks: 0.10, mark: 0.025 },
  soft:    { grain: 0.05, ticks: 0.18, mark: 0.04 },
  feature: { grain: 0.09, ticks: 0.30, mark: 0.05 },
};

function Watermark({
  tone, pos = "br", opacity, kind = "cup", size = 360,
}: { tone: FrameTone; pos?: WatermarkPos; opacity: number; kind?: "cup" | "wordmark"; size?: number }) {
  const variant = tone === "light" ? "dark" : "light";
  const offset = "-6vw";
  const corner: CSSProperties =
    pos === "br" ? { right: offset, bottom: offset } :
    pos === "bl" ? { left: offset, bottom: offset } :
    pos === "tr" ? { right: offset, top: offset } :
                   { left: offset, top: offset };
  return (
    <TukuLogo
      variant={variant}
      withWordmark={kind === "wordmark"}
      size={size}
      minSize={Math.round(size * 0.45)}
      maxSize={size}
      style={{ position: "absolute", opacity, transform: "rotate(-6deg)", pointerEvents: "none", ...corner }}
    />
  );
}

function FrameOverlay({
  tone = "light", intensity = "subtle", watermark = "cup", watermarkPos = "br", inset = 14,
}: {
  tone?: FrameTone; intensity?: FrameIntensity;
  watermark?: WatermarkKind; watermarkPos?: WatermarkPos; inset?: number;
}) {
  const v = INTENSITY[intensity];
  const tickColor = tone === "dark" ? `rgba(245,240,232,${v.ticks})` : `rgba(60,36,21,${v.ticks})`;
  const corners: CSSProperties[] = [
    { top: inset, left: inset, borderTopWidth: 1, borderLeftWidth: 1 },
    { top: inset, right: inset, borderTopWidth: 1, borderRightWidth: 1 },
    { bottom: inset, left: inset, borderBottomWidth: 1, borderLeftWidth: 1 },
    { bottom: inset, right: inset, borderBottomWidth: 1, borderRightWidth: 1 },
  ];
  return (
    <>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: GRAIN_BG, opacity: v.grain, pointerEvents: "none", mixBlendMode: "overlay", zIndex: 0 }} />
      {corners.map((p, i) => (
        <div key={i} aria-hidden style={{ position: "absolute", width: 18, height: 18, borderStyle: "solid", borderColor: tickColor, borderWidth: 0, pointerEvents: "none", zIndex: 0, ...p }} />
      ))}
      {watermark !== "none" && (
        <Watermark tone={tone} pos={watermarkPos} opacity={v.mark} kind={watermark} size={watermark === "wordmark" ? 480 : 360} />
      )}
    </>
  );
}

function PullQuote({ children, color = C.aren }: { children: ReactNode; color?: string }) {
  return (
    <blockquote style={{ position: "relative", padding: "28px 18px 24px 64px", margin: "32px 0" }}>
      <span aria-hidden style={{ position: "absolute", top: -10, left: 0, fontFamily: F.d, fontSize: 120, lineHeight: 1, color, opacity: 0.35, fontStyle: "italic" }}>&ldquo;</span>
      <p style={{ fontFamily: F.d, fontStyle: "italic", fontSize: "clamp(22px, 3.4vw, 36px)", lineHeight: 1.35, color: C.coffee, margin: 0, fontWeight: 400 }}>
        {children}
      </p>
    </blockquote>
  );
}

type TileId = "logo" | "huruf" | "palet" | "edisi";

function ColophonTile({
  id, label, openId, setOpenId, summary, detail,
}: {
  id: TileId; label: string; openId: TileId | null; setOpenId: (v: TileId | null) => void;
  summary: ReactNode; detail: ReactNode;
}) {
  const open = openId === id;
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        gridColumn: open ? "1 / -1" : "auto",
        transition: "grid-column 0s",
      }}
    >
      <button
        type="button"
        onClick={() => setOpenId(open ? null : id)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-expanded={open}
        aria-controls={`tile-${id}`}
        style={{
          all: "unset", cursor: "pointer", display: "block", width: "100%", boxSizing: "border-box",
          padding: 16, borderRadius: 4, position: "relative",
          background: hover || open ? C.warmWhite : "transparent",
          border: `1px solid ${hover || open ? `${C.aren}55` : `${C.softBrown}30`}`,
          transition: "background 220ms ease, border-color 220ms ease, box-shadow 220ms ease",
          boxShadow: hover || open ? `0 10px 28px ${C.coffee}12` : "none",
        }}
      >
        <div style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: hover || open ? C.aren : C.warmGray, marginBottom: 8, transition: "color 200ms ease" }}>
          {label}
        </div>
        {summary}
        <span aria-hidden style={{
          position: "absolute", right: 12, bottom: 8,
          fontFamily: F.u, fontSize: 8.5, fontWeight: 700, letterSpacing: 1.5, color: C.aren,
          opacity: hover && !open ? 0.85 : 0, transition: "opacity 200ms ease",
        }}>klik untuk detail →</span>
        <span aria-hidden style={{
          position: "absolute", right: 12, top: 12, fontFamily: F.u, fontSize: 11, color: C.aren,
          transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 220ms ease",
        }}>＋</span>
      </button>
      {open && (
        <div
          id={`tile-${id}`}
          role="region"
          style={{
            marginTop: 10, padding: "18px 20px 18px", background: C.warmWhite,
            border: `1px solid ${C.aren}40`, borderRadius: 4,
            boxShadow: `0 18px 40px ${C.coffee}18`,
            animation: "tileReveal 240ms ease-out both", position: "relative",
          }}
        >
          <button type="button" onClick={() => setOpenId(null)} aria-label="Tutup detail" style={{ all: "unset", cursor: "pointer", position: "absolute", top: 10, right: 12, fontFamily: F.u, fontSize: 12, color: C.warmGray, padding: 4 }}>✕</button>
          {detail}
        </div>
      )}
    </div>
  );
}

const PALETTE_INFO: { c: string; name: string; hex: string; role: string }[] = [
  { c: C.coffee, name: "Coffee", hex: C.coffee, role: "Tinta utama — judul, teks pekat" },
  { c: C.aren, name: "Aren", hex: C.aren, role: "Aksen hangat — link, sorotan" },
  { c: C.leaf, name: "Daun", hex: C.leaf, role: "Sinyal alami — petani, kebun" },
  { c: C.parchment, name: "Parchment", hex: C.parchment, role: "Kertas — latar editorial" },
  { c: C.cream, name: "Cream", hex: C.cream, role: "Latar terang — bagian dalam" },
];

function PaletteDetail() {
  const [pick, setPick] = useState(0);
  const sw = PALETTE_INFO[pick];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {PALETTE_INFO.map((p, i) => (
          <button key={p.hex} type="button" onClick={() => setPick(i)} aria-label={p.name} style={{
            all: "unset", cursor: "pointer", width: 36, height: 48, background: p.c,
            border: `2px solid ${i === pick ? C.aren : `${C.softBrown}40`}`,
            transition: "border-color 180ms ease, transform 180ms ease",
            transform: i === pick ? "translateY(-2px)" : "none",
          }} />
        ))}
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.softBrown}40` }}>
        <p style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 20, color: C.coffee, margin: "0 0 4px" }}>{sw.name}</p>
        <p style={{ fontFamily: F.u, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.aren, margin: "0 0 8px" }}>{sw.hex.toUpperCase()}</p>
        <p style={{ fontFamily: F.b, fontSize: 13.5, color: C.coffeeMid, margin: 0, lineHeight: 1.5 }}>{sw.role}</p>
      </div>
    </div>
  );
}

const FONT_INFO: { fam: string; name: string; role: string; sample: string }[] = [
  { fam: F.d, name: "Playfair Display", role: "Display — judul & kutipan", sample: "Rukun Tetangga Digital" },
  { fam: F.b, name: "Source Serif 4", role: "Body — paragraf editorial", sample: "Sepuluh tahun di Cipete." },
  { fam: F.h, name: "Caveat", role: "Hand — sentuhan personal", sample: "salam dari Mas Tyo" },
  { fam: F.u, name: "DM Sans", role: "Utility — label & meta", sample: "CH · 04 — PERGESERAN" },
];

function Colophon() {
  const [openId, setOpenId] = useState<TileId | null>(null);
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "56px 24px", background: C.parchment, borderTop: `1px solid ${C.softBrown}40`, borderBottom: `1px solid ${C.softBrown}40` }}>
      <FrameOverlay tone="light" intensity="subtle" watermark="cup" watermarkPos="br" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, alignItems: "start" }}>
        <ColophonTile
          id="logo" label="LAMBANG" openId={openId} setOpenId={setOpenId}
          summary={<><TukuLogo variant="dark" size={52} /><p style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.warmGray, marginTop: 10 }}>KOPI TUKU · 2026</p></>}
          detail={<>
            <p style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 22, color: C.coffee, margin: "0 0 8px" }}>Gelas & biji — sederhana, hangat.</p>
            <p style={{ fontFamily: F.b, fontSize: 14, color: C.coffeeMid, lineHeight: 1.6, margin: "0 0 10px" }}>
              Lambang TUKU adalah satu gelas takeaway dengan biji kopi di atasnya — ditarik tangan, bukan grid. Diturunkan dari kios pertama di Cipete (2015) menjadi tanda <em>Rukun Tetangga Digital</em>.
            </p>
            <p style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.warmGray }}>EST. 2015 · CIPETE → AMSTERDAM</p>
          </>}
        />
        <ColophonTile
          id="huruf" label="HURUF" openId={openId} setOpenId={setOpenId}
          summary={<>
            <p style={{ fontFamily: F.d, fontSize: 16, color: C.coffee, margin: "0 0 2px" }}>Playfair Display</p>
            <p style={{ fontFamily: F.b, fontSize: 14, color: C.coffeeMid, margin: "0 0 2px" }}>Source Serif 4</p>
            <p style={{ fontFamily: F.h, fontSize: 16, color: C.aren, margin: "0 0 2px" }}>Caveat</p>
            <p style={{ fontFamily: F.u, fontSize: 12, color: C.coffeeMid, letterSpacing: 1 }}>DM Sans</p>
          </>}
          detail={<div style={{ display: "grid", gap: 14 }}>
            {FONT_INFO.map(f => (
              <div key={f.name} style={{ borderLeft: `2px solid ${C.aren}60`, paddingLeft: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6 }}>
                  <span style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.aren }}>{f.name}</span>
                  <span style={{ fontFamily: F.u, fontSize: 9.5, color: C.warmGray, letterSpacing: 1.5 }}>{f.role}</span>
                </div>
                <p style={{ fontFamily: f.fam, fontSize: f.fam === F.h ? 22 : 18, color: C.coffee, margin: "4px 0 0", fontStyle: f.fam === F.d ? "italic" : "normal" }}>{f.sample}</p>
              </div>
            ))}
          </div>}
        />
        <ColophonTile
          id="palet" label="PALET" openId={openId} setOpenId={setOpenId}
          summary={<div style={{ display: "flex", gap: 6 }}>
            {PALETTE_INFO.map(p => (
              <div key={p.hex} title={p.name} style={{ width: 22, height: 32, background: p.c, border: `1px solid ${C.softBrown}40` }} />
            ))}
          </div>}
          detail={<PaletteDetail />}
        />
        <ColophonTile
          id="edisi" label="EDISI" openId={openId} setOpenId={setOpenId}
          summary={<>
            <p style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 22, color: C.coffee, margin: 0, lineHeight: 1.1 }}>Vol. 01</p>
            <p style={{ fontFamily: F.u, fontSize: 11, color: C.coffeeMid, letterSpacing: 1, marginTop: 4 }}>Jakarta · Amsterdam</p>
          </>}
          detail={<>
            <p style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 22, color: C.coffee, margin: "0 0 10px" }}>Edisi Pembuka — &ldquo;Rukun Tetangga Digital&rdquo;</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 14, marginTop: 6 }}>
              {[["TEMA", "Tetangga lintas benua"], ["BAB", "IX bagian"], ["RUTE", "Cipete → Amsterdam"], ["TERBIT", "Mei 2026"]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.warmGray }}>{k}</div>
                  <div style={{ fontFamily: F.b, fontSize: 14, color: C.coffee, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </>}
        />
      </div>
      <style>{`@keyframes tileReveal { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } } @media (prefers-reduced-motion: reduce) { [id^="tile-"] { animation: none !important; } }`}</style>
    </section>
  );
}

const TAB_NAMES = ["Rumah", "Pesan", "Traktir", "Cerita", "Paspor", "Obrolan"] as const;
const TAB_EYEBROWS = ["beranda", "katalog harian", "rukun tetangga", "di balik gelas", "kartu identitas", "percakapan"] as const;
function AppTopBar({ tab, onBack }: { tab: number; onBack: () => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px", background: C.snow,
      borderBottom: `1px solid ${C.softBrown}25`,
      position: "sticky", top: 0, zIndex: 8,
    }}>
      <button onClick={onBack} aria-label="Kembali ke proposal" style={{ all: "unset", cursor: "pointer", fontFamily: F.u, fontSize: 11, fontWeight: 700, color: C.warmGray, letterSpacing: 1, padding: "4px 8px", borderRadius: 999, border: `1px solid ${C.softBrown}40` }}>← Proposal</button>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
        <TukuLogo variant="dark" size={26} withWordmark={false} />
        <div key={tab} style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4, animation: `topbarSwap ${M.base}ms ${M.out} both` }}>
          <span style={{ fontFamily: F.u, fontSize: 8.5, fontWeight: 700, letterSpacing: 2, color: C.warmGray, textTransform: "uppercase" }}>{TAB_EYEBROWS[tab]}</span>
          <span style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 13, color: C.coffee }}>{TAB_NAMES[tab]}</span>
        </div>
      </div>
      <div style={{ width: 70, fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: C.warmGray, textAlign: "right" }}>EDISI · 01</div>
      <style>{`@keyframes topbarSwap { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }`}</style>
    </div>
  );
}

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

// ── Mock Data ──
const USER = { name: "Andi", rumah: "TUKU Cipete", since: "2023", visits: 147, traktirGiven: 12, citiesVisited: 4 };
type CityStore = { name: string; x: number; y: number; home?: boolean };
type City = { city: string; flag: string; coord: { x: number; y: number }; home?: boolean; stores: CityStore[] };
const STORES_VISITED: City[] = [
  { city: "Jakarta", flag: "🇮🇩", coord: { x: 245, y: 152 }, home: true, stores: [
    { name: "Cipete", x: 160, y: 145, home: true },
    { name: "Kemang", x: 180, y: 125 },
    { name: "GBK", x: 130, y: 105 },
    { name: "Jatinegara", x: 215, y: 90 },
  ]},
  { city: "Bandung", flag: "🇮🇩", coord: { x: 256, y: 158 }, stores: [{ name: "Ambon", x: 160, y: 110 }] },
  { city: "Surabaya", flag: "🇮🇩", coord: { x: 278, y: 156 }, stores: [{ name: "Darmo", x: 160, y: 110 }] },
  { city: "Amsterdam", flag: "🇳🇱", coord: { x: 162, y: 58 }, stores: [{ name: "Centrum", x: 160, y: 110 }] },
];
type MenuItem = { id: number; name: string; price: number; cat: string; desc: string; pop?: boolean; batchStep?: number; batchLabel?: string; origin?: string; harvest?: string };
const MENU: MenuItem[] = [
  { id: 1, name: "Es Kopi Susu Tetangga", price: 22000, cat: "coffee", desc: "Signature. Espresso + susu + gula aren", pop: true, batchStep: 4, batchLabel: "Es Kopi Susu Tetangga · Gayo", origin: "Takengon, Aceh", harvest: "Januari 2026" },
  { id: 2, name: "Kopi Hitam Tetangga", price: 18000, cat: "coffee", desc: "Iced black. Robusta murni.", batchStep: 3, batchLabel: "Robusta Lampung · House blend", origin: "Lampung Barat", harvest: "Desember 2025" },
  { id: 3, name: "Cappuccino", price: 28000, cat: "coffee", desc: "Classic, creamy, warm", batchStep: 3, batchLabel: "Arabika Gayo · Medium roast", origin: "Takengon, Aceh", harvest: "Januari 2026" },
  { id: 4, name: "Cold Drip Santai", price: 32000, cat: "coffee", desc: "12-hour slow drip", batchStep: 2, batchLabel: "Flores Ende · Cold drip batch baru", origin: "Ende, Flores", harvest: "November 2025" },
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
    <section style={{ position: "relative", minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 24px 80px", background: `radial-gradient(ellipse at top, ${C.warmWhite} 0%, ${C.cream} 60%, ${C.parchment} 100%)`, textAlign: "center", overflow: "hidden" }}>
      <GrainOverlay opacity={0.05} />
      <div aria-hidden style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", fontFamily: F.d, fontStyle: "italic", fontSize: "clamp(180px, 28vw, 380px)", color: `${C.aren}10`, lineHeight: 0.8, letterSpacing: -8, fontWeight: 700, userSelect: "none", pointerEvents: "none" }}>tetangga</div>
      <Fade>
        <TukuLogo variant="dark" size={120} minSize={72} maxSize={120} style={{ marginBottom: 18, filter: `drop-shadow(0 6px 20px ${C.coffee}25)` }} />
      </Fade>
      <Fade delay={120}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <ChapterEyebrow
            n="01" label="PEMBUKA" page="I" align="center"
            title="Sebuah undangan untuk bertetangga."
            note="Halaman pembuka — niat di balik proposal ini, dan janji kecil: setiap bab adalah pintu, bukan deck."
          />
          <Label>sebuah undangan untuk bertetangga</Label>
        </div>
      </Fade>
      <Fade delay={250}>
        <h1 style={{ fontFamily: F.d, fontSize: "clamp(56px, 11vw, 140px)", fontWeight: 700, color: C.coffee, lineHeight: 1, margin: "10px 0 24px", letterSpacing: -2.5, position: "relative" }}>
          Rukun Tetangga<br />
          <span style={{ fontStyle: "italic", color: C.aren }}>Digital</span>
        </h1>
      </Fade>
      <Fade delay={420}>
        <p style={{ fontFamily: F.b, fontSize: 20, color: C.coffeeMid, maxWidth: 600, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
          Membawa jiwa tetangga ke dunia digital — dari Cipete hingga Amsterdam.
        </p>
      </Fade>
      <Fade delay={620}>
        <div style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {[["VOL", "01"], ["TAHUN", "2026"], ["RUTE", "JAKARTA → AMSTERDAM"], ["EDISI", "PROPOSAL"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 14px", borderLeft: `1px solid ${C.softBrown}80`, borderRight: `1px solid ${C.softBrown}80` }}>
              <span style={{ fontFamily: F.u, fontSize: 8.5, fontWeight: 700, letterSpacing: 2, color: C.warmGray }}>{k}</span>
              <span style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 14, color: C.coffee, marginTop: 2 }}>{v}</span>
            </div>
          ))}
        </div>
      </Fade>
      <Fade delay={900}>
        <div style={{ marginTop: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: F.h, fontSize: 18, color: C.warmGray }}>gulir ke bawah</div>
          <div style={{ width: 1, height: 48, background: `linear-gradient(180deg, ${C.aren}, transparent)`, animation: "scrollCue 2s ease-in-out infinite" }} />
        </div>
      </Fade>
      <style>{`@keyframes scrollCue { 0%,100% { transform: scaleY(0.6); transform-origin: top; opacity: 0.4 } 50% { transform: scaleY(1); opacity: 1 } }`}</style>
    </section>
  );
}

function NarrativeLetter() {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "120px 24px", background: C.warmWhite }}>
      <FrameOverlay tone="light" intensity="subtle" watermark="cup" watermarkPos="br" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
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
    <section style={{ position: "relative", overflow: "hidden", padding: "120px 24px", background: C.cream }}>
      <FrameOverlay tone="light" intensity="subtle" watermark="cup" watermarkPos="bl" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
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
    <section style={{ position: "relative", padding: "160px 24px", background: `radial-gradient(ellipse at 30% 20%, ${C.coffeeMid} 0%, ${C.coffee} 60%, #1f130b 100%)`, color: C.cream, overflow: "hidden" }}>
      <GrainOverlay opacity={0.10} />
      <CornerTicks color={`${C.cream}30`} />
      <TukuLogo variant="light" size={520} minSize={280} maxSize={520} style={{ position: "absolute", right: "-8vw", bottom: "-6vw", opacity: 0.045, transform: "rotate(-8deg)" }} />
      <div style={{ position: "relative", maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <Fade>
          <ChapterEyebrow
            n="04" label="PERGESERAN" page="IV" tone="dark" align="center"
            title="Dari loyalty program ke rukun tetangga."
            note="Setiap brand kopi membangun program poin. TUKU bisa membangun sesuatu yang lebih jarang: rasa saling kenal antar tetangga — yang tidak bisa di-copy oleh kompetitor."
          />
        </Fade>
        <Fade delay={150}>
          <p style={{ fontFamily: F.d, fontSize: "clamp(28px, 4vw, 44px)", color: C.cream, lineHeight: 1.3, margin: "26px 0 56px", opacity: 0.62 }}>
            Setiap brand kopi di dunia membangun<br />
            <span style={{ fontStyle: "italic" }}>loyalty program.</span>
          </p>
        </Fade>
        <Fade delay={400}>
          <h2 style={{ fontFamily: F.d, fontSize: "clamp(40px, 7vw, 78px)", color: C.arenGlow, lineHeight: 1.1, margin: "0 0 56px", letterSpacing: -1.5, fontWeight: 700 }}>
            TUKU bisa membangun<br />yang belum pernah ada:<br />
            <span style={{ fontStyle: "italic" }}>sebuah rukun tetangga.</span>
          </h2>
        </Fade>
        <Fade delay={650}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24, alignItems: "center", maxWidth: 720, margin: "0 auto", padding: "28px 18px", border: `1px solid ${C.cream}18`, borderRadius: 4 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.cream, opacity: 0.5, marginBottom: 6 }}>MEREKA</div>
              <p style={{ fontFamily: F.h, fontSize: 22, color: C.cream, opacity: 0.85, margin: 0, lineHeight: 1.3 }}>Reward karena kamu <em>belanja</em>.</p>
            </div>
            <div style={{ width: 1, height: 56, background: `${C.arenGlow}40` }} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.arenGlow, marginBottom: 6 }}>TUKU</div>
              <p style={{ fontFamily: F.h, fontSize: 26, color: C.arenGlow, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>Reward karena kamu <em>tetangga yang baik</em>.</p>
            </div>
          </div>
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
    <section style={{ position: "relative", overflow: "hidden", padding: "120px 24px", background: C.warmWhite }}>
      <FrameOverlay tone="light" intensity="subtle" watermark="cup" watermarkPos="tr" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto" }}>
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
    <section style={{ position: "relative", padding: "160px 24px", background: `radial-gradient(ellipse at 50% 0%, ${C.coffeeMid} 0%, ${C.coffee} 55%, #1a0e07 100%)`, color: C.cream, textAlign: "center", overflow: "hidden" }}>
      <GrainOverlay opacity={0.09} />
      <CornerTicks color={`${C.cream}25`} />
      <Fade>
        <TukuLogo variant="light" size={88} minSize={56} maxSize={88} style={{ marginBottom: 22, filter: `drop-shadow(0 6px 24px ${C.aren}40)` }} />
      </Fade>
      <Fade delay={150}>
        <div style={{ marginBottom: 18 }}>
          <ChapterEyebrow
            n="09" label="UNDANGAN" page="IX" tone="dark" align="center"
            title="Bukan mockup. Sebuah pintu yang bisa dibuka."
            note="Bab penutup. Yang ada di balik tombol bukan slide deck — tapi prototipe interaktif yang bisa kamu jelajahi sebagai tetangga TUKU."
          />
        </div>
      </Fade>
      <Fade delay={250}>
        <h2 style={{ fontFamily: F.d, fontSize: "clamp(36px, 6vw, 60px)", color: C.cream, lineHeight: 1.15, margin: "0 0 20px", letterSpacing: -1.2, fontWeight: 400 }}>
          Sekarang, bayangkan kamu<br /><span style={{ fontStyle: "italic", color: C.arenGlow }}>membuka pintu ini.</span>
        </h2>
      </Fade>
      <Fade delay={420}>
        <p style={{ fontFamily: F.h, fontSize: 22, color: C.cream, opacity: 0.7, marginBottom: 56, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
          Ini bukan mockup. Ini sketsa di serbet — yang bisa kamu sentuh.
        </p>
      </Fade>
      <Fade delay={550}>
        <button onClick={onOpen} style={{
          all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 14,
          background: "transparent", color: C.arenGlow, padding: "18px 38px",
          borderRadius: 0, fontFamily: F.u, fontSize: 14, fontWeight: 700,
          letterSpacing: 3, textTransform: "uppercase",
          border: `1px solid ${C.arenGlow}`,
          transform: pulse ? "translateY(-2px)" : "translateY(0)",
          transition: `transform ${M.med}ms ${M.inOut}, background ${M.base}ms ${M.out}, color ${M.base}ms ${M.out}`,
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.arenGlow; (e.currentTarget as HTMLButtonElement).style.color = C.coffee; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.arenGlow; }}
        >
          <span>Open the Door</span>
          <span style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 16, letterSpacing: 0, textTransform: "none" }}>buka pintunya</span>
          <span>→</span>
        </button>
      </Fade>
      <Fade delay={750}>
        <p style={{ fontFamily: F.h, fontSize: 18, color: C.cream, opacity: 0.45, marginTop: 32 }}>
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
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: active ? C.aren : C.coffee, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -16, boxShadow: `0 6px 18px ${C.coffee}40`, transition: `background ${M.base}ms ${M.out}, transform ${M.base}ms ${M.out}` }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
        </div>
      ) : (
        <div style={{ fontSize: 22, opacity: active ? 1 : 0.4, transform: active ? "translateY(-1px)" : "none", transition: `opacity ${M.base}ms ${M.out}, transform ${M.base}ms ${M.out}` }}>
          {icon}
        </div>
      )}
      <span style={{ fontFamily: F.u, fontSize: 10, fontWeight: 600, color: active ? C.coffee : C.warmGray, transition: `color ${M.base}ms ${M.out}` }}>{label}</span>
    </button>
  );
}

function AppHome({ goTo }: { goTo: (n: number) => void }) {
  const gotongPct = 87;
  const gotongTotal = 100;
  return (
    <div style={{ padding: "20px 18px 28px" }}>
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontFamily: F.u, fontSize: 12, color: C.warmGray, margin: 0 }}>Selamat siang,</p>
        <h2 style={{ fontFamily: F.d, fontSize: 28, color: C.coffee, margin: "2px 0 0", fontWeight: 700 }}>Halo, {USER.name} 👋</h2>
      </div>

      {/* ── KARTU TOKOKU (membership card) ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.coffee} 0%, ${C.coffeeMid} 60%, ${C.aren} 140%)`,
        borderRadius: 20, padding: 20, color: C.cream, marginBottom: 18, position: "relative", overflow: "hidden",
        boxShadow: `0 8px 24px ${C.coffee}30`,
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: `${C.aren}25` }} />
        <div style={{ position: "absolute", bottom: -40, left: -20, width: 100, height: 100, borderRadius: "50%", background: `${C.arenGlow}10` }} />

        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: F.u, fontSize: 9.5, opacity: 0.7, margin: 0, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Kartu Tokoku</p>
            <h3 style={{ fontFamily: F.d, fontSize: 24, margin: "4px 0 4px", fontWeight: 700 }}>🏠 {USER.rumah}</h3>
            <p style={{ fontFamily: F.h, fontSize: 16, color: C.arenGlow, margin: 0 }}>Barista hari ini: Rizky &amp; Amel</p>
          </div>
          <div style={{ background: C.arenGlow, color: C.coffee, fontFamily: F.u, fontSize: 9, fontWeight: 800, letterSpacing: 1.5, padding: "5px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>
            ★ WARGA TETAP
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${C.cream}20` }}>
          {[
            [USER.visits, "Kunjungan"],
            ["12", "Bulan ini"],
            ["7d", "Streak"],
            ["☕", "Es Kopi Susu"],
          ].map(([v, l], i) => (
            <div key={i} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontFamily: F.d, fontSize: 18, fontWeight: 700, color: C.arenGlow }}>{v}</div>
              <div style={{ fontFamily: F.u, fontSize: 9, opacity: 0.75, marginTop: 2, letterSpacing: 0.5 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ position: "relative", marginTop: 12, padding: "8px 12px", background: `${C.cream}15`, borderRadius: 10, fontFamily: F.b, fontSize: 12, color: C.cream, opacity: 0.95 }}>
          🎁 Kunjungan ke-150 → Tumbler TUKU edisi Cipete
        </div>
      </div>

      {/* ── RINGKASAN KUNJUNGAN ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
        {[
          { v: "12", l: "Bulan ini", sub: "+3 vs bulan lalu", color: C.aren },
          { v: USER.traktirGiven, l: "Traktiran", sub: "diberi", color: C.leaf },
          { v: USER.citiesVisited, l: "Kota", sub: "dijelajahi", color: C.coffeeMid },
        ].map((s, i) => (
          <div key={i} style={{ background: C.warmWhite, borderRadius: 13, padding: 12, border: `1px solid ${C.softBrown}20`, textAlign: "center" }}>
            <div style={{ fontFamily: F.d, fontSize: 22, fontWeight: 700, color: s.color }}>{s.v}</div>
            <div style={{ fontFamily: F.u, fontSize: 10.5, color: C.coffee, fontWeight: 700, marginTop: 2 }}>{s.l}</div>
            <div style={{ fontFamily: F.b, fontSize: 10, color: C.warmGray, marginTop: 1 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ display: "flex", gap: 10, overflowX: "auto", marginBottom: 22, paddingBottom: 4 }}>
        {[
          { icon: "☕", label: "Pesan", t: 1 },
          { icon: "🤝", label: "Traktir", t: 2 },
          { icon: "💬", label: "Obrolan", t: 5 },
          { icon: "🌱", label: "Cerita", t: 3 },
          { icon: "🛍️", label: "Toserbaku", t: 4 },
        ].map((a) => (
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

      {/* ── REWARD GOTONG ROYONG ── */}
      <div style={{ background: C.leafSoft, borderRadius: 16, padding: 18, marginBottom: 22, border: `1px solid ${C.leaf}25` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontFamily: F.u, fontSize: 12, fontWeight: 700, color: C.leaf, letterSpacing: 0.5 }}>🤝 GOTONG ROYONG CIPETE</span>
          <span style={{ fontFamily: F.d, fontSize: 14, color: C.leaf, fontWeight: 700 }}>{gotongPct} / {gotongTotal}</span>
        </div>
        <p style={{ fontFamily: F.b, fontSize: 12, color: C.coffeeMid, margin: "0 0 10px" }}>
          Kunjungan kolektif warga TUKU Cipete bulan ini
        </p>
        <div style={{ height: 8, background: C.white, borderRadius: 999, overflow: "hidden", marginBottom: 14, position: "relative" }}>
          <div style={{ height: "100%", width: `${gotongPct}%`, background: `linear-gradient(90deg, ${C.leaf}, ${C.leafLight})`, borderRadius: 999, transition: "width 0.6s ease" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { at: 50, icon: "✅", t: "Es Kopi Susu Tetangga gratis", unlocked: true },
            { at: 75, icon: "✅", t: "Tasting biji Flores baru", unlocked: true },
            { at: 100, icon: "🎯", t: "Barista Workshop gratis · 13 lagi!", unlocked: false },
            { at: 150, icon: "🔒", t: "Tumbler edisi Cipete", unlocked: false },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "7px 10px", borderRadius: 8,
              background: r.at === 100 ? `${C.aren}25` : "transparent",
              opacity: r.unlocked ? 1 : 0.85,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: 13 }}>{r.icon}</span>
                <span style={{ fontFamily: F.b, fontSize: 12, color: r.unlocked ? C.coffeeMid : C.coffee, fontWeight: r.at === 100 ? 700 : 500, textDecoration: r.unlocked ? "line-through" : "none" }}>{r.t}</span>
              </div>
              <span style={{ fontFamily: F.u, fontSize: 10, color: C.leaf, fontWeight: 700, flexShrink: 0 }}>{r.at}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── KABAR TETANGGA ── */}
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

function AppOrder({ goTo, openBatch }: { goTo: (n: number) => void; openBatch: (id: number) => void }) {
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
                    <button onClick={() => openBatch(item.id)} style={{ all: "unset", cursor: "pointer", fontFamily: F.u, fontSize: 11, fontWeight: 600, color: C.leaf, borderBottom: `1px dashed ${C.leaf}80` }}>
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

const NEIGHBORS = [
  { id: "any", name: "Tetangga siapa saja", sub: "Barista pilihkan", icon: "🎲" },
  { id: "ojek", name: "Tukang Ojek di depan", sub: "Bang Roni & rekan", icon: "🛵" },
  { id: "mhs", name: "Mahasiswa nugas", sub: "Yang lagi cari WiFi", icon: "🎓" },
  { id: "satpam", name: "Satpam komplek", sub: "Pak Yono shift pagi", icon: "🛡️" },
  { id: "guru", name: "Guru SD seberang", sub: "Bu Sari & rekan", icon: "📚" },
];

const TRAKTIR_MENU = MENU.filter(m => m.cat === "coffee");

function AppTraktir() {
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0=pilih, 1=konfirmasi, 2=sukses
  const [menuId, setMenuId] = useState(1);
  const [qty, setQty] = useState(1);
  const [recipient, setRecipient] = useState("any");
  const [note, setNote] = useState("");

  const item = TRAKTIR_MENU.find(m => m.id === menuId)!;
  const recip = NEIGHBORS.find(n => n.id === recipient)!;
  const total = item.price * qty;

  const reset = () => { setStep(0); setMenuId(1); setQty(1); setRecipient("any"); setNote(""); };

  // ── SUKSES ──
  if (step === 2) return (
    <div style={{ padding: "50px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 14 }}>🤝</div>
      <h2 style={{ fontFamily: F.d, fontSize: 26, color: C.coffee, margin: "0 0 6px", fontWeight: 700 }}>Terima kasih, Tetangga Baik!</h2>
      <p style={{ fontFamily: F.h, fontSize: 22, color: C.aren, marginBottom: 22 }}>{qty} {item.name} menunggu</p>

      <div style={{ background: C.warmWhite, border: `1px solid ${C.softBrown}25`, borderRadius: 14, padding: 16, textAlign: "left", maxWidth: 320, margin: "0 auto 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: F.u, fontSize: 11, color: C.warmGray, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Untuk</span>
          <span style={{ fontFamily: F.b, fontSize: 13, color: C.coffee, fontWeight: 700 }}>{recip.icon} {recip.name}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: F.u, fontSize: 11, color: C.warmGray, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Toko</span>
          <span style={{ fontFamily: F.b, fontSize: 13, color: C.coffee, fontWeight: 700 }}>{USER.rumah}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: F.u, fontSize: 11, color: C.warmGray, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Total</span>
          <span style={{ fontFamily: F.b, fontSize: 13, color: C.aren, fontWeight: 700 }}>{fmt(total)}</span>
        </div>
        {note && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${C.softBrown}40` }}>
            <p style={{ fontFamily: F.h, fontSize: 17, color: C.coffeeMid, margin: 0, fontStyle: "italic", textAlign: "center" }}>"{note}"</p>
          </div>
        )}
      </div>

      <p style={{ fontFamily: F.b, fontSize: 13, color: C.coffeeMid, lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
        Barista akan bilang: <em style={{ color: C.aren }}>"Ada kopi dari tetangga baik."</em>
      </p>
      <button onClick={reset} style={{ all: "unset", cursor: "pointer", marginTop: 22, fontFamily: F.u, fontSize: 13, color: C.aren, fontWeight: 600 }}>← Traktir lagi</button>
    </div>
  );

  // ── KONFIRMASI ──
  if (step === 1) return (
    <div style={{ padding: 18 }}>
      <button onClick={() => setStep(0)} style={{ all: "unset", cursor: "pointer", fontFamily: F.u, fontSize: 12, color: C.warmGray, fontWeight: 600, marginBottom: 12 }}>← Ubah</button>
      <h2 style={{ fontFamily: F.d, fontSize: 24, color: C.coffee, margin: "0 0 4px", fontWeight: 700 }}>Konfirmasi Traktiran</h2>
      <p style={{ fontFamily: F.b, fontSize: 13, color: C.warmGray, margin: "0 0 18px" }}>Tinjau sebelum kamu kirim kebaikan ini.</p>

      <div style={{ background: C.warmWhite, borderRadius: 16, border: `1px solid ${C.softBrown}25`, padding: 18, marginBottom: 14 }}>
        {[
          ["Kopi", `${item.name} × ${qty}`],
          ["Harga", `${fmt(item.price)} / gelas`],
          ["Untuk", `${recip.icon} ${recip.name}`],
          ["Detail", recip.sub],
          ["Toko", `🏠 ${USER.rumah}`],
        ].map(([l, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < 4 ? `1px dashed ${C.softBrown}30` : "none", gap: 12 }}>
            <span style={{ fontFamily: F.u, fontSize: 11, color: C.warmGray, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{l}</span>
            <span style={{ fontFamily: F.b, fontSize: 13, color: C.coffee, fontWeight: 600, textAlign: "right" }}>{v}</span>
          </div>
        ))}
      </div>

      {note && (
        <div style={{ background: C.arenSoft, borderLeft: `3px solid ${C.aren}`, padding: "10px 14px", borderRadius: 8, marginBottom: 14 }}>
          <p style={{ fontFamily: F.h, fontSize: 17, color: C.coffeeMid, margin: 0, fontStyle: "italic" }}>"{note}"</p>
        </div>
      )}

      <div style={{ background: C.coffee, borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: F.u, fontSize: 10, color: C.cream, opacity: 0.7, letterSpacing: 1, textTransform: "uppercase" }}>Total bayar</div>
          <div style={{ fontFamily: F.d, fontSize: 24, color: C.arenGlow, fontWeight: 700 }}>{fmt(total)}</div>
        </div>
        <button onClick={() => setStep(2)} style={{ all: "unset", cursor: "pointer", background: C.aren, borderRadius: 11, padding: "13px 22px", fontFamily: F.u, fontSize: 14, fontWeight: 700, color: C.white }}>Kirim Traktiran 🤝</button>
      </div>
      <p style={{ fontFamily: F.b, fontSize: 11.5, color: C.warmGray, textAlign: "center", margin: 0 }}>Pembayaran via TUKU Wallet · saldo cukup</p>
    </div>
  );

  // ── PILIH ──
  return (
    <div style={{ padding: 18 }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontFamily: F.u, fontSize: 11, color: C.aren, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Kebaikan dalam satu tap</p>
        <h2 style={{ fontFamily: F.d, fontSize: 26, color: C.coffee, margin: "4px 0 6px", fontWeight: 700 }}>Traktir Tetangga</h2>
        <p style={{ fontFamily: F.b, fontSize: 13, color: C.coffeeMid, margin: 0, lineHeight: 1.5 }}>
          Pilih kopi, tentukan untuk siapa, lalu kirim.
        </p>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.aren} 0%, ${C.arenLight} 100%)`, borderRadius: 14, padding: "14px 18px", color: C.white, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: F.d, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>3</div>
          <p style={{ fontFamily: F.h, fontSize: 14, margin: 0, opacity: 0.95 }}>kopi tersedia hari ini</p>
        </div>
        <div style={{ fontSize: 32 }}>☕</div>
      </div>

      {/* STEP 1: Pilih kopi */}
      <p style={{ fontFamily: F.u, fontSize: 11, fontWeight: 700, color: C.aren, margin: "0 0 8px", letterSpacing: 1.2, textTransform: "uppercase" }}>1 · Pilih kopi</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {TRAKTIR_MENU.map(m => (
          <button key={m.id} onClick={() => setMenuId(m.id)} style={{
            all: "unset", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 14px", borderRadius: 12,
            background: menuId === m.id ? C.coffee : C.warmWhite,
            border: `1.5px solid ${menuId === m.id ? C.coffee : C.softBrown + "25"}`,
            transition: "all 0.2s",
          }}>
            <div>
              <div style={{ fontFamily: F.u, fontSize: 13, fontWeight: 700, color: menuId === m.id ? C.cream : C.coffee }}>{m.name}{m.pop && " ★"}</div>
              <div style={{ fontFamily: F.b, fontSize: 11, color: menuId === m.id ? C.arenGlow : C.warmGray, marginTop: 2 }}>{m.desc}</div>
            </div>
            <div style={{ fontFamily: F.u, fontSize: 13, fontWeight: 700, color: menuId === m.id ? C.arenGlow : C.aren }}>{fmt(m.price)}</div>
          </button>
        ))}
      </div>

      {/* STEP 2: Jumlah */}
      <p style={{ fontFamily: F.u, fontSize: 11, fontWeight: 700, color: C.aren, margin: "0 0 8px", letterSpacing: 1.2, textTransform: "uppercase" }}>2 · Jumlah gelas</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {[1, 3, 5, 10].map(n => (
          <button key={n} onClick={() => setQty(n)} style={{ all: "unset", cursor: "pointer", flex: 1, height: 44, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.u, fontSize: 16, fontWeight: 700, background: qty === n ? C.coffee : C.parchment, color: qty === n ? C.cream : C.coffeeMid, transition: "all 0.2s" }}>{n}</button>
        ))}
      </div>

      {/* STEP 3: Untuk siapa */}
      <p style={{ fontFamily: F.u, fontSize: 11, fontWeight: 700, color: C.aren, margin: "0 0 8px", letterSpacing: 1.2, textTransform: "uppercase" }}>3 · Untuk siapa</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {NEIGHBORS.map(n => (
          <button key={n.id} onClick={() => setRecipient(n.id)} style={{
            all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 12,
            background: recipient === n.id ? C.leafSoft : C.warmWhite,
            border: `1.5px solid ${recipient === n.id ? C.leaf : C.softBrown + "25"}`,
            transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 22 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.u, fontSize: 13, fontWeight: 700, color: C.coffee }}>{n.name}</div>
              <div style={{ fontFamily: F.b, fontSize: 11, color: C.warmGray, marginTop: 1 }}>{n.sub}</div>
            </div>
            {recipient === n.id && <div style={{ fontFamily: F.u, fontSize: 16, color: C.leaf, fontWeight: 700 }}>✓</div>}
          </button>
        ))}
      </div>

      {/* STEP 4: Pesan */}
      <p style={{ fontFamily: F.u, fontSize: 11, fontWeight: 700, color: C.aren, margin: "0 0 8px", letterSpacing: 1.2, textTransform: "uppercase" }}>4 · Pesan (opsional)</p>
      <input value={note} onChange={e => setNote(e.target.value)} placeholder="Semangat, tetangga!" maxLength={60} style={{ width: "100%", padding: "11px 14px", borderRadius: 11, border: `1px solid ${C.softBrown}35`, background: C.warmWhite, fontFamily: F.h, fontSize: 16, color: C.coffee, outline: "none", boxSizing: "border-box", marginBottom: 22 }} />

      {/* SUMMARY + CTA */}
      <div style={{ background: C.coffee, borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: F.u, fontSize: 10, color: C.cream, opacity: 0.7, letterSpacing: 1, textTransform: "uppercase" }}>{qty} gelas · untuk {recip.name.toLowerCase()}</div>
          <div style={{ fontFamily: F.d, fontSize: 22, color: C.arenGlow, fontWeight: 700 }}>{fmt(total)}</div>
        </div>
        <button onClick={() => setStep(1)} style={{ all: "unset", cursor: "pointer", background: C.aren, borderRadius: 11, padding: "12px 22px", fontFamily: F.u, fontSize: 14, fontWeight: 700, color: C.white }}>Lanjut →</button>
      </div>

      <p style={{ fontFamily: F.b, fontSize: 12.5, color: C.warmGray, marginTop: 16, textAlign: "center", lineHeight: 1.5 }}>
        Kamu sudah mentraktir <strong style={{ color: C.aren }}>{USER.traktirGiven} gelas</strong> sejak bergabung. 🙏
      </p>
    </div>
  );
}

function AppCerita({ batchId }: { batchId: number | null }) {
  const item = batchId != null ? MENU.find(m => m.id === batchId) : undefined;
  const activeStep = item?.batchStep ?? 4;
  const [openStep, setOpenStep] = useState<number | null>(null);
  useEffect(() => { setOpenStep(null); }, [batchId]);
  const headerSub = item?.batchLabel ?? "Es Kopi Susu Tetangga";
  const origin = item?.origin ?? FARMER.region;
  const harvest = item?.harvest ?? FARMER.harvest;
  type Step = { ic: string; l: string; d: string; title: string; desc: string; info: [string, string][] };
  const steps: Step[] = [
    {
      ic: "🌱", l: "Ditanam", d: "Kebun Pak Ahmad, 1.400 mdpl",
      title: "Ditanam di lereng tinggi",
      desc: "Pohon arabika tumbuh pelan di tanah vulkanik dengan naungan pohon lamtoro. Suhu dingin malam hari memekatkan rasa di dalam ceri kopi.",
      info: [["Petani", FARMER.name], ["Kebun", `${origin}, 1.400 mdpl`], ["Varietas", "Sigararutang & Ateng"], ["Naungan", "Lamtoro & dadap"]],
    },
    {
      ic: "🫘", l: "Dipanen", d: harvest,
      title: "Dipetik selektif (red cherry only)",
      desc: "Hanya ceri yang sudah merah penuh yang dipetik tangan — kunci rasa manis alami dan menghindari rasa hijau atau astringen.",
      info: [["Metode", "Hand-picked, selektif"], ["Periode", harvest], ["Hasil", "± 1,8 ton ceri"], ["Sortir", "Floating tank di kebun"]],
    },
    {
      ic: "🏭", l: "Diproses", d: "Full washed",
      title: "Full washed di rumah proses desa",
      desc: "Ceri dikupas, biji difermentasi 24–36 jam, lalu dicuci bersih dan dijemur di para-para. Menghasilkan profil rasa bersih dengan keasaman cerah.",
      info: [["Metode", "Full washed"], ["Fermentasi", "24–36 jam"], ["Pengeringan", "12–14 hari di para-para"], ["Kadar air", "10,5–11%"]],
    },
    {
      ic: "🔥", l: "Di-roast", d: "Medium, Adena Coffee",
      title: "Di-roast medium di Jakarta",
      desc: "Roaster Adena Coffee memanggang biji hijau ini dengan profil medium — cukup untuk membuka manis karamel tanpa menutup karakter asli kebunnya.",
      info: [["Roaster", "Adena Coffee, Jakarta"], ["Profil", "Medium (Agtron 58)"], ["Drum", "Probat 12 kg"], ["Rest time", "5–7 hari sebelum disajikan"]],
    },
    {
      ic: "☕", l: "Diseduh", d: "Barista Rizky, hari ini",
      title: "Diseduh segar oleh barista rumahmu",
      desc: "Espresso double shot, ditemani gula aren cair Mang Ade dan susu segar. Disajikan dingin di gelas yang sudah kamu kenal di TUKU rumahmu.",
      info: [["Barista", "Rizky · TUKU Cipete"], ["Resep", "Double shot 18→36 g"], ["Pasangan", "Gula aren Mang Ade · susu segar"], ["Waktu", "Hari ini"]],
    },
  ];
  return (
    <div style={{ padding: 18 }}>
      <style>{`@keyframes batchPulse { 0%,100% { box-shadow: 0 0 0 4px ${C.aren}25 } 50% { box-shadow: 0 0 0 7px ${C.aren}10 } } @keyframes batchFade { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }`}</style>
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontFamily: F.u, fontSize: 11, color: C.aren, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Di balik gelasmu</p>
        <h2 style={{ fontFamily: F.d, fontSize: 26, color: C.coffee, margin: "4px 0 4px", fontWeight: 700 }}>Cerita Kopi</h2>
        <p style={{ fontFamily: F.b, fontSize: 13, color: C.warmGray, margin: 0 }}>Batch aktif · {headerSub}</p>
      </div>

      {/* RINGKASAN BATCH */}
      <div key={`sum-${batchId ?? "default"}`} style={{ background: C.warmWhite, border: `1px solid ${C.softBrown}25`, borderRadius: 14, padding: 14, marginBottom: 16, animation: "batchFade 0.4s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, color: C.aren, letterSpacing: 1.5, textTransform: "uppercase" }}>Ringkasan Batch</span>
          <span style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, color: C.white, background: C.leaf, padding: "2px 8px", borderRadius: 999, letterSpacing: 1, textTransform: "uppercase" }}>Aktif</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16, lineHeight: "18px" }}>📍</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: F.u, fontSize: 9, fontWeight: 600, color: C.warmGray, letterSpacing: 1, textTransform: "uppercase" }}>Asal</div>
              <div style={{ fontFamily: F.u, fontSize: 12.5, fontWeight: 700, color: C.coffee }}>{origin}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16, lineHeight: "18px" }}>📅</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: F.u, fontSize: 9, fontWeight: 600, color: C.warmGray, letterSpacing: 1, textTransform: "uppercase" }}>Panen</div>
              <div style={{ fontFamily: F.u, fontSize: 12.5, fontWeight: 700, color: C.coffee }}>{harvest}</div>
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: `${C.softBrown}25`, margin: "4px 0 10px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { ic: "🌿", bg: `${C.leaf}20`, name: FARMER.name, role: "Petani Kopi" },
            { ic: "🌴", bg: `${C.aren}25`, name: "Mang Ade", role: "Perajin Gula Aren · Cianjur" },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{p.ic}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: F.u, fontSize: 12.5, fontWeight: 700, color: C.coffee, lineHeight: 1.2 }}>{p.name}</div>
                <div style={{ fontFamily: F.b, fontSize: 11, color: C.warmGray, lineHeight: 1.2 }}>{p.role}</div>
              </div>
            </div>
          ))}
        </div>
        <a href="#batch-petani" style={{ display: "inline-block", marginTop: 10, fontFamily: F.u, fontSize: 11, fontWeight: 600, color: C.aren, textDecoration: "none", borderBottom: `1px dashed ${C.aren}80` }}>Lihat detail ↓</a>
      </div>

      {/* PETANI KOPI PROFILE */}
      <div id="batch-petani" style={{ background: `linear-gradient(135deg, ${C.leaf} 0%, ${C.leafLight} 100%)`, borderRadius: 18, padding: 20, color: C.white, marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 12, right: 14, fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", background: "#ffffff25", padding: "3px 8px", borderRadius: 999 }}>Petani Kopi</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ffffff20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🌿</div>
          <div>
            <h3 style={{ fontFamily: F.d, fontSize: 22, margin: "0 0 2px", fontWeight: 700 }}>{FARMER.name}</h3>
            <p style={{ fontFamily: F.h, fontSize: 17, margin: 0, opacity: 0.95 }}>{FARMER.region}</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[["Ketinggian", FARMER.alt], ["Panen", FARMER.harvest], ["Varietas", FARMER.var], ["Proses", FARMER.proc]].map(([l, v], i) => (
            <div key={i} style={{ background: "#ffffff15", borderRadius: 9, padding: "8px 10px" }}>
              <div style={{ fontFamily: F.u, fontSize: 9, opacity: 0.75, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
              <div style={{ fontFamily: F.b, fontSize: 12, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontFamily: F.b, fontSize: 14.5, color: C.coffeeMid, lineHeight: 1.7, marginBottom: 22 }}>{FARMER.story}</p>

      {/* PERAJIN GULA AREN PROFILE */}
      <div style={{ background: `linear-gradient(135deg, ${C.aren} 0%, ${C.arenLight} 100%)`, borderRadius: 18, padding: 20, color: C.white, marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 12, right: 14, fontFamily: F.u, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", background: "#ffffff30", padding: "3px 8px", borderRadius: 999 }}>Perajin Gula Aren</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ffffff25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🌴</div>
          <div>
            <h3 style={{ fontFamily: F.d, fontSize: 22, margin: "0 0 2px", fontWeight: 700 }}>Mang Ade</h3>
            <p style={{ fontFamily: F.h, fontSize: 17, margin: 0, opacity: 0.95 }}>Cianjur, Jawa Barat</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[["Pohon", "Aren tua, 25 thn"], ["Metode", "Sadap pagi · masak kayu"], ["Bentuk", "Cair, tanpa pengawet"], ["Sejak", "Generasi ke-3"]].map(([l, v], i) => (
            <div key={i} style={{ background: "#ffffff20", borderRadius: 9, padding: "8px 10px" }}>
              <div style={{ fontFamily: F.u, fontSize: 9, opacity: 0.85, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
              <div style={{ fontFamily: F.b, fontSize: 12, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontFamily: F.b, fontSize: 14.5, color: C.coffeeMid, lineHeight: 1.7, marginBottom: 26 }}>
        Mang Ade menyadap nira aren setiap subuh, lalu memasaknya pelan di tungku kayu sampai jadi gula aren cair — karakter karamel alami yang bikin Es Kopi Susu Tetangga punya rasa yang tidak bisa ditiru.
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "0 0 14px" }}>
        <h3 style={{ fontFamily: F.d, fontSize: 18, color: C.coffee, margin: 0, fontWeight: 700 }}>Perjalanan kopimu</h3>
        <span style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, color: C.aren, letterSpacing: 1, textTransform: "uppercase" }}>Langkah {activeStep + 1}/{steps.length}</span>
      </div>
      <div key={batchId ?? "default"} style={{ display: "flex", flexDirection: "column", gap: 0, animation: "batchFade 0.4s ease" }}>
        {steps.map((s, i) => {
          const { ic, l, d } = s;
          const status: "done" | "active" | "next" = i < activeStep ? "done" : i === activeStep ? "active" : "next";
          const ringSize = status === "active" ? 44 : 36;
          const ringBg = status === "done" ? C.leaf : status === "active" ? C.aren : C.warmWhite;
          const ringBorder = status === "next" ? `1.5px dashed ${C.softBrown}` : `1.5px solid ${status === "done" ? C.leaf : C.aren}`;
          const ringColor = status === "next" ? C.softBrown : C.white;
          const lineColor = i < activeStep ? C.leaf : C.softBrown;
          const lineStyle = i < activeStep ? "solid" : "dashed";
          const labelColor = status === "active" ? C.aren : status === "done" ? C.coffee : C.warmGray;
          const subColor = status === "next" ? C.warmGray : C.coffeeMid;
          const isOpen = openStep === i;
          return (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", opacity: status === "next" ? 0.55 : 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 44 }}>
                <button
                  onClick={() => setOpenStep(isOpen ? null : i)}
                  aria-label={`Detail langkah ${l}`}
                  aria-expanded={isOpen}
                  style={{
                    all: "unset", cursor: "pointer",
                    width: ringSize, height: ringSize, borderRadius: "50%",
                    background: status === "next" ? C.warmWhite : ringBg,
                    border: ringBorder, color: ringColor,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: status === "active" ? 20 : 17,
                    boxShadow: isOpen ? `0 0 0 5px ${C.aren}35` : status === "active" ? `0 0 0 4px ${C.aren}25` : "none",
                    animation: status === "active" && !isOpen ? "batchPulse 2.2s ease-in-out infinite" : "none",
                    transition: "all 0.25s ease",
                  }}
                >{status === "done" ? "✓" : ic}</button>
                {i < steps.length - 1 && <div style={{ width: 0, flex: 1, minHeight: status === "active" ? 22 : 18, borderLeft: `1.5px ${lineStyle} ${lineColor}`, opacity: i < activeStep ? 0.7 : 0.4 }} />}
              </div>
              <div style={{ paddingTop: status === "active" ? 10 : 6, paddingBottom: i < steps.length - 1 ? 14 : 0, flex: 1 }}>
                <button
                  onClick={() => setOpenStep(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{ all: "unset", cursor: "pointer", display: "block", width: "100%" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: F.u, fontSize: status === "active" ? 14 : 13, fontWeight: 700, color: labelColor }}>{l}</span>
                    {status === "active" && <span style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, color: C.white, background: C.aren, padding: "2px 7px", borderRadius: 999, letterSpacing: 1, textTransform: "uppercase" }}>Sekarang</span>}
                    {status === "done" && <span style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, color: C.leaf, letterSpacing: 1, textTransform: "uppercase" }}>Selesai</span>}
                    <span style={{ marginLeft: "auto", fontFamily: F.u, fontSize: 11, color: C.aren, fontWeight: 700, transition: "transform 0.25s ease", transform: isOpen ? "rotate(180deg)" : "none" }}>⌄</span>
                  </div>
                  <div style={{ fontFamily: F.b, fontSize: 12.5, color: subColor }}>{d}</div>
                </button>
                {isOpen && (
                  <div style={{ marginTop: 10, padding: 12, background: C.warmWhite, border: `1px solid ${C.aren}30`, borderRadius: 12, animation: "batchFade 0.25s ease" }}>
                    <div style={{ fontFamily: F.d, fontSize: 14, fontWeight: 700, color: C.coffee, marginBottom: 6 }}>{s.title}</div>
                    <p style={{ fontFamily: F.b, fontSize: 12.5, color: C.coffeeMid, lineHeight: 1.55, margin: "0 0 10px" }}>{s.desc}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {s.info.map(([k, v], j) => (
                        <div key={j} style={{ background: C.parchment, borderRadius: 8, padding: "6px 9px" }}>
                          <div style={{ fontFamily: F.u, fontSize: 9, fontWeight: 700, color: C.warmGray, letterSpacing: 1, textTransform: "uppercase" }}>{k}</div>
                          <div style={{ fontFamily: F.u, fontSize: 11.5, fontWeight: 700, color: C.coffee, lineHeight: 1.3 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExpeditionMap({ cities, query = "", onClear }: { cities: City[]; query?: string; onClear?: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const home = cities.find(c => c.home);
  const totalStores = cities.reduce((n, c) => n + c.stores.length, 0);
  const current = selected ? cities.find(c => c.city === selected) ?? null : null;
  const q = query.trim().toLowerCase();
  const isMatch = (name: string) => q !== "" && name.toLowerCase().includes(q);

  // Reset city view jika kota terpilih hilang akibat filter
  useEffect(() => {
    if (selected && !cities.find(c => c.city === selected)) setSelected(null);
  }, [cities, selected]);

  // Empty state
  if (cities.length === 0) {
    return (
      <div style={{ background: C.warmWhite, border: `1px solid ${C.softBrown}25`, borderRadius: 16, padding: 24, marginBottom: 18, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 6 }}>🔎</div>
        <p style={{ fontFamily: F.u, fontSize: 13, fontWeight: 700, color: C.coffee, margin: "0 0 4px" }}>Tidak ada toko cocok</p>
        <p style={{ fontFamily: F.b, fontSize: 12, color: C.warmGray, margin: "0 0 12px" }}>Coba kata kunci lain atau ganti region.</p>
        {onClear && (
          <button onClick={onClear} style={{ all: "unset", cursor: "pointer", fontFamily: F.u, fontSize: 11, fontWeight: 700, color: C.white, background: C.aren, padding: "8px 14px", borderRadius: 999 }}>Bersihkan filter</button>
        )}
      </div>
    );
  }

  const styles = `
    @keyframes mapFade { from { opacity: 0; transform: scale(0.985) } to { opacity: 1; transform: none } }
    @keyframes haloPulse { 0% { opacity: 0.55; r: 7 } 100% { opacity: 0; r: 18 } }
    @keyframes dashFlow { to { stroke-dashoffset: -14 } }
    .em-pin { cursor: pointer; transition: transform 0.2s ease; transform-origin: center; transform-box: fill-box; }
    .em-pin:hover { transform: scale(1.18); }
    .em-route { stroke-dasharray: 3 4; animation: dashFlow 1.4s linear infinite; }
    .em-halo { animation: haloPulse 2s ease-out infinite; transform-origin: center; transform-box: fill-box; }
    .em-canvas { animation: mapFade 0.4s ease; }
  `;

  return (
    <div style={{ background: C.warmWhite, border: `1px solid ${C.softBrown}25`, borderRadius: 16, padding: 14, marginBottom: 18 }}>
      <style>{styles}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <p style={{ fontFamily: F.u, fontSize: 10, color: C.aren, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Peta Ekspedisi</p>
          <h3 style={{ fontFamily: F.d, fontSize: 16, color: C.coffee, margin: "2px 0 0", fontWeight: 700 }}>
            {current ? `${current.flag} ${current.city}` : "Rute tetangga sedunia"}
          </h3>
        </div>
        {current ? (
          <button onClick={() => setSelected(null)} style={{ all: "unset", cursor: "pointer", fontFamily: F.u, fontSize: 11, fontWeight: 600, color: C.aren, background: C.parchment, padding: "6px 10px", borderRadius: 999 }}>← Semua kota</button>
        ) : (
          <span style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, color: C.coffeeMid, background: C.parchment, padding: "4px 9px", borderRadius: 999, letterSpacing: 0.5 }}>{cities.length} kota · {totalStores} toko</span>
        )}
      </div>

      {!current ? (
        <>
          <svg key="world" className="em-canvas" viewBox="0 0 360 200" style={{ width: "100%", height: 200, background: C.parchment, borderRadius: 12, display: "block" }}>
            <defs>
              <pattern id="dotgrid" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.7" fill={`${C.softBrown}55`} />
              </pattern>
            </defs>
            <rect x="0" y="0" width="360" height="200" fill="url(#dotgrid)" />
            {/* Stylized continents */}
            <path d="M40,40 Q70,20 110,30 Q160,38 180,55 Q200,75 175,90 Q150,98 120,90 Q80,82 55,72 Q35,60 40,40 Z" fill={`${C.softBrown}35`} />
            <path d="M195,95 Q230,80 265,90 Q305,98 320,120 Q325,145 305,160 Q280,170 250,165 Q220,160 200,150 Q180,130 195,95 Z" fill={`${C.softBrown}35`} />
            <path d="M295,170 Q315,168 325,180 Q322,192 305,190 Q290,188 295,170 Z" fill={`${C.softBrown}35`} />

            {/* Routes home -> visited */}
            {home && cities.filter(c => !c.home).map((c, i) => {
              const h = home;
              const mx = (h.coord.x + c.coord.x) / 2;
              const my = Math.min(h.coord.y, c.coord.y) - 30;
              return (
                <path key={i} d={`M${h.coord.x},${h.coord.y} Q${mx},${my} ${c.coord.x},${c.coord.y}`} fill="none" stroke={C.aren} strokeWidth="1.3" className="em-route" opacity="0.75" />
              );
            })}

            {/* Pins */}
            {cities.map((c, i) => {
              const isHome = !!c.home;
              const color = isHome ? C.leaf : C.aren;
              const labelAbove = c.city !== "Bandung";
              return (
                <g key={i} role="button" tabIndex={0} aria-label={`Buka ${c.city}`} onClick={() => setSelected(c.city)} onKeyDown={(e) => { if (e.key === "Enter") setSelected(c.city); }} className="em-pin">
                  <circle cx={c.coord.x} cy={c.coord.y} r="7" fill={color} className="em-halo" opacity="0.4" />
                  <circle cx={c.coord.x} cy={c.coord.y} r="5.5" fill={color} stroke={C.white} strokeWidth="1.5" />
                  {isHome && <text x={c.coord.x} y={c.coord.y + 2.2} fontSize="6" textAnchor="middle" fill={C.white}>🏠</text>}
                  <text
                    x={c.coord.x}
                    y={labelAbove ? c.coord.y - 10 : c.coord.y + 16}
                    fontFamily={F.u} fontSize="8.5" fontWeight={700} textAnchor="middle"
                    fill={C.coffee} style={{ letterSpacing: 0.6, textTransform: "uppercase" }}
                  >
                    {c.city}
                  </text>
                </g>
              );
            })}
          </svg>
          <div style={{ display: "flex", gap: 14, marginTop: 8, fontFamily: F.u, fontSize: 10, color: C.warmGray, fontWeight: 600, flexWrap: "wrap" }}>
            <span><span style={{ color: C.leaf }}>●</span> Rumah</span>
            <span><span style={{ color: C.aren }}>●</span> Dikunjungi</span>
            <span><span style={{ color: C.aren }}>╌</span> Rute</span>
            <span style={{ marginLeft: "auto", color: C.aren, fontWeight: 700 }}>Ketuk pin →</span>
          </div>
        </>
      ) : (
        <>
          <svg key={current.city} className="em-canvas" viewBox="0 0 320 220" style={{ width: "100%", height: 220, background: C.parchment, borderRadius: 12, display: "block" }}>
            <defs>
              <pattern id="citygrid" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.6" fill={`${C.softBrown}40`} />
              </pattern>
            </defs>
            <rect x="0" y="0" width="320" height="220" fill="url(#citygrid)" />
            {/* Stylized streets */}
            <path d="M0,70 Q120,55 220,80 T320,90" fill="none" stroke={`${C.softBrown}55`} strokeWidth="1.2" />
            <path d="M0,150 Q90,140 180,160 T320,150" fill="none" stroke={`${C.softBrown}55`} strokeWidth="1.2" />
            <path d="M80,0 Q92,90 75,160 T90,220" fill="none" stroke={`${C.softBrown}55`} strokeWidth="1.2" />
            <path d="M220,0 Q210,80 230,160 T220,220" fill="none" stroke={`${C.softBrown}55`} strokeWidth="1.2" />
            {/* Park / river blob */}
            <ellipse cx="60" cy="50" rx="38" ry="22" fill={`${C.leaf}25`} />
            <path d="M250,180 Q280,170 300,185 Q310,200 290,210 Q265,212 250,200 Z" fill={`${C.leaf}25`} />

            {/* Store pins */}
            {current.stores.map((s, i) => {
              const color = s.home ? C.leaf : C.aren;
              const matched = isMatch(s.name) || isMatch(current.city);
              const dim = q !== "" && !matched;
              return (
                <g key={i} opacity={dim ? 0.4 : 1}>
                  {matched && <circle cx={s.x} cy={s.y - 4} r="14" fill="none" stroke={C.aren} strokeWidth="1.5" strokeDasharray="3 3" />}
                  <circle cx={s.x} cy={s.y} r="8" fill={color} className="em-halo" opacity="0.35" />
                  <path d={`M${s.x},${s.y - 12} C${s.x - 7},${s.y - 12} ${s.x - 7},${s.y - 2} ${s.x},${s.y + 5} C${s.x + 7},${s.y - 2} ${s.x + 7},${s.y - 12} ${s.x},${s.y - 12} Z`} fill={color} stroke={C.white} strokeWidth="1.3" />
                  <circle cx={s.x} cy={s.y - 7} r="2.5" fill={C.white} />
                  <text x={s.x} y={s.y + 18} fontFamily={F.u} fontSize="9.5" fontWeight={700} textAnchor="middle" fill={C.coffee}>
                    {s.home ? "🏠 " : ""}TUKU {s.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <p style={{ fontFamily: F.b, fontSize: 12, color: C.warmGray, margin: "8px 2px 0" }}>
            {current.home
              ? `🏠 Rumahmu. ${USER.visits} kunjungan tercatat di ${current.stores.length} toko.`
              : `Pertama dijelajahi · ${current.stores.length} toko terkunjungi.`}
          </p>
        </>
      )}
    </div>
  );
}

type Badge = {
  id: string; icon: string; name: string; sub?: string;
  desc: string; req: string;
  current: number; target: number; unit: string;
  earned: boolean; earnedAt?: string;
};
const BADGES: Badge[] = [
  { id: "seruput", icon: "☕", name: "Seruput Pertama", desc: "Awal dari segalanya — kopi pertama yang membuka ribuan cerita berikutnya.", req: "Pesan kopi pertamamu di TUKU.", current: 1, target: 1, unit: "pesanan", earned: true, earnedAt: "2023-03-12" },
  { id: "cipete", icon: "🏠", name: "Warga Cipete", desc: "Gelas-gelasmu di TUKU rumah sudah cukup untuk menamai kursi favoritmu.", req: "Kunjungi TUKU Cipete sebanyak 20 kali.", current: 147, target: 20, unit: "kunjungan", earned: true, earnedAt: "2023-07-04" },
  { id: "tetangga", icon: "🤝", name: "Tetangga Baik", sub: "10+ traktir", desc: "Tetangga sejati: yang ingat memesan dua, bukan satu.", req: "Traktir kopi 10 tetangga berbeda.", current: 12, target: 10, unit: "traktir", earned: true, earnedAt: "2024-09-19" },
  { id: "penjelajah", icon: "🗺️", name: "Penjelajah", sub: "3+ kota", desc: "Tiap kota meninggalkan aroma yang berbeda di gelasmu.", req: "Kunjungi TUKU di 3 kota berbeda.", current: 4, target: 3, unit: "kota", earned: true, earnedAt: "2025-02-05" },
  { id: "pelancong", icon: "✈️", name: "Pelancong Global", sub: "Amsterdam", desc: "Cerita TUKU melintasi benua — dan kamu ikut membawanya pulang.", req: "Kunjungi 1 toko TUKU di luar negeri.", current: 1, target: 1, unit: "toko", earned: true, earnedAt: "2025-04-21" },
  { id: "setia100", icon: "💯", name: "Setia 100", sub: "100 kunjungan", desc: "Setia bukan sekadar angka — tapi gelas demi gelas yang sama.", req: "Kumpulkan 200 kunjungan total.", current: 147, target: 200, unit: "kunjungan", earned: false },
  { id: "petani", icon: "🌱", name: "Sahabat Petani", sub: "Kunjungi 5 batch", desc: "Kopi yang baik dimulai dari tanah — kamu menyusurinya.", req: "Pesan dari 5 batch petani berbeda.", current: 2, target: 5, unit: "batch", earned: false },
  { id: "sesepuh", icon: "👑", name: "Sesepuh", sub: "Semua kota", desc: "Hanya untuk yang sudah singgah di setiap toko TUKU di dunia.", req: "Kunjungi seluruh 71 kota TUKU.", current: 6, target: 71, unit: "kota", earned: false },
];

function AppPaspor() {
  const [sub, setSub] = useState("p");
  const [region, setRegion] = useState<"all" | "nusantara" | "global">("all");
  const [query, setQuery] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const earnedCount = BADGES.filter(b => b.earned).length;
  const activeBadge = BADGES.find(b => b.id === selectedBadge) || null;
  useEffect(() => {
    if (!selectedBadge) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedBadge(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedBadge]);
  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STORES_VISITED
      .filter(c => region === "all" || (region === "nusantara" ? c.flag === "🇮🇩" : c.flag !== "🇮🇩"))
      .map(c => {
        if (!q) return c;
        const cityHit = c.city.toLowerCase().includes(q);
        const stores = cityHit ? c.stores : c.stores.filter(s => s.name.toLowerCase().includes(q));
        return { ...c, stores };
      })
      .filter(c => c.stores.length > 0);
  }, [region, query]);
  const totalFilteredStores = filteredCities.reduce((n: number, c: City) => n + c.stores.length, 0);
  const clearFilter = () => { setRegion("all"); setQuery(""); };
  const highlight = (text: string) => {
    const q = query.trim();
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return text;
    return (<>{text.slice(0, idx)}<mark style={{ background: `${C.aren}30`, color: C.coffee, padding: "0 2px", borderRadius: 3 }}>{text.slice(idx, idx + q.length)}</mark>{text.slice(idx + q.length)}</>);
  };
  return (
    <div style={{ padding: 18, position: "relative" }}>
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
          {/* EKSPEDISI PROGRESS */}
          <h3 style={{ fontFamily: F.d, fontSize: 18, color: C.coffee, margin: "0 0 10px", fontWeight: 700 }}>Ekspedisi Tetangga</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            {[
              { label: "🇮🇩 Nusantara", visited: 6, total: 71, color: C.aren, next: "Berikutnya: TUKU Bali (segera)" },
              { label: "🌍 Global", visited: 1, total: 1, color: C.leaf, next: "TUKU Amsterdam · ditaklukkan!" },
            ].map((e, i) => {
              const pct = Math.round((e.visited / e.total) * 100);
              return (
                <div key={i} style={{ background: C.warmWhite, borderRadius: 13, padding: 14, border: `1px solid ${C.softBrown}20` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <span style={{ fontFamily: F.u, fontSize: 13, fontWeight: 700, color: C.coffee }}>{e.label}</span>
                    <span style={{ fontFamily: F.d, fontSize: 16, fontWeight: 700, color: e.color }}>{e.visited}/{e.total}</span>
                  </div>
                  <div style={{ height: 7, background: C.parchment, borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: e.color, borderRadius: 999, transition: "width 0.6s ease" }} />
                  </div>
                  <p style={{ fontFamily: F.b, fontSize: 11.5, color: C.warmGray, margin: 0 }}>{e.next}</p>
                </div>
              );
            })}
          </div>

          {/* FILTER & PENCARIAN */}
          <div style={{ background: C.warmWhite, border: `1px solid ${C.softBrown}25`, borderRadius: 14, padding: 12, marginBottom: 14 }}>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, opacity: 0.6 }}>🔎</span>
              <input
                aria-label="Cari toko atau kota"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari toko atau kota…"
                style={{ width: "100%", boxSizing: "border-box", background: C.parchment, border: "none", outline: "none", borderRadius: 10, padding: "10px 34px 10px 32px", fontFamily: F.b, fontSize: 13, color: C.coffee }}
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Bersihkan pencarian" style={{ all: "unset", cursor: "pointer", position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, borderRadius: "50%", background: C.softBrown + "40", color: C.coffee, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>✕</button>
              )}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {([["all", "Semua"], ["nusantara", "🇮🇩 Nusantara"], ["global", "🌍 Global"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setRegion(k)} aria-pressed={region === k} style={{ all: "unset", cursor: "pointer", flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 999, fontFamily: F.u, fontSize: 11, fontWeight: 700, background: region === k ? C.coffee : C.parchment, color: region === k ? C.cream : C.coffeeMid, transition: "all 0.2s" }}>{l}</button>
              ))}
            </div>
            <p style={{ fontFamily: F.u, fontSize: 10, color: C.warmGray, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", margin: "10px 2px 0" }}>
              {filteredCities.length} kota · {totalFilteredStores} toko ditemukan
            </p>
          </div>

          {/* PETA EKSPEDISI */}
          <ExpeditionMap cities={filteredCities} query={query} onClear={clearFilter} />

          {/* JEJAK KOTA & TOKO */}
          <h3 style={{ fontFamily: F.d, fontSize: 18, color: C.coffee, margin: "0 0 12px", fontWeight: 700 }}>Jejak Tetangga Berkunjung</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            {filteredCities.length === 0 ? (
              <div style={{ background: C.warmWhite, borderRadius: 13, padding: 18, border: `1px dashed ${C.softBrown}40`, textAlign: "center" }}>
                <p style={{ fontFamily: F.b, fontSize: 13, color: C.warmGray, margin: "0 0 10px" }}>Tidak ada hasil. Coba kata kunci lain atau ganti region.</p>
                <button onClick={clearFilter} style={{ all: "unset", cursor: "pointer", fontFamily: F.u, fontSize: 11, fontWeight: 700, color: C.aren }}>Bersihkan filter</button>
              </div>
            ) : filteredCities.map((c, i) => (
              <div key={i} style={{ background: C.warmWhite, borderRadius: 13, padding: 14, border: `1px solid ${C.softBrown}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: F.d, fontSize: 17, fontWeight: 700, color: C.coffee }}>{c.flag} {highlight(c.city)}</span>
                  <Badge>{c.stores.length} toko</Badge>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.stores.map((s, j) => (
                    <span key={j} style={{ fontFamily: F.u, fontSize: 11, color: s.home ? C.aren : C.coffeeMid, background: C.parchment, padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>
                      {s.home ? "🏠 " : ""}TUKU {highlight(s.name)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* BADGE PENCAPAIAN */}
          <h3 style={{ fontFamily: F.d, fontSize: 18, color: C.coffee, margin: "0 0 4px", fontWeight: 700 }}>Lencana Pencapaian</h3>
          <p style={{ fontFamily: F.b, fontSize: 12, color: C.warmGray, margin: "0 0 12px" }}>{earnedCount} dari {BADGES.length} terkumpul</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {BADGES.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBadge(b.id)}
                aria-label={`Lihat detail lencana ${b.name}`}
                style={{
                  all: "unset", cursor: "pointer", display: "block",
                  background: b.earned ? C.warmWhite : C.parchment,
                  border: `1px solid ${b.earned ? C.aren + "40" : C.softBrown + "20"}`,
                  borderRadius: 12, padding: "12px 6px", textAlign: "center",
                  opacity: b.earned ? 1 : 0.55, transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
              >
                <div style={{ fontSize: 26, marginBottom: 4, filter: b.earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
                <div style={{ fontFamily: F.u, fontSize: 9.5, fontWeight: 700, color: C.coffee, lineHeight: 1.2 }}>{b.name}</div>
                {b.sub && <div style={{ fontFamily: F.u, fontSize: 8, color: C.warmGray, marginTop: 2 }}>{b.sub}</div>}
              </button>
            ))}
          </div>

          <p style={{ fontFamily: F.h, fontSize: 16, color: C.aren, textAlign: "center", marginTop: 18, marginBottom: 0 }}>
            Tetangga sejati bukan yang paling sering datang — tapi yang membuat tetangga lain merasa di rumah. 🤝
          </p>
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
      {activeBadge && (() => {
        const b = activeBadge;
        const pct = Math.min(100, Math.round((b.current / b.target) * 100));
        const remaining = Math.max(0, b.target - b.current);
        const dateStr = b.earnedAt ? new Date(b.earnedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : null;
        const fillColor = b.earned ? C.leaf : C.aren;
        return (
          <div role="dialog" aria-modal="true" aria-label={`Detail lencana ${b.name}`} style={{ position: "absolute", inset: 0, zIndex: 50 }}>
            <style>{`
              @keyframes lvBackdropIn { from { opacity: 0 } to { opacity: 1 } }
              @keyframes lvSheetIn { from { transform: translateY(28px); opacity: 0 } to { transform: none; opacity: 1 } }
              @keyframes lvHalo { 0%,100% { box-shadow: 0 0 0 6px ${C.aren}25 } 50% { box-shadow: 0 0 0 10px ${C.aren}10 } }
            `}</style>
            <div onClick={() => setSelectedBadge(null)} style={{ position: "absolute", inset: 0, background: `${C.coffee}66`, backdropFilter: "blur(2px)", animation: "lvBackdropIn 0.2s ease both" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: C.snow, borderRadius: "20px 20px 0 0", padding: 22, maxHeight: "85%", overflowY: "auto", boxShadow: `0 -10px 40px ${C.coffee}30`, animation: "lvSheetIn 0.3s ease both" }}>
              <button onClick={() => setSelectedBadge(null)} aria-label="Tutup" style={{ all: "unset", cursor: "pointer", position: "absolute", top: 12, right: 14, width: 28, height: 28, borderRadius: "50%", background: C.parchment, color: C.coffee, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>✕</button>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 18 }}>
                <div style={{
                  width: 88, height: 88, borderRadius: "50%",
                  background: b.earned ? `${C.aren}22` : `${C.softBrown}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 48, marginBottom: 12, filter: b.earned ? "none" : "grayscale(0.6)",
                  animation: b.earned ? "lvHalo 2.4s ease-in-out infinite" : "none",
                }}>{b.icon}</div>
                <h3 style={{ fontFamily: F.d, fontSize: 22, fontWeight: 700, color: C.coffee, margin: "0 0 8px" }}>{b.name}</h3>
                <span style={{
                  fontFamily: F.u, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
                  padding: "4px 10px", borderRadius: 999,
                  background: b.earned ? `${C.leaf}22` : `${C.softBrown}25`,
                  color: b.earned ? C.leaf : C.warmGray,
                }}>{b.earned ? "✓ SUDAH DIRAIH" : "🔒 BELUM DIRAIH"}</span>
                <p style={{ fontFamily: F.h, fontSize: 14, color: C.coffeeMid, margin: "12px 4px 0", lineHeight: 1.5 }}>{b.desc}</p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: C.warmGray, margin: "0 0 6px" }}>SYARAT</p>
                <p style={{ fontFamily: F.b, fontSize: 13.5, color: C.coffee, margin: 0, lineHeight: 1.5 }}>{b.req}</p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <p style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: C.warmGray, margin: 0 }}>PROGRES</p>
                  <span style={{ fontFamily: F.u, fontSize: 12, fontWeight: 700, color: C.coffee }}>{b.current}/{b.target} {b.unit} <span style={{ color: C.warmGray, fontWeight: 600 }}>· {pct}%</span></span>
                </div>
                <div style={{ height: 9, background: C.parchment, borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: fillColor, borderRadius: 999, transition: "width 0.6s ease" }} />
                </div>
              </div>

              <div style={{ marginBottom: 18, padding: "12px 14px", background: C.parchment, borderRadius: 12 }}>
                <p style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: C.warmGray, margin: "0 0 4px" }}>TANGGAL</p>
                {b.earned && dateStr ? (
                  <p style={{ fontFamily: F.b, fontSize: 13.5, color: C.coffee, margin: 0 }}>📅 Diraih pada <strong>{dateStr}</strong></p>
                ) : (
                  <p style={{ fontFamily: F.b, fontSize: 13.5, color: C.coffee, margin: 0 }}>⏳ Butuh <strong>{remaining} {b.unit}</strong> lagi untuk meraihnya</p>
                )}
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                style={{ all: "unset", cursor: "pointer", display: "block", width: "100%", boxSizing: "border-box", textAlign: "center", padding: "12px 0", borderRadius: 12, background: b.earned ? C.coffee : C.aren, color: b.earned ? C.cream : C.coffee, fontFamily: F.u, fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}
              >{b.earned ? "Tutup" : "Lanjutkan ekspedisi"}</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// OBROLAN (CHAT)
// ═══════════════════════════════════════════════════════

type ChatMsg = { from: "me" | "them"; text: string; time: string };
type Chat = {
  id: string; name: string; sub: string; avatar: string; rumah: string;
  online?: boolean; unread?: number; lastTime: string; pinned?: boolean;
  messages: ChatMsg[];
};

const CHATS: Chat[] = [
  {
    id: "rizky", name: "Barista Rizky", sub: "TUKU Cipete · Barista", avatar: "👨‍🍳", rumah: "Cipete",
    online: true, unread: 2, lastTime: "baru saja", pinned: true,
    messages: [
      { from: "them", text: "Halo Andi! Hari ini ada batch Flores baru, mau coba?", time: "10:12" },
      { from: "them", text: "Notes-nya: dark chocolate, sedikit rempah 🌶️", time: "10:12" },
    ],
  },
  {
    id: "amel", name: "Amel", sub: "Tetangga Cipete · sejak 2022", avatar: "👩", rumah: "Cipete",
    unread: 1, lastTime: "5 menit",
    messages: [
      { from: "me", text: "Sore Mel, jadi nugas di TUKU?", time: "15:01" },
      { from: "them", text: "Jadi! Tapi belom sempet mampir 😅", time: "15:08" },
    ],
  },
  {
    id: "warga", name: "💬 Warga TUKU Cipete", sub: "47 tetangga · grup rumah", avatar: "🏠", rumah: "Cipete",
    unread: 5, lastTime: "1 jam",
    messages: [
      { from: "them", text: "Pak Yono: 'Coffee tasting Sabtu, jangan lupa daftar yaa'", time: "14:02" },
      { from: "them", text: "Bu Sari: 'Aku bawa bolu pisang nih' 🍰", time: "14:18" },
    ],
  },
  {
    id: "anna", name: "Anna", sub: "TUKU Amsterdam · Barista", avatar: "👩‍🍳", rumah: "Amsterdam",
    lastTime: "kemarin",
    messages: [
      { from: "them", text: "Welcome, neighbor! Kalau mampir lagi, ada Gayo batch baru ☕", time: "kemarin" },
    ],
  },
  {
    id: "ahmad", name: "Pak Ahmad Saleh", sub: "Petani · Takengon, Aceh", avatar: "🌿", rumah: "—",
    lastTime: "2 hari",
    messages: [
      { from: "them", text: "Terima kasih sudah minum kopi dari kebun kami 🙏", time: "Sen" },
    ],
  },
];

function ChatList({ onOpen }: { onOpen: (id: string) => void }) {
  const sorted = [...CHATS].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));
  return (
    <div style={{ padding: 18 }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontFamily: F.u, fontSize: 11, color: C.aren, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Obrolan tetangga</p>
        <h2 style={{ fontFamily: F.d, fontSize: 26, color: C.coffee, margin: "4px 0 4px", fontWeight: 700 }}>Pesan</h2>
        <p style={{ fontFamily: F.b, fontSize: 13, color: C.warmGray, margin: 0 }}>Sapa barista, tetangga, atau warga rumahmu.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map(c => (
          <button key={c.id} onClick={() => onOpen(c.id)} style={{
            all: "unset", cursor: "pointer", display: "flex", gap: 12, alignItems: "center",
            background: c.unread ? C.warmWhite : C.snow,
            border: `1px solid ${c.unread ? C.aren + "30" : C.softBrown + "20"}`,
            borderRadius: 13, padding: 12,
          }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.parchment, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{c.avatar}</div>
              {c.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 11, height: 11, borderRadius: "50%", background: C.leaf, border: `2px solid ${C.snow}` }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: F.u, fontSize: 13, fontWeight: 700, color: C.coffee, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.pinned && "📌 "}{c.name}
                </span>
                <span style={{ fontFamily: F.u, fontSize: 10, color: C.warmGray, flexShrink: 0 }}>{c.lastTime}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 2 }}>
                <span style={{ fontFamily: F.b, fontSize: 12, color: C.coffeeMid, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                  {c.messages[c.messages.length - 1].text}
                </span>
                {!!c.unread && (
                  <span style={{ background: C.aren, color: C.white, fontFamily: F.u, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, flexShrink: 0 }}>{c.unread}</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatDetail({ chatId, onBack, onTraktir, onOpenBatch }: { chatId: string; onBack: () => void; onTraktir: () => void; onOpenBatch: (id: number) => void }) {
  const activeBatch = MENU.find(m => m.id === 1)!;
  const chat = CHATS.find(c => c.id === chatId)!;
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>(chat.messages);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, { from: "me", text: draft.trim(), time: "now" }]);
    setDraft("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 70px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${C.softBrown}25`, background: C.warmWhite, position: "sticky", top: 0, zIndex: 5 }}>
        <button onClick={onBack} style={{ all: "unset", cursor: "pointer", fontFamily: F.u, fontSize: 18, color: C.coffeeMid, padding: "0 4px" }}>←</button>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.parchment, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{chat.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.u, fontSize: 13, fontWeight: 700, color: C.coffee }}>{chat.name}</div>
          <div style={{ fontFamily: F.b, fontSize: 11, color: chat.online ? C.leaf : C.warmGray }}>
            {chat.online ? "● online" : chat.sub}
          </div>
        </div>
      </div>

      <button
        onClick={() => onOpenBatch(activeBatch.id)}
        aria-label={`Lihat cerita batch ${activeBatch.batchLabel}`}
        style={{ all: "unset", cursor: "pointer", display: "block", padding: "12px 16px", background: C.arenSoft, borderBottom: `1px solid ${C.aren}25` }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 22 }}>🤝</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.u, fontSize: 12, fontWeight: 700, color: C.coffee }}>Traktir {chat.name.split(" ")[0]} hari ini</div>
            <div style={{ fontFamily: F.b, fontSize: 11, color: C.coffeeMid }}>Kirim {activeBatch.name} ke {chat.rumah !== "—" ? `TUKU ${chat.rumah}` : "tokonya"}</div>
          </div>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onTraktir(); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onTraktir(); } }}
            style={{ cursor: "pointer", background: C.aren, color: C.white, fontFamily: F.u, fontSize: 11, fontWeight: 700, padding: "8px 14px", borderRadius: 999, flexShrink: 0 }}
          >Traktir →</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10, paddingLeft: 34 }}>
          <span style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, color: C.coffee, background: `${C.aren}25`, padding: "3px 8px", borderRadius: 999, letterSpacing: 0.4 }}>📍 {activeBatch.origin}</span>
          <span style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, color: C.coffee, background: `${C.aren}25`, padding: "3px 8px", borderRadius: 999, letterSpacing: 0.4 }}>📅 {activeBatch.harvest}</span>
          <span style={{ fontFamily: F.u, fontSize: 10, fontWeight: 700, color: C.coffee, background: `${C.leaf}25`, padding: "3px 8px", borderRadius: 999, letterSpacing: 0.4 }}>🌿 {FARMER.name}</span>
          <span style={{ fontFamily: F.u, fontSize: 10, fontWeight: 600, color: C.aren, padding: "3px 4px", letterSpacing: 0.4 }}>Lihat cerita →</span>
        </div>
      </button>

      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 8, background: C.cream }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%",
              background: m.from === "me" ? C.coffee : C.white,
              color: m.from === "me" ? C.cream : C.coffee,
              padding: "9px 13px",
              borderRadius: 14,
              borderTopRightRadius: m.from === "me" ? 4 : 14,
              borderTopLeftRadius: m.from === "me" ? 14 : 4,
              fontFamily: F.b, fontSize: 14, lineHeight: 1.4,
              boxShadow: `0 1px 2px ${C.coffee}10`,
            }}>
              {m.text}
              <div style={{ fontFamily: F.u, fontSize: 9, opacity: 0.5, marginTop: 3, textAlign: "right" }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${C.softBrown}25`, background: C.warmWhite, position: "sticky", bottom: 0 }}>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder={`Sapa ${chat.name.split(" ")[0]}...`}
          style={{ flex: 1, padding: "10px 14px", borderRadius: 999, border: `1px solid ${C.softBrown}35`, background: C.snow, fontFamily: F.b, fontSize: 14, color: C.coffee, outline: "none" }}
        />
        <button onClick={send} style={{ all: "unset", cursor: "pointer", width: 40, height: 40, borderRadius: "50%", background: C.aren, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>↑</button>
      </div>
    </div>
  );
}

function AppObrolan({ goTo, openBatch }: { goTo: (n: number) => void; openBatch: (id: number) => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (openId) return <ChatDetail chatId={openId} onBack={() => setOpenId(null)} onTraktir={() => goTo(3)} onOpenBatch={openBatch} />;
  return <ChatList onOpen={setOpenId} />;
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

function TukuRukunTetangga() {
  const [mode, setMode] = useState<"narrative" | "transition" | "app">("narrative");
  const [tab, setTab] = useState(0);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const openBatch = useCallback((id: number) => { setSelectedBatchId(id); setTab(3); }, []);
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
    setTimeout(() => setMode("app"), M.slow);
  }, []);

  const backToNarrative = useCallback(() => {
    setMode("transition");
    setTimeout(() => setMode("narrative"), M.med);
  }, []);

  if (mode === "transition") {
    return (
      <div style={{
        position: "fixed", inset: 0,
        background: `radial-gradient(ellipse at center, ${C.coffeeMid} 0%, ${C.coffee} 50%, #150a05 100%)`,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        zIndex: 999, overflow: "hidden",
        animation: `shellFade ${M.med}ms ${M.out} both`,
      }}>
        <style>{`
          @keyframes shellFade { from { opacity: 0 } to { opacity: 1 } }
          @keyframes pulseGlow { 0%,100% { transform: scale(1); opacity: 0.88 } 50% { transform: scale(1.04); opacity: 1 } }
          @keyframes loaderSlide { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }
          @keyframes staggerIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        `}</style>
        <GrainOverlay opacity={0.08} />
        <TukuLogo variant="light" size={140} minSize={88} maxSize={140} style={{ animation: `staggerIn ${M.med}ms ${M.out} both, pulseGlow 1.6s ${M.inOut} ${M.base}ms infinite`, filter: `drop-shadow(0 8px 30px ${C.aren}50)` }} />
        <p style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 24, color: C.arenGlow, marginTop: 22, letterSpacing: 0.5, animation: `staggerIn ${M.med}ms ${M.out} 80ms both` }}>Membuka pintu tetangga…</p>
        <div style={{ width: 180, height: 1, background: `${C.cream}20`, marginTop: 28, overflow: "hidden", position: "relative", animation: `staggerIn ${M.med}ms ${M.out} 160ms both` }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent, ${C.arenGlow}, transparent)`, animation: `loaderSlide 1.6s ${M.inOut} infinite` }} />
        </div>
      </div>
    );
  }

  if (mode === "app") {
    const screens = [
      <AppHome key="h" goTo={setTab} />,
      <AppOrder key="o" goTo={setTab} openBatch={openBatch} />,
      <AppTraktir key="t" />,
      <AppCerita key="c" batchId={selectedBatchId} />,
      <AppPaspor key="p" />,
      <AppObrolan key="m" goTo={setTab} openBatch={openBatch} />,
    ];
    return (
      <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at center, ${C.cream} 0%, ${C.parchment} 100%)`, display: "flex", justifyContent: "center", alignItems: "stretch" }}>
        <style>{`
          @keyframes screenSwap { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
          @keyframes shellFade { from { opacity: 0 } to { opacity: 1 } }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
          }
        `}</style>
        <div style={{ width: "100%", maxWidth: 420, background: C.snow, position: "relative", display: "flex", flexDirection: "column", boxShadow: `0 0 60px ${C.coffee}30, 0 0 0 1px ${C.softBrown}40`, animation: `shellFade ${M.med}ms ${M.out} both` }}>
          <AppTopBar tab={tab} onBack={backToNarrative} />

          <div ref={appRef} key={tab} style={{ flex: 1, overflowY: "auto", paddingBottom: 70, animation: `screenSwap ${M.med}ms ${M.out} both` }}>
            {screens[tab]}
          </div>

          <nav style={{ position: "sticky", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `1px solid ${C.softBrown}25`, display: "flex", padding: "8px 4px", boxShadow: `0 -2px 12px ${C.coffee}08` }}>
            <TabIcon icon="🏡" label="Rumah" active={tab === 0} onClick={() => setTab(0)} />
            <TabIcon icon="☕" label="Pesan" active={tab === 1} onClick={() => setTab(1)} />
            <TabIcon icon="💬" label="Obrolan" active={tab === 5} onClick={() => setTab(5)} />
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
      <style>{`@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; } }`}</style>
      <Masthead />
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

      <Colophon />
      <footer style={{ position: "relative", padding: "80px 24px", background: `radial-gradient(ellipse at center, ${C.coffeeMid} 0%, ${C.coffee} 60%, #15090480 100%)`, color: C.cream, textAlign: "center", overflow: "hidden" }}>
        <GrainOverlay opacity={0.08} />
        <TukuLogo variant="light" size={64} minSize={48} maxSize={64} style={{ marginBottom: 18, opacity: 0.95 }} />
        <p style={{ fontFamily: F.d, fontStyle: "italic", fontSize: 26, color: C.arenGlow, margin: "0 0 14px" }}>Mari bertetangga baik.</p>
        <div style={{ width: 40, height: 1, background: `${C.arenGlow}60`, margin: "0 auto 18px" }} />
        <p style={{ fontFamily: F.u, fontSize: 11, color: C.cream, opacity: 0.6, lineHeight: 1.9, margin: 0, letterSpacing: 1.5 }}>
          STRATEGIC ADVISORY · DIGITAL TRANSFORMATION<br />
          F&amp;B &amp; COFFEE INDUSTRY PRACTICE · MMXXVI
        </p>
      </footer>
    </main>
  );
}

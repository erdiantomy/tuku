# Logo readability: subtle blend + shadow

Goal: keep the TUKU logo crisp and legible whether it sits on cream parchment, photo grain, or dark cinematic backdrops — without it looking like a sticker.

## Scope
Only `TukuLogo` in `src/routes/index.tsx` and its existing call sites. No new assets, no layout changes.

## Changes

1. **Extend `TukuLogo` props**
   - Add `blend?: "auto" | "light" | "dark" | "none"` (default `"auto"` → derived from `variant`).
   - Add `halo?: boolean` (default `true`) to toggle the soft backdrop glow for cases where it would clash (e.g. tiny top-bar usage at 26px).

2. **Layered drop-shadow filter**
   Replace single `drop-shadow` usages with a stacked filter tuned per tone, merged with any caller-supplied `style.filter`:
   - `variant="dark"` on light bg → `drop-shadow(0 1px 0 #FFFFFFAA) drop-shadow(0 6px 18px #2A1A0F25) drop-shadow(0 0 1px #2A1A0F40)` (crisp edge + warm grounding shadow).
   - `variant="light"` on dark bg → `drop-shadow(0 0 14px #F2D9A840) drop-shadow(0 2px 10px #00000055) drop-shadow(0 0 1px #FFFFFF30)` (warm halo + depth).

3. **Soft halo backdrop (only when `halo` true and size ≥ 40)**
   Wrap `<img>` in a `<span style={{ position:"relative", display:"inline-block" }}>` and render a sibling `<span aria-hidden>` absolutely positioned behind it:
   - Light variant: `radial-gradient(closest-side, #00000028, transparent 70%)`, blur(10px), scale ~1.15.
   - Dark variant: `radial-gradient(closest-side, #F2D9A830, transparent 70%)`, blur(14px), scale ~1.2, `mixBlendMode: "screen"`.
   - Always `pointerEvents:"none"`, `zIndex:0`; img sits at `zIndex:1`.

4. **Call-site touch-ups**
   - Top-bar masthead (size 34) and footer (26): pass `halo={false}` to keep chrome clean; shadow alone is enough.
   - Splash (size 140), Hero (size 120), Reframe (size 88), CTA Letter summary (size 52): keep `halo` on; remove now-redundant inline `filter: drop-shadow(...)` from those callers so the new internal stack isn't doubled.
   - Decorative oversized watermark logo (line 723, opacity 0.045): pass `halo={false}` and `blend="none"` — it's a watermark, not a focal logo.
   - Watermark component (in `FrameOverlay`): pass `blend="none" halo={false}` for the same reason.

5. **Reduced-motion / perf**
   Halo is a static element (no animation), so no extra motion-token wiring needed. Add `willChange:"filter"` only on the splash/hero instances that already animate.

## Technical notes
- Single source of truth for the filter strings lives next to `TukuLogo` as a `LOGO_BLEND` map keyed by tone.
- Caller `style.filter` is concatenated after the internal stack so explicit overrides still win.
- No changes to `C` color tokens, `M` motion tokens, or `FrameOverlay`.

## Verification
- `bunx tsc --noEmit`.
- Visual spot-check via preview at: splash, hero, top-bar (scrolled + unscrolled), reframe (dark), CTA letter (light), footer (dark), MVP shell.

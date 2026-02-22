"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const TILE = 20;
const HTILE = 40;

// House pixel map: 11 cols × 14 rows
// 0=bg, 1=chimney, 2=roof, 3=wall, 4=window, 5=door
const HOUSE_MAP = [
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],
  [0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
  [0, 3, 4, 4, 3, 3, 3, 4, 4, 3, 0],
  [0, 3, 4, 4, 3, 3, 3, 4, 4, 3, 0],
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
  [0, 3, 3, 3, 5, 5, 5, 3, 3, 3, 0],
  [0, 3, 3, 3, 5, 5, 5, 3, 3, 3, 0],
  [0, 3, 3, 3, 5, 5, 5, 3, 3, 3, 0],
];

const HOUSE_ROWS = HOUSE_MAP.length;
const HOUSE_COLS = HOUSE_MAP[0].length;

const TILE_COLORS: Record<number, string> = {
  1: "#a1a1aa",
  2: "#dc2626",
  3: "#fef3c7",
  4: "#7dd3fc",
  5: "#92400e",
};

const TILE_COLORS_HOVER: Record<number, string> = {
  1: "#d4d4d8",
  2: "#ef4444",
  3: "#fffbeb",
  4: "#fef08a", // lights on!
  5: "#b45309",
};

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export default function LandingPage() {
  const router = useRouter();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phasesRef = useRef<Float32Array | null>(null);
  const isHoveredRef = useRef(false);
  const scatterRef = useRef<{
    active: boolean;
    startTime: number;
    tiles: { sx: number; sy: number; vx: number; vy: number; color: [number, number, number] }[];
  }>({ active: false, startTime: 0, tiles: [] });

  const [entering, setEntering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const totalTiles = Math.ceil(canvas.width / TILE) * Math.ceil(canvas.height / TILE);
      const phases = new Float32Array(totalTiles);
      for (let i = 0; i < totalTiles; i++) phases[i] = Math.random() * Math.PI * 2;
      phasesRef.current = phases;
    };

    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const getHousePos = () => {
      const hw = HOUSE_COLS * HTILE;
      const hh = HOUSE_ROWS * HTILE;
      const hx = Math.floor((canvas.width - hw) / 2);
      const hy = Math.floor((canvas.height - hh) / 2) - 20;
      return { hx, hy, hw, hh };
    };

    const isOnHouseTile = (mx: number, my: number) => {
      const { hx, hy } = getHousePos();
      for (let r = 0; r < HOUSE_ROWS; r++) {
        for (let c = 0; c < HOUSE_COLS; c++) {
          if (HOUSE_MAP[r][c] !== 0) {
            const tx = hx + c * HTILE;
            const ty = hy + r * HTILE;
            if (mx >= tx && mx < tx + HTILE && my >= ty && my < ty + HTILE) return true;
          }
        }
      }
      return false;
    };

    const draw = (time: number) => {
      const phases = phasesRef.current;
      if (!phases) return;

      const W = canvas.width;
      const H = canvas.height;
      const cols = Math.ceil(W / TILE);
      const rows = Math.ceil(H / TILE);

      ctx.fillStyle = "#06060e";
      ctx.fillRect(0, 0, W, H);

      const scatter = scatterRef.current;

      if (!scatter.active) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const phase = phases[idx] ?? 0;
            const t = time * 0.0004;

            const rv = Math.floor(12 + 18 * Math.sin(t * 0.7 + phase * 1.1));
            const gv = Math.floor(12 + 20 * Math.sin(t * 0.5 + phase * 0.8 + 1.2));
            const bv = Math.floor(40 + 55 * Math.sin(t * 0.3 + phase * 1.4 + 2.5));

            ctx.fillStyle = `rgb(${rv},${gv},${bv})`;
            ctx.fillRect(c * TILE + 1, r * TILE + 1, TILE - 2, TILE - 2);
          }
        }

        const { hx, hy, hw, hh } = getHousePos();
        const hovered = isHoveredRef.current;
        const colors = hovered ? TILE_COLORS_HOVER : TILE_COLORS;

        if (hovered) {
          ctx.save();
          ctx.shadowColor = "#fbbf24";
          ctx.shadowBlur = 24;
          ctx.fillStyle = "rgba(251, 191, 36, 0.08)";
          ctx.fillRect(hx + HTILE, hy, hw - HTILE * 2, hh);
          ctx.restore();
        }

        for (let r = 0; r < HOUSE_ROWS; r++) {
          for (let c = 0; c < HOUSE_COLS; c++) {
            const type = HOUSE_MAP[r][c];
            if (type === 0) continue;

            const tx = hx + c * HTILE;
            const ty = hy + r * HTILE;
            const color = colors[type];

            ctx.fillStyle = color;
            ctx.fillRect(tx + 2, ty + 2, HTILE - 4, HTILE - 4);

            ctx.fillStyle = "rgba(0,0,0,0.15)";
            ctx.fillRect(tx + 2, ty + 2, HTILE - 4, 3);
            ctx.fillRect(tx + 2, ty + 2, 3, HTILE - 4);
          }
        }

        // Window glow effect
        if (hovered) {
          for (let r = 0; r < HOUSE_ROWS; r++) {
            for (let c = 0; c < HOUSE_COLS; c++) {
              if (HOUSE_MAP[r][c] !== 4) continue;

              const wx = hx + c * HTILE + HTILE / 2;
              const wy = hy + r * HTILE + HTILE / 2;

              const grd = ctx.createRadialGradient(wx, wy, 0, wx, wy, HTILE);
              grd.addColorStop(0, "rgba(254, 240, 138, 0.5)");
              grd.addColorStop(1, "rgba(254, 240, 138, 0)");
              ctx.fillStyle = grd;
              ctx.fillRect(wx - HTILE, wy - HTILE, HTILE * 2, HTILE * 2);
            }
          }
        }

        ctx.save();
        ctx.font = "bold 15px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = hovered ? "rgba(251,191,36,0.95)" : "rgba(200,200,230,0.6)";
        const pulse = 0.7 + 0.3 * Math.sin(time * 0.002);
        ctx.globalAlpha = pulse;
        ctx.fillText("點擊房子進入", W / 2, hy + hh + 36);

        ctx.font = "bold 22px monospace";
        ctx.fillStyle = "rgba(200,200,255,0.7)";
        ctx.globalAlpha = 0.8;
        ctx.fillText("像素日記", W / 2, hy - 28);
        ctx.restore();
      } else {
        const elapsed = (time - scatter.startTime) / 1000;
        const progress = Math.min(elapsed / 0.9, 1);

        ctx.fillStyle = `rgba(0,0,0,${progress * 0.9})`;
        ctx.fillRect(0, 0, W, H);

        for (const tile of scatter.tiles) {
          const tx = tile.sx + tile.vx * elapsed * 80;
          const ty = tile.sy + tile.vy * elapsed * 80;
          const opacity = Math.max(0, 1 - progress * 1.4);
          const [r, g, b] = tile.color;
          ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
          ctx.fillRect(tx + 2, ty + 2, HTILE - 4, HTILE - 4);
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const onHouse = isOnHouseTile(mx, my);
      isHoveredRef.current = onHouse;
      canvas.style.cursor = onHouse ? "pointer" : "default";
    };

    const handleClick = (e: MouseEvent) => {
      if (scatterRef.current.active) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (!isOnHouseTile(mx, my)) return;

      const { hx, hy } = getHousePos();
      const centerX = hx + (HOUSE_COLS * HTILE) / 2;
      const centerY = hy + (HOUSE_ROWS * HTILE) / 2;
      const tiles: typeof scatterRef.current.tiles = [];

      for (let r = 0; r < HOUSE_ROWS; r++) {
        for (let c = 0; c < HOUSE_COLS; c++) {
          const type = HOUSE_MAP[r][c];
          if (type === 0) continue;

          const tx = hx + c * HTILE;
          const ty = hy + r * HTILE;
          const dx = tx + HTILE / 2 - centerX;
          const dy = ty + HTILE / 2 - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const speed = 2.5 + Math.random() * 3.5;
          const colorStr = TILE_COLORS[type];

          tiles.push({
            sx: tx,
            sy: ty,
            vx: (dx / dist) * speed + (Math.random() - 0.5) * 1.5,
            vy: (dy / dist) * speed + (Math.random() - 0.5) * 1.5,
            color: hexToRgb(colorStr),
          });
        }
      }

      scatterRef.current = { active: true, startTime: performance.now(), tiles };
      setEntering(true);

      setTimeout(() => {
        router.replace("/articles");
      }, 950);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {entering && (
        <div
          className="fixed inset-0 bg-black pointer-events-none transition-opacity duration-700"
          style={{ opacity: 0.6 }}
        />
      )}
    </div>
  );
}
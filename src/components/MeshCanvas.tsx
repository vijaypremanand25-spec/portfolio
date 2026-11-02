import { useEffect, useRef } from 'react';

// The hero's signature: a drifting peer-to-peer mesh. Nodes link to nearby
// nodes, and small packets hop from node to node the way gossip spreads
// through a decentralized network. The pointer joins the mesh as one more node.

type Node = { x: number; y: number; vx: number; vy: number; r: number; hub: boolean };
type Packet = { from: number; to: number; t: number; speed: number; hops: number; color: number };

function readColors() {
  const s = getComputedStyle(document.documentElement);
  const get = (v: string) => s.getPropertyValue(v).trim() || '#4d7cff';
  return { blue: get('--blue'), violet: get('--violet'), cyan: get('--cyan'), ink: get('--ink'), light: document.documentElement.dataset.theme === 'light' };
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function MeshCanvas({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let colors = readColors();
    let rgb = [hexToRgb(colors.cyan), hexToRgb(colors.blue), hexToRgb(colors.violet)];
    const themeObs = new MutationObserver(() => {
      colors = readColors();
      rgb = [hexToRgb(colors.cyan), hexToRgb(colors.blue), hexToRgb(colors.violet)];
      if (reduced) draw(0);
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    const linkDist = () => Math.min(170, Math.max(120, w / 8));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(26, (w * h) / 16000)));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: i % 9 === 0 ? 2.6 : 1.4 + Math.random() * 0.8,
        hub: i % 9 === 0,
      }));
      packets = [];
      if (reduced) draw(0);
    };

    const neighbours = (i: number) => {
      const d = linkDist();
      const out: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < d * d) out.push(j);
      }
      return out;
    };

    const spawn = () => {
      const hubs = nodes.map((n, i) => (n.hub ? i : -1)).filter((i) => i >= 0);
      const from = hubs[Math.floor(Math.random() * hubs.length)] ?? 0;
      const nb = neighbours(from);
      if (!nb.length) return;
      packets.push({ from, to: nb[Math.floor(Math.random() * nb.length)], t: 0, speed: 0.012 + Math.random() * 0.01, hops: 3 + Math.floor(Math.random() * 4), color: Math.floor(Math.random() * 3) });
    };

    let last = 0;
    let spawnClock = 0;
    function draw(dt: number) {
      ctx!.clearRect(0, 0, w, h);
      const d = linkDist();
      const alphaScale = colors.light ? 0.55 : 1;

      if (dt > 0) {
        for (const n of nodes) {
          n.x += n.vx * dt;
          n.y += n.vy * dt;
          if (n.x < -20) n.x = w + 20;
          if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          if (n.y > h + 20) n.y = -20;
          if (pointer.active) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 140 && dist > 1) {
              n.x -= (dx / dist) * 0.25 * dt;
              n.y -= (dy / dist) * 0.25 * dt;
            }
          }
        }
      }

      // links
      ctx!.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < d * d) {
            const o = (1 - Math.sqrt(dist2) / d) * 0.32 * alphaScale;
            const [r, g, bl] = rgb[1];
            ctx!.strokeStyle = `rgba(${r},${g},${bl},${o})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
        if (pointer.active) {
          const a = nodes[i];
          const dist = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (dist < d * 1.15) {
            const [r, g, bl] = rgb[0];
            ctx!.strokeStyle = `rgba(${r},${g},${bl},${(1 - dist / (d * 1.15)) * 0.55 * alphaScale})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(pointer.x, pointer.y);
            ctx!.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const [r, g, bl] = n.hub ? rgb[2] : rgb[1];
        ctx!.fillStyle = `rgba(${r},${g},${bl},${(n.hub ? 0.95 : 0.7) * (colors.light ? 0.8 : 1)})`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
        if (n.hub) {
          ctx!.strokeStyle = `rgba(${r},${g},${bl},${0.25 * alphaScale})`;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2);
          ctx!.stroke();
        }
      }

      // packets hopping between neighbours
      if (dt > 0) {
        spawnClock += dt;
        if (spawnClock > 38 && packets.length < 14) {
          spawn();
          spawnClock = 0;
        }
      }
      const alive: Packet[] = [];
      for (const p of packets) {
        const a = nodes[p.from];
        const b = nodes[p.to];
        if (!a || !b) continue;
        p.t += p.speed * dt;
        if (p.t >= 1) {
          if (p.hops > 0) {
            const nb = neighbours(p.to).filter((n) => n !== p.from);
            if (nb.length) {
              alive.push({ ...p, from: p.to, to: nb[Math.floor(Math.random() * nb.length)], t: 0, hops: p.hops - 1 });
            }
          }
          continue;
        }
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const [r, g, bl] = rgb[p.color];
        const grad = ctx!.createRadialGradient(x, y, 0, x, y, 9);
        grad.addColorStop(0, `rgba(${r},${g},${bl},${0.95 * alphaScale})`);
        grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(x, y, 9, 0, Math.PI * 2);
        ctx!.fill();
        alive.push(p);
      }
      packets = alive;
    }

    let raf = 0;
    let visible = true;
    const loop = (t: number) => {
      const dt = last ? Math.min((t - last) / 16.67, 3) : 1;
      last = t;
      if (visible && !document.hidden) draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);

    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      raf = requestAnimationFrame(loop);
    } else {
      draw(0);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

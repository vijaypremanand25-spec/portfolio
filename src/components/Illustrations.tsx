import type { CSSProperties, ReactNode } from 'react';
import type { Project } from '../data/projects';

// Architecture diagrams drawn from each repository's real structure. Packets
// move along the paths with CSS offset-path; reduced-motion users get a still frame.

const T = { fontFamily: 'Inter, sans-serif', fontSize: 10, fill: 'var(--muted)' } as const;
const H = { fontFamily: 'Space Grotesk, Inter, sans-serif', fontSize: 11, fontWeight: 600, fill: 'var(--ink)' } as const;

function Box({ x, y, w, h, label, sub, tone = 'var(--blue)' }: { x: number; y: number; w: number; h: number; label: string; sub?: string; tone?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={9} fill="color-mix(in srgb, var(--bg-2) 80%, transparent)" stroke={tone} strokeOpacity={0.7} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} textAnchor="middle" {...H}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" {...T} fontSize={9}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Flow({ d, tone = 'var(--cyan)', delay = 0, dash = false }: { d: string; tone?: string; delay?: number; dash?: boolean }) {
  return (
    <g>
      <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth={1.4} strokeDasharray={dash ? '4 4' : undefined} />
      <circle r={3.2} fill={tone} className="packet" style={{ offsetPath: `path('${d}')`, ['--d' as string]: `${delay}s` } as CSSProperties} />
    </g>
  );
}

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label={label} className="h-auto w-full">
      <defs>
        <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="var(--line)" />
        </pattern>
      </defs>
      <rect width="400" height="240" fill="url(#dots)" />
      {children}
    </svg>
  );
}

function Car({ x, y, tone = 'var(--cyan)' }: { x: number; y: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-13} y={-7} width={26} height={14} rx={5} fill="var(--bg-2)" stroke={tone} />
      <rect x={-6} y={-4.5} width={12} height={9} rx={2.5} fill={tone} opacity={0.35} />
    </g>
  );
}

function V2X() {
  return (
    <Frame label="Vehicles gossip hazard warnings to each other and to roadside units, which train a shared model by federated averaging while the cloud is offline.">
      <path d="M20 170 H380 M200 70 V230" stroke="var(--line-strong)" strokeWidth={14} strokeOpacity={0.35} />
      <Car x={70} y={170} />
      <Car x={140} y={170} tone="var(--blue)" />
      <Car x={300} y={170} tone="var(--violet)" />
      <Car x={200} y={215} tone="var(--blue)" />
      <g>
        <circle cx={70} cy={170} r={10} fill="none" stroke="var(--cyan)" className="pulse-ring" />
      </g>
      <Flow d="M70 170 Q105 140 140 170" tone="var(--cyan)" />
      <Flow d="M140 170 Q220 120 300 170" tone="var(--cyan)" delay={-1.1} />
      <Flow d="M140 170 Q170 200 200 215" tone="var(--cyan)" delay={-2} />
      <Box x={95} y={84} w={80} h={36} label="RSU edge" sub="local inference" tone="var(--blue)" />
      <Box x={235} y={84} w={80} h={36} label="RSU edge" sub="local inference" tone="var(--blue)" />
      <Flow d="M140 170 L135 120" tone="var(--blue)" delay={-0.6} />
      <Flow d="M300 170 L275 120" tone="var(--blue)" delay={-1.8} />
      <Box x={150} y={18} w={110} h={36} label="FedAvg" sub="weights only" tone="var(--violet)" />
      <Flow d="M135 84 Q150 60 180 54" tone="var(--violet)" dash delay={-0.4} />
      <Flow d="M275 84 Q260 60 232 54" tone="var(--violet)" dash delay={-2.2} />
      <g transform="translate(340 34)">
        <path d="M-22 6 a10 10 0 0 1 4 -18 a14 14 0 0 1 26 2 a9 9 0 0 1 4 16 z" fill="none" stroke="var(--faint)" strokeDasharray="3 3" />
        <path d="M-7 -8 L7 6 M7 -8 L-7 6" stroke="#f87171" strokeWidth={2} strokeLinecap="round" />
        <text x={-4} y={24} textAnchor="middle" {...T} fontSize={9}>
          cloud down
        </text>
      </g>
      <text x={20} y={200} {...T}>
        DENM hazard warning
      </text>
    </Frame>
  );
}

function HDA() {
  return (
    <Frame label="Pipeline: 101,766 encounters flow through feature engineering into LightGBM, then SHAP explanations, served by FastAPI and a Streamlit dashboard.">
      <Box x={14} y={40} w={84} h={44} label="UCI dataset" sub="101,766 rows" tone="var(--violet)" />
      <Box x={120} y={40} w={84} h={44} label="Features" sub="split + balance" tone="var(--blue)" />
      <Box x={226} y={40} w={76} h={44} label="LightGBM" sub="vs. LogReg" tone="var(--cyan)" />
      <Box x={316} y={40} w={72} h={44} label="SHAP" sub="why flagged" tone="var(--violet)" />
      <Flow d="M98 62 H120" delay={0} />
      <Flow d="M204 62 H226" delay={-0.8} />
      <Flow d="M302 62 H316" delay={-1.6} />
      <Box x={226} y={150} w={76} h={40} label="FastAPI" sub="batch + single" tone="var(--blue)" />
      <Box x={316} y={150} w={72} h={40} label="Streamlit" sub="risk buckets" tone="var(--blue)" />
      <Flow d="M264 84 V150" tone="var(--blue)" delay={-0.3} />
      <Flow d="M352 84 V150" tone="var(--blue)" delay={-1.3} />
      <g transform="translate(24 112)">
        <rect width={170} height={112} rx={9} fill="color-mix(in srgb, var(--bg-2) 70%, transparent)" stroke="var(--line-strong)" />
        <path d="M18 96 L152 14" stroke="var(--faint)" strokeDasharray="3 3" />
        <path d="M18 96 C 40 70, 56 52, 80 42 S 128 22, 152 14" fill="none" stroke="var(--cyan)" strokeWidth={2} />
        <path d="M18 96 C 42 76, 60 60, 84 50 S 130 26, 152 16" fill="none" stroke="var(--faint)" strokeWidth={1.2} />
        <text x={85} y={108} textAnchor="middle" {...T} fontSize={9}>
          ROC: 0.667 vs 0.641 baseline
        </text>
      </g>
    </Frame>
  );
}

function TourSecure() {
  return (
    <Frame label="Six Docker Compose services: React frontend, Express backend with MongoDB, two FastAPI services for geofencing and anomaly checks, and a Hardhat chain running the TouristID contract.">
      <rect x={8} y={8} width={384} height={224} rx={14} fill="none" stroke="var(--line-strong)" strokeDasharray="5 5" />
      <text x={20} y={26} {...T} fontSize={9}>
        docker compose up
      </text>
      <Box x={150} y={30} w={100} h={38} label="React app" sub="7 tabs + SOS" tone="var(--cyan)" />
      <Box x={150} y={104} w={100} h={38} label="Express API" sub="Node + TS" tone="var(--blue)" />
      <Box x={22} y={176} w={86} h={38} label="MongoDB" sub="app data" tone="var(--violet)" />
      <Box x={120} y={176} w={80} h={38} label="Geofencing" sub="FastAPI" tone="var(--cyan)" />
      <Box x={210} y={176} w={80} h={38} label="Anomaly" sub="FastAPI" tone="var(--cyan)" />
      <Box x={300} y={176} w={86} h={38} label="TouristID" sub="ERC-721" tone="var(--violet)" />
      <Flow d="M200 68 V104" delay={0} />
      <Flow d="M170 142 Q90 150 65 176" tone="var(--violet)" delay={-0.7} />
      <Flow d="M185 142 L160 176" delay={-1.4} />
      <Flow d="M215 142 L250 176" delay={-2.1} />
      <Flow d="M230 142 Q320 150 343 176" tone="var(--violet)" delay={-2.8} />
      <g transform="translate(320 52)">
        <circle r={14} fill="#ef4444" opacity={0.18} className="pulse-ring" />
        <circle r={10} fill="#ef4444" opacity={0.85} />
        <text y={4} textAnchor="middle" fontFamily="Inter" fontSize={8} fontWeight={700} fill="#fff">
          SOS
        </text>
      </g>
    </Frame>
  );
}

function PhysiLock() {
  return (
    <Frame label="Login flow: password, then IoT device attestation, then a risk engine that allows, asks for TOTP, or blocks. Messages use AES-256 keys wrapped with RSA-2048.">
      <Box x={14} y={28} w={78} h={38} label="Password" sub="bcrypt" tone="var(--blue)" />
      <Box x={108} y={28} w={84} h={38} label="IoT device" sub="signs nonce" tone="var(--cyan)" />
      <Box x={208} y={22} w={88} h={50} label="Risk engine" sub="4 signals" tone="var(--violet)" />
      <Flow d="M92 47 H108" delay={0} />
      <Flow d="M192 47 H208" delay={-0.9} />
      <g fontFamily="Inter" fontSize={9.5} fontWeight={600}>
        <rect x={314} y={14} width={72} height={20} rx={6} fill="color-mix(in srgb, var(--good) 18%, transparent)" stroke="var(--good)" />
        <text x={350} y={28} textAnchor="middle" fill="var(--good)">Allow</text>
        <rect x={314} y={38} width={72} height={20} rx={6} fill="color-mix(in srgb, #f59e0b 16%, transparent)" stroke="#f59e0b" />
        <text x={350} y={52} textAnchor="middle" fill="#f59e0b">TOTP</text>
        <rect x={314} y={62} width={72} height={20} rx={6} fill="color-mix(in srgb, #ef4444 16%, transparent)" stroke="#ef4444" />
        <text x={350} y={76} textAnchor="middle" fill="#ef4444">Block</text>
      </g>
      <path d="M296 47 L314 24 M296 47 L314 48 M296 47 L314 72" stroke="var(--line-strong)" />

      <Box x={22} y={150} w={92} h={44} label="Sender" sub="AES-256 key" tone="var(--blue)" />
      <Box x={286} y={150} w={92} h={44} label="Recipient" sub="RSA-2048 key" tone="var(--blue)" />
      <g transform="translate(200 172)">
        <rect x={-58} y={-24} width={116} height={48} rx={10} fill="color-mix(in srgb, var(--bg-2) 85%, transparent)" stroke="var(--violet)" />
        <path d="M-40 -2 v-6 a7 7 0 0 1 14 0 v6" fill="none" stroke="var(--violet)" strokeWidth={1.6} />
        <rect x={-44} y={-3} width={22} height={16} rx={3} fill="var(--violet)" opacity={0.85} />
        <text x={12} y={-3} textAnchor="middle" {...H} fontSize={10}>
          ciphertext
        </text>
        <text x={12} y={12} textAnchor="middle" {...T} fontSize={9}>
          + SHA-256 + PSS
        </text>
      </g>
      <Flow d="M114 172 H142" delay={0} />
      <Flow d="M258 172 H286" delay={-1.2} />
      <text x={200} y={128} textAnchor="middle" {...T}>
        hybrid encryption per message and file
      </text>
    </Frame>
  );
}

export function ProjectIllustration({ kind }: { kind: Project['illustration'] }) {
  switch (kind) {
    case 'v2x':
      return <V2X />;
    case 'hda':
      return <HDA />;
    case 'toursecure':
      return <TourSecure />;
    case 'physilock':
      return <PhysiLock />;
  }
}

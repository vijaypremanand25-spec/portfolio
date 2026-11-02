// Project content comes from the resume and from each project's own repository
// (READMEs, reports, and source). Figures are the ones those sources report.

export type ProjectCategory = 'AI / ML' | 'Full-stack' | 'Security' | 'Distributed systems' | 'Blockchain';

export type Project = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  categories: ProjectCategory[];
  stack: string[];
  repo: string;
  context: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  contributions: string[];
  metrics: { value: string; label: string }[];
  illustration: 'v2x' | 'hda' | 'toursecure' | 'physilock';
  image?: { src: string; alt: string; caption: string; width: number; height: number };
  accent: string;
};

const repo = (name: string) => `https://github.com/vijaypremanand25-spec/${name}`;

export const projects: Project[] = [
  {
    slug: 'decentralized-v2x',
    name: 'Decentralized V2X Ecosystem',
    shortName: 'Decentralized V2X',
    tagline: 'Vehicles and roadside units that keep traffic safe when the cloud goes dark.',
    categories: ['Distributed systems', 'AI / ML', 'Security'],
    stack: ['TypeScript', 'React', 'FastAPI', 'Python', 'scikit-learn', 'WebSockets', 'pytest', 'Vitest'],
    repo: repo('Decentralized_V2X'),
    context: 'B.Tech Project-I · team of three (Rahul Anand Y, Trilochan P, Vijay P) · mentor Dr. Malathi D',
    overview:
      'A runnable decentralized vehicle-to-everything architecture. Vehicles detect hazards on board and gossip them peer to peer, roadside units run congestion inference at the edge, a regional model is trained by federated averaging, and a digital twin mirrors the city. The website is the product: a guided demo, a live control centre, a federated-learning monitor, a security console, and an experiment harness.',
    problem:
      'Connected-vehicle systems usually route decisions through a central cloud. That creates four failures: losing the uplink loses the service, a hazard 200 m ahead waits on a data-centre round trip, continuous per-vehicle telemetry exposes movement history, and purely local decisions cannot anticipate congestion two streets away.',
    solution:
      'Move intelligence to the vehicle and the roadside. Hazard warnings travel as standard ETSI C-ITS frames between vehicles, roadside units estimate traffic state locally, and only model weights and digests go upstream. One simulation engine runs the centralized baseline and the proposed design side by side, so differences come from the architecture, not from divergent code.',
    features: [
      'Peer-to-peer hazard sharing over 6 ETSI C-ITS message types (CAM, DENM, CPM, SPATEM, SREM, SSEM) with byte-accurate frame sizes',
      'Roadside-unit edge inference and traffic-state estimation that keep running through a cloud outage',
      'Federated averaging of a regional congestion model without raw telemetry leaving the roadside',
      'IEEE 1609.2-style certificates, pseudonym rotation, corroboration, and revocation of lying vehicles',
      'Seven-story guided demo where each claimed step ticks off only when the live simulation actually does it',
      'Experiment harness reporting means with 95% confidence intervals across seeds',
    ],
    contributions: [
      'Built the decentralized V2X system with peer-to-peer hazard sharing, roadside-unit edge inference, a city digital twin, and certificate-based security with pseudonym rotation.',
      'Evaluated it against a centralized baseline over 5 seeds with 95% confidence intervals.',
      'Trained the regional congestion model with federated averaging and shipped the guided demo backed by 360+ automated tests (pytest + Vitest).',
    ],
    metrics: [
      { value: '−88.7%', label: 'cloud uplink traffic vs. centralized' },
      { value: '100%', label: 'availability through a cloud outage' },
      { value: '0.994', label: 'hazard-detection precision (from 0.861)' },
      { value: '24', label: 'federated rounds, 275.6 KB telemetry kept local' },
    ],
    illustration: 'v2x',
    accent: 'var(--cyan)',
  },
  {
    slug: 'readmission-prediction',
    name: 'Diabetes 30-Day Readmission Prediction',
    shortName: 'Health Data Analytics',
    tagline: 'Explainable risk scores for hospital readmission, served as an API and a dashboard.',
    categories: ['AI / ML', 'Full-stack'],
    stack: ['Python', 'LightGBM', 'scikit-learn', 'SHAP', 'Pandas', 'FastAPI', 'Streamlit'],
    repo: repo('HDA'),
    context: 'Health Data Analytics project',
    overview:
      'An end-to-end machine learning pipeline that predicts whether a diabetic patient will be readmitted to hospital within 30 days, explains each prediction, and serves single and batch scoring through an API and a clinician-facing dashboard.',
    problem:
      'Early readmissions are costly and often preventable, but the signal is weak and the positive class is rare, so a model that only reports accuracy is misleading. Clinicians also need to know why a patient was flagged before acting on it.',
    solution:
      'Train LightGBM against a logistic-regression baseline with stratified splits and class-imbalance handling, judge it on ROC-AUC and PR-AUC, tune the operating threshold on validation data to favour recall, and attach global and patient-level SHAP explanations to every prediction.',
    features: [
      'Cleaning and feature engineering on the UCI Diabetes 130-US Hospitals dataset (101,766 encounters, 50+ features)',
      'Stratified train, validation, and test splits with class-imbalance handling',
      'LightGBM benchmarked against a logistic-regression baseline on a held-out test set',
      'Global SHAP feature importance and per-patient explanations',
      'Validation-set threshold tuning that prioritises catching readmissions',
      'Fairness and segment analysis plus treatment-effectiveness summaries',
      'FastAPI service and Streamlit dashboard with risk buckets and recommendations',
    ],
    contributions: [
      'Built the end-to-end pipeline with feature engineering, stratified splits, and class-imbalance handling.',
      'Benchmarked LightGBM against logistic regression on the held-out test set.',
      'Added SHAP explanations, threshold tuning, and fairness analysis, and served inference through FastAPI and Streamlit.',
    ],
    metrics: [
      { value: '101,766', label: 'hospital encounters' },
      { value: '0.667', label: 'test ROC-AUC (baseline 0.641)' },
      { value: '0.228', label: 'test PR-AUC (baseline 0.208)' },
      { value: '+9.6%', label: 'relative PR-AUC lift' },
    ],
    illustration: 'hda',
    image: {
      src: '/images/hda-shap-summary.webp',
      alt: 'SHAP summary plot showing which patient features push the readmission prediction up or down',
      caption: 'Global SHAP summary from the project’s results pack: each dot is a patient, coloured by feature value.',
      width: 1100,
      height: 1306,
    },
    accent: 'var(--violet)',
  },
  {
    slug: 'toursecure',
    name: 'TourSecure — Intelligent Tourist Safety Platform',
    shortName: 'TourSecure',
    tagline: 'Geofencing, SOS, and on-chain identity for travellers and the people who protect them.',
    categories: ['Full-stack', 'Blockchain', 'AI / ML'],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'FastAPI', 'Solidity', 'Hardhat', 'Docker'],
    repo: repo('Tour_Secure_1'),
    context: 'Smart India Hackathon 2025 · Institute Finalist',
    overview:
      'A multi-service platform for tourist safety monitoring and incident response. Tourists, authorities, and emergency responders share one system covering SOS alerts, safety scores and heatmaps, itinerary monitoring, e-FIR filing, reviews, and a blockchain-backed digital tourist ID.',
    problem:
      'Tourists in unfamiliar places can drift into unsafe zones or go silent without anyone noticing, and filing a report or proving identity in an emergency is slow. Authorities lack a live view of where visitors are and which areas are risky.',
    solution:
      'Separate the safety logic into small services: a geofencing service that checks positions against configurable zones, an anomaly service that flags route deviation and prolonged inactivity, an Express API for the app’s data, and a TouristID smart contract for tamper-proof identity, all started with one Docker Compose command.',
    features: [
      'Seven-tab React and TypeScript app: home, safety heatmap, reviews, itinerary, e-FIR, digital ID, and about',
      'One-tap SOS alerts and nearby safety scores',
      'Polygon containment and distance-based geofencing from configurable zones',
      'Route-deviation and inactivity checks with extension points for learned anomaly models',
      'ERC-721 TouristID contract with OpenZeppelin access control, deployed on a local Hardhat chain',
      'Six-service Docker Compose deployment: frontend, backend, MongoDB, geofencing, anomaly, blockchain',
    ],
    contributions: [
      'Built the platform for 3 user roles with SOS alerts, heatmaps, itinerary monitoring, e-FIR filing, and digital ID.',
      'Implemented geofencing and route-deviation and inactivity checks as 2 independent FastAPI microservices.',
      'Deployed the ERC-721 TouristID contract and shipped the stack as a reproducible 6-service Docker Compose deployment.',
    ],
    metrics: [
      { value: '3', label: 'user roles served' },
      { value: '6', label: 'services in one Compose stack' },
      { value: '2', label: 'FastAPI safety microservices' },
      { value: 'SIH 2025', label: 'institute finalist' },
    ],
    illustration: 'toursecure',
    accent: 'var(--blue)',
  },
  {
    slug: 'physilock',
    name: 'PhysiLock — IoT-Attested Secure Messaging',
    shortName: 'PhysiLock',
    tagline: 'Messaging and file transfer that checks the device, not just the password.',
    categories: ['Security', 'Full-stack'],
    stack: ['Python', 'FastAPI', 'cryptography', 'SQLite', 'bcrypt', 'TOTP', 'JavaScript'],
    repo: repo('PhysiLock'),
    context: 'Context-aware secure messaging and file transfer',
    overview:
      'A secure messaging and file-transfer platform with adaptive, risk-based authentication. Each login is scored on context and on whether a registered IoT device can prove it is present, and every message and file is protected with hybrid RSA and AES encryption.',
    problem:
      'Passwords alone do not tell a server whether a login comes from the right person on the right device. Stolen credentials used from a new machine look identical to a genuine login, and stored messages are only as safe as the server holding them.',
    solution:
      'Score every login on device, IP address, time of day, and IoT attestation, then allow it, demand a TOTP code, or block it. Encrypt content end to end with a per-message AES key wrapped by the recipient’s RSA key, sign with RSA-PSS, and verify integrity with SHA-256.',
    features: [
      'Three-step login: password, IoT device attestation over a signed nonce, then risk decision',
      'Risk engine combining 4 signals into allow, TOTP-required, or block',
      'RSA-2048 with PSS signatures and OAEP key wrapping',
      'AES-256 encryption of every message and file, with SHA-256 integrity checks',
      'bcrypt password hashing, account lockout, and admin unlock',
      'IoT device simulator, audit logs, and a metrics endpoint',
    ],
    contributions: [
      'Developed the messaging and file-transfer platform with 20 REST endpoints and RSA-2048 plus AES-256 hybrid encryption.',
      'Engineered the context-aware risk engine that scores 4 signals into a 3-tier decision.',
      'Built the IoT device simulator for attestation, with bcrypt password hashing and audit logging.',
    ],
    metrics: [
      { value: '20', label: 'REST endpoints' },
      { value: '4', label: 'risk signals per login' },
      { value: '3-tier', label: 'allow · TOTP · block' },
      { value: 'RSA-2048', label: 'with AES-256 hybrid encryption' },
    ],
    illustration: 'physilock',
    accent: 'var(--violet)',
  },
];

export const projectCategories: ProjectCategory[] = ['AI / ML', 'Full-stack', 'Security', 'Distributed systems', 'Blockchain'];

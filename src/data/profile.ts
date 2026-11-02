// Single source of truth for personal details. Everything here comes from
// Vijay P's resume; nothing is invented.

export const profile = {
  name: 'Vijay P',
  firstName: 'Vijay',
  headline: 'Computer Science undergraduate building secure, intelligent systems',
  roles: [
    'Full-stack developer',
    'Machine learning builder',
    'Secure systems engineer',
    'Distributed systems enthusiast',
  ],
  intro:
    'I build data-driven systems end to end, from federated edge intelligence and explainable ML pipelines to blockchain-backed identity and IoT-attested secure messaging.',
  location: 'Chennai, Tamil Nadu',
  email: 'vijay.premanand25@gmail.com',
  phone: '+91 63799 84346',
  phoneHref: 'tel:+916379984346',
  resumeUrl: '/Vijay_P_Resume.pdf',
  resumeFileName: 'Vijay_P_Resume.pdf',
  githubUser: 'vijaypremanand25-spec',
  links: {
    github: 'https://github.com/vijaypremanand25-spec',
    linkedin: 'https://www.linkedin.com/in/vijay-premanand-7a827628b/',
    leetcode: 'https://leetcode.com/u/Vijay11__/',
    email: 'mailto:vijay.premanand25@gmail.com',
  },
  languages: ['English', 'Tamil', 'Hindi'],
} as const;

export const about = {
  paragraphs: [
    'I am a Computer Science and Engineering undergraduate at Vellore Institute of Technology, Chennai, graduating in 2027 with a CGPA of 8.57.',
    'Most of what I build sits where software meets trust: systems that keep working when the cloud goes away, models that explain their predictions, and messaging that checks the device as well as the password.',
    'I like taking a project the whole way: data and models, APIs, the interface people use, and the container it ships in. I am looking for software and AI/ML engineering roles where reliable, well-measured products matter.',
  ],
  interests: [
    'Decentralized and edge systems',
    'Explainable machine learning',
    'Applied cryptography',
    'Blockchain identity',
    'Full-stack product engineering',
  ],
  facts: [
    { label: 'CGPA', value: '8.57 / 10' },
    { label: 'Class XII', value: '95.2%' },
    { label: 'Class X', value: '96.4%' },
    { label: 'Graduating', value: '2027' },
  ],
};

export const education = {
  degree: 'B.Tech in Computer Science and Engineering',
  school: 'Vellore Institute of Technology, Chennai',
  period: '2023 – 2027',
  cgpa: '8.57/10',
};

export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  kind: 'Education' | 'Academic project' | 'Leadership' | 'Competition';
  body: string;
};

export const timeline: TimelineItem[] = [
  {
    period: '2023 – 2027',
    title: 'B.Tech, Computer Science and Engineering',
    org: 'Vellore Institute of Technology, Chennai',
    kind: 'Education',
    body: 'CGPA 8.57/10. Earlier: Class XII 95.2% and Class X 96.4%.',
  },
  {
    period: '2024 – Present',
    title: 'Event Coordinator',
    org: 'College Club',
    kind: 'Leadership',
    body: 'Plan and run technical and cultural events, coordinating cross-functional teams, timelines, resources, and participant communication.',
  },
  {
    period: '2024',
    title: 'First Place, Inter-College Web Development Competition',
    org: 'Inter-college competition',
    kind: 'Competition',
    body: 'Designed, built, and presented a full-stack MERN e-commerce platform.',
  },
  {
    period: '2025',
    title: 'Institute Finalist, Smart India Hackathon',
    org: 'Smart India Hackathon 2025',
    kind: 'Competition',
    body: 'Built TourSecure for AI-assisted tourist risk assessment, rapid incident response, and blockchain-based digital identity.',
  },
  {
    period: 'B.Tech Project-I',
    title: 'Decentralized V2X Communication System',
    org: 'Mentor: Dr. Malathi D',
    kind: 'Academic project',
    body: 'Three-person team project: a decentralized vehicle-to-everything ecosystem using edge intelligence, federated learning, and a digital twin, evaluated against a centralized baseline.',
  },
];

export type Achievement = {
  title: string;
  issuer: string;
  year?: string;
  kind: 'Hackathon' | 'Competition' | 'Certification' | 'Academic';
  body: string;
};

export const achievements: Achievement[] = [
  {
    title: 'Institute Finalist',
    issuer: 'Smart India Hackathon',
    year: '2025',
    kind: 'Hackathon',
    body: 'Selected as an institute finalist for TourSecure, a tourist safety and incident-response platform.',
  },
  {
    title: 'First Place',
    issuer: 'Inter-College Web Development Competition',
    year: '2024',
    kind: 'Competition',
    body: 'Won with a full-stack e-commerce platform built on React, Node.js, Express, and MongoDB.',
  },
  {
    title: 'Generative AI Advanced Certification',
    issuer: 'IBM',
    kind: 'Certification',
    body: 'Advanced certification in generative AI from IBM.',
  },
  {
    title: 'Academic record',
    issuer: 'VIT Chennai and school boards',
    kind: 'Academic',
    body: 'CGPA 8.57/10 in B.Tech CSE, 95.2% in Class XII, and 96.4% in Class X.',
  },
];

import type { IconType } from 'react-icons';
import {
  SiC, SiCplusplus, SiDocker, SiExpress, SiFastapi, SiGit, SiGithub, SiHtml5, SiCss,
  SiJavascript, SiLinux, SiMongodb, SiMongoose, SiNodedotjs, SiNumpy, SiOpenjdk,
  SiOpenzeppelin, SiPandas, SiPostgresql, SiPydantic, SiPytest, SiPython, SiReact,
  SiReactrouter, SiScikitlearn, SiSolidity, SiSqlite, SiTailwindcss, SiTypescript,
  SiVite, SiVitest, SiEthereum,
} from 'react-icons/si';
import {
  LuBrain, LuDatabase, LuKeyRound, LuLock, LuNetwork, LuRadio, LuShieldCheck,
  LuSparkles, LuWaypoints, LuFileLock2, LuChartBar, LuHash, LuFingerprint, LuContainer,
} from 'react-icons/lu';

export type SkillCategory =
  | 'Languages'
  | 'Frontend'
  | 'Backend'
  | 'Databases'
  | 'AI / ML'
  | 'Developer tools'
  | 'DevOps'
  | 'Security & blockchain';

export type Skill = { name: string; icon: IconType; category: SkillCategory };

export const skillCategories: { id: SkillCategory; blurb: string }[] = [
  { id: 'Languages', blurb: 'What I write code in' },
  { id: 'Frontend', blurb: 'Interfaces people use' },
  { id: 'Backend', blurb: 'APIs and services' },
  { id: 'Databases', blurb: 'Where the data lives' },
  { id: 'AI / ML', blurb: 'Models and explainability' },
  { id: 'Developer tools', blurb: 'Testing and workflow' },
  { id: 'DevOps', blurb: 'Packaging and shipping' },
  { id: 'Security & blockchain', blurb: 'Trust, identity, crypto' },
];

export const skills: Skill[] = [
  { name: 'Python', icon: SiPython, category: 'Languages' },
  { name: 'TypeScript', icon: SiTypescript, category: 'Languages' },
  { name: 'JavaScript', icon: SiJavascript, category: 'Languages' },
  { name: 'C++', icon: SiCplusplus, category: 'Languages' },
  { name: 'C', icon: SiC, category: 'Languages' },
  { name: 'Java', icon: SiOpenjdk, category: 'Languages' },
  { name: 'SQL', icon: LuDatabase, category: 'Languages' },
  { name: 'Solidity', icon: SiSolidity, category: 'Languages' },

  { name: 'React.js', icon: SiReact, category: 'Frontend' },
  { name: 'React Router', icon: SiReactrouter, category: 'Frontend' },
  { name: 'HTML5', icon: SiHtml5, category: 'Frontend' },
  { name: 'CSS3', icon: SiCss, category: 'Frontend' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, category: 'Frontend' },
  { name: 'Vite', icon: SiVite, category: 'Frontend' },

  { name: 'FastAPI', icon: SiFastapi, category: 'Backend' },
  { name: 'Node.js', icon: SiNodedotjs, category: 'Backend' },
  { name: 'Express.js', icon: SiExpress, category: 'Backend' },
  { name: 'RESTful APIs', icon: LuWaypoints, category: 'Backend' },
  { name: 'WebSockets', icon: LuRadio, category: 'Backend' },
  { name: 'Pydantic', icon: SiPydantic, category: 'Backend' },
  { name: 'Mongoose', icon: SiMongoose, category: 'Backend' },

  { name: 'MongoDB', icon: SiMongodb, category: 'Databases' },
  { name: 'SQLite', icon: SiSqlite, category: 'Databases' },
  { name: 'PostgreSQL', icon: SiPostgresql, category: 'Databases' },

  { name: 'scikit-learn', icon: SiScikitlearn, category: 'AI / ML' },
  { name: 'LightGBM', icon: LuChartBar, category: 'AI / ML' },
  { name: 'Pandas', icon: SiPandas, category: 'AI / ML' },
  { name: 'NumPy', icon: SiNumpy, category: 'AI / ML' },
  { name: 'SHAP', icon: LuSparkles, category: 'AI / ML' },
  { name: 'Federated learning', icon: LuNetwork, category: 'AI / ML' },
  { name: 'LLMs', icon: LuBrain, category: 'AI / ML' },
  { name: 'RAG', icon: LuBrain, category: 'AI / ML' },

  { name: 'Git', icon: SiGit, category: 'Developer tools' },
  { name: 'GitHub', icon: SiGithub, category: 'Developer tools' },
  { name: 'pytest', icon: SiPytest, category: 'Developer tools' },
  { name: 'Vitest', icon: SiVitest, category: 'Developer tools' },
  { name: 'Linux', icon: SiLinux, category: 'Developer tools' },

  { name: 'Docker', icon: SiDocker, category: 'DevOps' },
  { name: 'Docker Compose', icon: LuContainer, category: 'DevOps' },

  { name: 'RSA', icon: LuKeyRound, category: 'Security & blockchain' },
  { name: 'AES-256', icon: LuLock, category: 'Security & blockchain' },
  { name: 'SHA-256', icon: LuHash, category: 'Security & blockchain' },
  { name: 'bcrypt', icon: LuFileLock2, category: 'Security & blockchain' },
  { name: 'TOTP MFA', icon: LuFingerprint, category: 'Security & blockchain' },
  { name: 'IEEE 1609.2 PKI', icon: LuShieldCheck, category: 'Security & blockchain' },
  { name: 'Hardhat', icon: SiEthereum, category: 'Security & blockchain' },
  { name: 'OpenZeppelin', icon: SiOpenzeppelin, category: 'Security & blockchain' },
];

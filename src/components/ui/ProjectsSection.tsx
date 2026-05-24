import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { LiveProjectButton } from './LiveProjectButton';

interface ProjectData {
  id: string;
  category: string;
  name: string;
  description: string;
  techStack: string[];
  col1_img1: string;
  col1_img2: string;
  col2_img: string;
}

const projectsData: ProjectData[] = [
  {
    id: '01',
    category: 'Founder & Product Architect · 2025 – Present',
    name: 'Barg-AI',
    description: "India's first AI-powered Universal Commerce Platform (UCP) — a WhatsApp-native AI shopping assistant enabling a fully promptable commerce experience. Features real-time price comparison across Amazon, Flipkart, Blinkit, Zepto, Swiggy Instamart, Myntra and 10+ platforms via a single WhatsApp prompt. Includes BNPL smart wallet, Fuels loyalty rewards engine, and vision-based product identification.",
    techStack: ['LLM APIs', 'Prompt Engineering', 'RAG', 'MCP Servers', 'Vision AI', 'WhatsApp API', 'Node.js', 'Redis', 'React.js', 'TypeScript', 'Tailwind CSS'],
    col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  },
  {
    id: '02',
    category: 'AMC Bridge India · 2025',
    name: 'Construction 3D CAD',
    description: 'A browser-based 3D design tool for creating mechanical assemblies from aluminum extrusions — featuring real-time BOM calculation, auto-fastener placement, snapping validation, and STEP file export. Built with custom gesture-based Copy/Paste controls, Section View command, and custom gizmo controls for precision 3D interaction.',
    techStack: ['Three.js', 'WebGL', 'Draco (.drc)', 'BCG Platform', 'STEP Export', 'TypeScript', 'React'],
    col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  },
  {
    id: '03',
    category: 'ElevonData Labs · 2022–2024',
    name: 'FHIR Healthcare App',
    description: 'A React-based healthcare application for a leading US client, following FHIR standards and a Microservices monorepo architecture with MySQL, serving 50K+ users. Led migration of React.js (14→18) and Express.js (16→18) enhancing performance by 35%. Implemented CI/CD with Jenkins reducing deployment time by 70%.',
    techStack: ['React.js v18', 'Express.js', 'FHIR Standards', 'Microservices', 'MySQL', 'Jenkins', 'GCP'],
    col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
  },
  {
    id: '04',
    category: 'Kiswok Industries · 2024–2025',
    name: 'Enterprise HRMS Platform',
    description: 'A comprehensive HRMS system with Node.js, React.js, and SQL cutting paperwork by 70%. Features dashboards, task management, ticketing, onboarding, and examination modules. Implemented OAuth, RBAC, MFA, and refresh tokens reducing security risks by 40%. Optimized with Redis caching improving load times by 40–50%.',
    techStack: ['Node.js', 'React.js', 'SQL', 'Redis', 'OAuth', 'RBAC', 'MFA', 'CI/CD', 'Jira'],
    col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
  },
];

function ProjectCard({
  project,
  index,
  total,
}: {
  project: ProjectData;
  index: number;
  total: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (total - 1 - index) * 0.025;
  const scale = useTransform(scrollYProgress, [0.8, 1], [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center items-start relative"
      style={{ height: '85vh' }}
    >
      <motion.div
        style={{
          scale,
          top: `calc(${index * 22}px + 6rem)`,
          willChange: 'transform',
        }}
        className="sticky w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] border border-[#D7E2EA]/15 bg-[#111111] p-5 sm:p-7 md:p-9 flex flex-col shadow-2xl"
      >
        {/* Card Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-zinc-800/60 pb-4 sm:pb-5">
          <div className="flex items-start gap-3 md:gap-6 flex-1 min-w-0">
            {/* Big number */}
            <span
              className="font-black text-[#D7E2EA]/15 select-none leading-none flex-shrink-0"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              {project.id}
            </span>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span
                className="text-[#D7E2EA]/40 uppercase tracking-widest font-medium"
                style={{ fontSize: 'clamp(0.6rem, 1vw, 0.75rem)' }}
              >
                {project.category}
              </span>
              <h3
                className="text-[#D7E2EA] font-extrabold uppercase tracking-tight leading-tight"
                style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.7rem)' }}
              >
                {project.name}
              </h3>
              <p
                className="text-[#D7E2EA]/45 font-light leading-relaxed mt-1 line-clamp-3"
                style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)' }}
              >
                {project.description}
              </p>

              {/* Tech stack tags */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {project.techStack.slice(0, 7).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-full font-medium uppercase tracking-wider border border-[#D7E2EA]/10 text-[#D7E2EA]/40"
                    style={{ fontSize: '0.6rem' }}
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 7 && (
                  <span
                    className="px-2 py-0.5 rounded-full font-medium uppercase tracking-wider text-[#D7E2EA]/30"
                    style={{ fontSize: '0.6rem' }}
                  >
                    +{project.techStack.length - 7} more
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 mt-1">
            <LiveProjectButton />
          </div>
        </div>

        {/* Card Body - Dual Column Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-3 mt-4 flex-grow">
          {/* Left Column (40%) - 2 stacked images */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="w-full rounded-[16px] sm:rounded-[24px] overflow-hidden bg-zinc-900 border border-zinc-800/40">
              <img
                src={project.col1_img1}
                alt={`${project.name} Visual 1`}
                className="w-full object-cover select-none pointer-events-none hover:scale-105 transition-transform duration-500"
                style={{ height: 'clamp(110px, 13vw, 190px)' }}
              />
            </div>
            <div className="w-full rounded-[16px] sm:rounded-[24px] overflow-hidden bg-zinc-900 border border-zinc-800/40">
              <img
                src={project.col1_img2}
                alt={`${project.name} Visual 2`}
                className="w-full object-cover select-none pointer-events-none hover:scale-105 transition-transform duration-500"
                style={{ height: 'clamp(130px, 16vw, 260px)' }}
              />
            </div>
          </div>

          {/* Right Column (60%) - 1 tall image */}
          <div className="md:col-span-6 rounded-[16px] sm:rounded-[24px] overflow-hidden bg-zinc-900 border border-zinc-800/40">
            <img
              src={project.col2_img}
              alt={`${project.name} Hero Visual`}
              className="w-full h-full object-cover select-none pointer-events-none hover:scale-105 transition-transform duration-500"
              style={{ minHeight: '240px' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-6 sm:px-10 md:px-14 pt-24 sm:pt-28 pb-32 -mt-10 sm:-mt-12 md:-mt-14 z-20 border-t border-zinc-900/50"
    >
      <div className="max-w-5xl mx-auto flex flex-col">
        {/* Section Heading */}
        <FadeIn delay={0} y={40} duration={0.8} className="text-center mb-12 sm:mb-16">
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight select-none"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 140px)' }}
          >
            Projects
          </h2>
        </FadeIn>

        {/* Sticky Stacking Cards */}
        <div className="flex flex-col items-center">
          {projectsData.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={projectsData.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
export default ProjectsSection;

import { FadeIn } from './FadeIn';

interface SkillGroup {
  id: string;
  name: string;
  tags: string[];
}

const skillsData: SkillGroup[] = [
  {
    id: '01',
    name: 'Frontend Technologies',
    tags: ['React.js', 'JavaScript', 'TypeScript', 'Redux / Redux Toolkit', 'HTML5/CSS3', 'Material-UI', 'Bootstrap', 'React Router', 'Tailwind CSS'],
  },
  {
    id: '02',
    name: 'Backend Technologies',
    tags: ['Node.js', 'Express.js', 'NestJS', 'SQL / MySQL', 'PostgreSQL', 'MongoDB', 'RESTful APIs', 'Microservices', 'Python'],
  },
  {
    id: '03',
    name: '3D & Graphics',
    tags: ['Three.js', 'WebGL Rendering', 'Draco Compression', 'STEP Export', 'Gizmo Controls'],
  },
  {
    id: '04',
    name: 'AI & Generative Tech',
    tags: ['LLM APIs', 'Prompt Engineering', 'RAG', 'MCP Servers', 'Vision AI (OCR)', 'WhatsApp Business API'],
  },
  {
    id: '05',
    name: 'Tools & DevOps',
    tags: ['Git / GitLab', 'Docker', 'Jenkins', 'Jira', 'Postman', 'Swagger', 'AWS Cloud', 'GCP & Analytics', 'Azure DevOps', 'CI/CD Pipelines', 'Data Structures'],
  },
  {
    id: '06',
    name: 'Security',
    tags: ['OAuth', 'RBAC', 'MFA', 'Refresh Token Management', 'Rate Limiting'],
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-6 sm:px-10 md:px-14 py-20 sm:py-28 md:py-36 z-10"
    >
      <div className="max-w-5xl mx-auto flex flex-col">
        {/* Section Heading */}
        <FadeIn delay={0} y={40} duration={0.8} className="text-center mb-14 sm:mb-20 md:mb-28">
          <h2
            className="font-black uppercase leading-none tracking-tight text-[#0C0C0C] select-none"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 140px)' }}
          >
            Skills
          </h2>
        </FadeIn>

        {/* Skills Grid — 2 columns on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {skillsData.map((skill, i) => (
            <FadeIn
              key={skill.id}
              delay={i * 0.08}
              y={25}
              duration={0.7}
              className="rounded-2xl border border-[rgba(12,12,12,0.12)] p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300"
              style={{ background: 'rgba(12,12,12,0.02)' } as any}
            >
              {/* Header */}
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="font-black text-[#0C0C0C]/20 leading-none select-none"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                >
                  {skill.id}
                </span>
                <h3
                  className="font-bold uppercase tracking-wide text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.4rem)' }}
                >
                  {skill.name}
                </h3>
              </div>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide"
                    style={{
                      background: 'rgba(12,12,12,0.06)',
                      border: '1px solid rgba(12,12,12,0.12)',
                      color: '#1a1a1a',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
export default ServicesSection;

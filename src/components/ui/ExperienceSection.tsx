import { FadeIn } from './FadeIn';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

const experienceData: ExperienceItem[] = [
  {
    company: 'AMC Bridge India Pvt. Ltd.',
    role: 'Software Development Engineer',
    period: 'April 2025 – Present',
    highlights: [
      'Building browser-based 3D CAD tools used by engineers worldwide.',
      'Developed BCG — a boilerplate code generation platform for Three.js-powered 3D viewer apps, supporting React/Angular, Express/NestJS, and Bootstrap/Material-UI.',
      'Added Draco (.drc) compressed file format support, significantly reducing 3D asset load times.',
      'Built custom gesture-based Copy/Paste controls, Section View command, and custom gizmo controls for precision 3D interaction.',
      'Developed a CAD file browser enabling anonymous search, view, and download of CAD files with a full admin portal for file and user management.',
      'Built a Construction 3D Design tool for creating mechanical assemblies from aluminum extrusions — featuring real-time BOM calculation, auto-fastener placement, snapping validation, and STEP file export.',
    ],
  },
  {
    company: 'Kiswok Industries Pvt. Ltd.',
    role: 'Node.js Developer / Fullstack',
    period: 'July 2024 – February 2025',
    highlights: [
      'Led development of HRMS apps with Node.js, React.js, and SQL, cutting paperwork by 70%.',
      'Developed dashboards, task management, ticketing, onboarding, and examination modules, enhancing operational efficiency by 50%.',
      'Implemented OAuth, RBAC, MFA, and refresh tokens, reducing security risks by 40%.',
      'Automated reports with schedulers, cutting manual effort by 75% and improving accuracy.',
      'Integrated Jira automation, boosting issue tracking efficiency by 50%.',
      'Optimized backend (Redis caching, rate limiting) and frontend (React.js), improving load times by 40–50%.',
      'Developed automated email/WhatsApp notifications, reducing manual efforts by 60%.',
      'Built CI/CD pipelines for API docs (Postman) and Linux deployment, cutting deployment time by 70%.',
    ],
  },
  {
    company: 'ElevonData Labs Pvt. Ltd.',
    role: 'Consultant Software Developer',
    period: 'March 2022 – June 2024',
    highlights: [
      'Led migration of React.js (14→18) and Express.js (16→18), enhancing performance by 35%.',
      'Built a React-based healthcare app for a leading US client, following FHIR standards and a Microservices monorepo architecture with MySQL, serving 50K+ users.',
      'Implemented CI/CD pipelines with Jenkins, reducing deployment time by 70%, and integrated GCP for secure file storage, ensuring 99.9% uptime.',
    ],
  },
  {
    company: 'Lots Wholesale Solution',
    role: 'IT Trainee',
    period: 'September 2021 – February 2022',
    highlights: [
      'Maintained and optimized an e-commerce website, resolving 100+ issues and improving site speed by 40%.',
      'Developed and automated common tasks using Python scripts and manual reports building process, mailing them to daily users using RPA adding 40% productivity for sales/accounts team.',
    ],
  },
];

const ACCENT_COLORS: Record<string, string> = {
  'AMC Bridge India Pvt. Ltd.': '#7621B0',
  'Kiswok Industries Pvt. Ltd.': '#B600A8',
  'ElevonData Labs Pvt. Ltd.': '#BE4C00',
  'Lots Wholesale Solution': '#546070',
};

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative bg-[#0C0C0C] text-[#D7E2EA] px-6 sm:px-10 md:px-14 py-24 sm:py-28 md:py-36"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <FadeIn delay={0} y={40} duration={0.8} className="text-center mb-14 sm:mb-20 md:mb-28">
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight select-none"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 140px)' }}
          >
            Experience
          </h2>
        </FadeIn>

        {/* Timeline */}
        <div className="relative flex flex-col">
          {/* Vertical line on desktop */}
          <div className="hidden md:block absolute left-[180px] top-0 bottom-0 w-px bg-zinc-800" />

          {experienceData.map((item, i) => {
            const accent = ACCENT_COLORS[item.company] ?? '#646973';
            return (
              <FadeIn key={item.company} delay={i * 0.1} y={30} duration={0.8}>
                <div className="relative flex flex-col md:flex-row gap-4 md:gap-12 pb-12 md:pb-16 group">
                  {/* Left: Period */}
                  <div className="md:w-[180px] md:pr-8 flex-shrink-0 flex flex-col md:items-end md:text-right gap-0.5">
                    <span className="text-[#D7E2EA]/40 text-xs leading-relaxed font-light">{item.period}</span>
                  </div>

                  {/* Timeline dot */}
                  <div
                    className="hidden md:block absolute left-[174px] top-1 w-3 h-3 rounded-full border-2 flex-shrink-0 z-10 group-hover:scale-150 transition-transform duration-300"
                    style={{ borderColor: accent, background: '#0C0C0C' }}
                  />

                  {/* Right: Content */}
                  <div className="flex-grow pl-0 md:pl-8">
                    <h3
                      className="font-bold uppercase tracking-tight text-[#D7E2EA] leading-tight"
                      style={{ fontSize: 'clamp(1rem, 2.2vw, 1.6rem)' }}
                    >
                      {item.company}
                    </h3>
                    <p
                      className="font-medium mt-0.5 mb-4 uppercase tracking-wider"
                      style={{ color: accent, fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}
                    >
                      {item.role}
                    </p>

                    <ul className="flex flex-col gap-2.5">
                      {item.highlights.map((point, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-[#D7E2EA]/65 font-light leading-relaxed"
                          style={{ fontSize: 'clamp(0.78rem, 1.3vw, 0.95rem)' }}
                        >
                          <span
                            className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: accent }}
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Education Card */}
        {/* <FadeIn delay={0.35} y={30} duration={0.9}>
          <div
            className="mt-6 rounded-3xl p-8 sm:p-10 border border-zinc-800 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
            style={{ background: 'linear-gradient(135deg, rgba(118,33,176,0.06) 0%, rgba(182,0,168,0.04) 100%)' }}
          >
            <div
              className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black"
              style={{ background: 'linear-gradient(135deg, #7621B0, #B600A8)', color: 'white' }}
            >
              🎓
            </div>
            <div>
              <p className="text-[#D7E2EA]/40 uppercase tracking-widest text-[0.65rem] font-semibold mb-1">Education</p>
              <h3
                className="font-bold uppercase tracking-tight text-[#D7E2EA]"
                style={{ fontSize: 'clamp(0.95rem, 2vw, 1.35rem)' }}
              >
                Asansol Engineering College (MAKAUT)
              </h3>
              <p className="text-[#D7E2EA]/55 mt-1 font-light" style={{ fontSize: 'clamp(0.78rem, 1.3vw, 0.95rem)' }}>
                Bachelor of Technology in Computer Science Engineering &nbsp;·&nbsp; June 2017 – July 2021 &nbsp;·&nbsp;{' '}
                <span style={{ color: '#B600A8' }} className="font-semibold">Cum. GPA: 8.6</span>
              </p>
            </div>
          </div>
        </FadeIn> */}
      </div>
    </section>
  );
}
export default ExperienceSection;

import { useEffect, useRef } from "react";
import "./experience.css";

const experienceData = [
  {
    role: "IT Trainee",
    company: "Lots Wholesale Solution",
    year: "2021",
    description:
      "Maintained and optimised a high-traffic e-commerce website, resolving 100+ issues and improving site speed by 40%. Developed Python automation scripts and RPA workflows that boosted the sales & accounts team productivity by 40%.",
  },
  {
    role: "Consultant Software Developer",
    company: "ElevonData Labs Pvt. Ltd.",
    year: "2022",
    description:
      "Built OtisHealth — a FHIR-compliant healthcare app serving 50K+ users on a microservices monorepo with MySQL & GCP. Led React.js v14→v18 migration for a 35% performance boost. CI/CD with Jenkins cut deployment time by 70% and maintained 99.9% uptime.",
  },
  {
    role: "Node.js Developer / Full Stack",
    company: "Kiswok Industries Pvt. Ltd.",
    year: "2024",
    description:
      "Led HRMS/CRM platform development eliminating 70% of paperwork. Built 6 core modules including dashboards, ticketing and onboarding. Implemented OAuth, RBAC and MFA reducing security risks by 40%. Redis caching improved load times by 40–50%; automated WhatsApp & email notifications cut manual work by 60%.",
  },
  {
    role: "Software Development Engineer",
    company: "AMC Bridge India Pvt. Ltd.",
    year: "NOW",
    description:
      "Building browser-based 3D CAD tools used by engineers worldwide. Created BCG — a boilerplate platform for Three.js viewer apps. Added Draco (.drc) support for faster load times, built custom gesture Copy/Paste controls, Section View command, and a Construction 3D Design tool with real-time BOM calculation and STEP file export.",
  },
];

const ExperienceSection = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    const section  = sectionRef.current;
    if (!timeline || !section) return;

    // Reset
    timeline.style.maxHeight = "0%";

    const onScroll = () => {
      const rect      = section.getBoundingClientRect();
      const winH      = window.innerHeight;

      // How far the section has scrolled through the viewport (0 → 1)
      const start     = winH * 0.75;           // when top of section hits 75vh
      const end       = rect.height * 0.85;    // stop growing near bottom
      const travelled = start - rect.top;      // positive once we've passed start
      const progress  = Math.min(Math.max(travelled / end, 0), 1);

      timeline.style.maxHeight = `${progress * 100}%`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount in case already in view

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={sectionRef} className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>

        <div className="career-info">
          {/* Animated vertical line + glowing dot */}
          <div ref={timelineRef} className="career-timeline">
            <div className="career-dot" />
          </div>

          {experienceData.map((item) => (
            <div className="career-info-box" key={item.company}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  <h5>{item.company}</h5>
                </div>
                <h3>{item.year}</h3>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;

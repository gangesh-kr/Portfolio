import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';
import { Magnet } from './Magnet';

export function AboutSection() {
  const paragraphText =
    "Full Stack Developer with 5 years of experience specializing in MERN stack development, 3D visualization with Three.js and WebGL, and AI-integrated application development. Strong expertise in building scalable web applications, secure authentication systems, and production-level platforms for Healthcare, HRMS, and Web-based CAD industries.";

  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center bg-[#0C0C0C] px-6 sm:px-10 md:px-14 py-24 sm:py-28 md:py-32 overflow-hidden"
    >

      {/* ── 2. MAIN ABOUT CONTAINER ────────────────────────────────────────── */}
      <div className="flex flex-col items-center max-w-4xl z-20 text-center gap-12 sm:gap-16 md:gap-20">
        {/* Heading */}
        <FadeIn delay={0} y={40} duration={0.8}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 140px)', padding:'20px'}}
          >
            About me
          </h2>
        </FadeIn>

        {/* Animated text paragraph */}
        <div className="max-w-[620px] text-[#D7E2EA] font-medium leading-relaxed px-2 sm:px-4">
          <AnimatedText
            text={paragraphText}
            className="font-medium text-center"
            style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.25rem)' }}
          />
        </div>

        {/* Contact button */}
        <FadeIn delay={0.2} y={30} duration={0.8}>
          <Magnet padding={100} strength={4}>
            <ContactButton />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}
export default AboutSection;

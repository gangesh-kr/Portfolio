import HeroSection from './components/ui/HeroSection';
import AboutSection from './components/ui/AboutSection';
import ServicesSection from './components/ui/ServicesSection';
import TechStack from './components/ui/TechStack';
import ExperienceSection from './components/ui/ExperienceSection';
import { FadeIn } from './components/ui/FadeIn';

export function App() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-sans selection:bg-[#B600A8]/30 selection:text-white overflow-x-clip">
      {/* 1. Hero Section */}
      <HeroSection />


      {/* 3. About Section */}
      <AboutSection />

      {/* 4. Skills Section (formerly Services) */}
      <ServicesSection />

      {/* 3D Dynamic Tech Stack Section */}
      <TechStack />

      {/* 5. Experience & Education Section */}
      <ExperienceSection />

      {/* ── 7. CONTACT SECTION (FOOTER) ────────────────────────────────────── */}
      <footer
        id="contact"
        className="bg-[#0C0C0C] text-[#D7E2EA] px-6 md:px-10 py-20 sm:py-24 border-t border-zinc-900 flex flex-col items-center text-center relative z-20"
      >
        <FadeIn delay={0} y={30} duration={0.8} className="flex flex-col items-center max-w-3xl">
          <span className="text-[#D7E2EA]/50 uppercase tracking-widest text-xs sm:text-sm font-semibold mb-4 select-none">
            Get In Touch
          </span>
          <h2 className="hero-heading text-2xl sm:text-sm md:text-lg font-black uppercase tracking-tight leading-none mb-8">
            Let&apos;s work together
          </h2>
          <p className="text-zinc-400 max-w-md text-sm sm:text-base leading-relaxed mb-10">
            Building cutting-edge 3D CAD tools, AI platforms, and enterprise apps.
            Got a challenge? Let&apos;s build something remarkable together.
          </p>
          <a
            href="mailto:gangeshkr996@gmail.com"
            className="text-[#D7E2EA] hover:text-white text-lg sm:text-xl font-bold tracking-wide transition-colors duration-300 underline underline-offset-8 decoration-[#B600A8] decoration-2"
          >
            gangeshkr996@gmail.com
          </a>
        </FadeIn>

        {/* Footer Base */}
        <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mt-20 pt-8 border-t border-zinc-900 text-[10px] sm:text-xs text-[#D7E2EA]/40 gap-4">
          <p>© 2026 Gangesh Kumar. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a
              href="https://github.com/gangeshkr996"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D7E2EA] transition-colors duration-300 uppercase tracking-wider font-medium"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/search/results/all/?keywords=Gangesh+Kumar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D7E2EA] transition-colors duration-300 uppercase tracking-wider font-medium"
            >
              LinkedIn
            </a>
            <a
              href="tel:+918757202653"
              className="hover:text-[#D7E2EA] transition-colors duration-300 uppercase tracking-wider font-medium"
            >
              +91 87572 02653
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
import { FadeIn } from './FadeIn';
import { Magnet } from './Magnet';
import { ContactButton } from './ContactButton';

export function HeroSection() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col justify-between overflow-x-clip bg-[#0C0C0C]">
      {/* ── 1. NAVBAR ──────────────────────────────────────────────────────── */}
      <FadeIn delay={0} y={-20} duration={0.8} className="w-full z-20">
        <nav className="flex justify-between items-center px-6 md:px-10 lg:px-14 pt-6 md:pt-8">
          <div className="text-white font-bold uppercase tracking-widest text-sm md:text-lg lg:text-[1.4rem]">
            Gangesh
          </div>
          <div className="flex gap-4 sm:gap-6 md:gap-10">
            {['About', 'Skills', 'Projects', 'Contact'].map((link) => {
              const targetId = link === 'Skills' ? 'services' : link.toLowerCase();
              return (
                <button
                  key={link}
                  onClick={() => handleScroll(targetId)}
                  className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-none"
                >
                  {link}
                </button>
              );
            })}
          </div>
        </nav>
      </FadeIn>

      {/* ── 2. PORTRAIT (CENTERED ABSOLUTELY) ──────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <FadeIn delay={0.6} y={30} duration={0.9} className="pointer-events-auto">
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
            className="w-[220px] sm:w-[300px] md:w-[380px] lg:w-[460px] select-none"
          >
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
              alt="Gangesh Kumar Portrait"
              className="w-full h-auto object-contain rounded-3xl shadow-2xl pointer-events-none"
            />
          </Magnet>
        </FadeIn>
      </div>

      {/* ── 3. HERO HEADING ────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-10 z-0 select-none">
        <div className="w-full overflow-hidden flex justify-center">
          <FadeIn delay={0.15} y={40} duration={0.8} className="w-full text-center">
            <h1 className="hero-heading text-[8.5vw] sm:text-[9vw] md:text-[9.5vw] lg:text-[9.5vw] font-black uppercase tracking-tight leading-none whitespace-nowrap mt-6 sm:mt-4 md:-mt-5">
              Hi, i&apos;m gangesh
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* ── 4. BOTTOM BAR ──────────────────────────────────────────────────── */}
      <div className="w-full px-6 md:px-10 lg:px-14 pb-8 sm:pb-10 md:pb-12 flex justify-between items-end z-20">
        {/* Left */}
        <FadeIn delay={0.35} y={20} duration={0.8}>
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[180px] sm:max-w-[240px] md:max-w-[300px]"
            style={{ fontSize: 'clamp(0.7rem, 1.3vw, 1.1rem)' }}
          >
            Full Stack Developer · 3D Visualization · AI-Integrated Applications
          </p>
        </FadeIn>

        {/* Right */}
        <FadeIn delay={0.5} y={20} duration={0.8}>
          <Magnet padding={100} strength={4}>
            <ContactButton />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}
export default HeroSection;

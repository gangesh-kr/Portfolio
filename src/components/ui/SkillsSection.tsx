import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CSSPlugin } from 'gsap/CSSPlugin';

// Register Plugins
gsap.registerPlugin(ScrollTrigger, CSSPlugin);

const skillCategories = [
    {
        title: 'Frontend Development',
        years: '4 years',
        icon: '🎨',
        skills: ['React.js', 'TypeScript', 'Three.js', 'WebGL', 'Redux', 'HTML5/CSS3', 'Material-UI', 'Tailwind CSS']
    },
    {
        title: 'Backend Development',
        years: '2.8 years',
        icon: '⚙️',
        skills: ['Node.js', 'Express.js', 'RESTful APIs', 'Microservices', 'MySQL', 'MongoDB', 'SQL', 'GraphQL']
    },
    {
        title: 'DevOps & Tools',
        years: '2 years',
        icon: '🔧',
        skills: ['Git/GitHub', 'Jenkins CI/CD', 'Docker', 'GCP', 'Jira', 'Postman', 'Swagger', 'Linux']
    },
    {
        title: 'Core Skills',
        years: '3 years',
        icon: '💡',
        skills: ['Data Structures', 'System Design', 'OAuth/RBAC', 'Redis Caching', 'FHIR Standards', 'RPA Automation']
    }
];

const workExperience = [
    {
        company: 'AMC Bridge India Pvt. Ltd.',
        role: 'Software Development Engineer',
        period: 'April 2025 – Present',
        highlights: [
            'CAD file visualization with Three.js and WebGL',
            'Web browser for CAD files with admin section'
        ]
    },
    {
        company: 'Kiswok Industries Pvt. Ltd.',
        role: 'Node.js Developer / Fullstack',
        period: 'July 2024 – February 2025',
        highlights: [
            'HRMS/CRM reducing paperwork by 70%',
            'OAuth, RBAC, MFA reducing security risks 40%',
            'Redis caching improving load times 40-50%'
        ]
    },
    {
        company: 'ElevonData Labs Pvt. Ltd.',
        role: 'Consultant Software Developer',
        period: 'March 2022 – June 2024',
        highlights: [
            'Healthcare app serving 50K+ users (FHIR)',
            'React.js migration improving performance 35%',
            'CI/CD pipelines reducing deployment time 70%'
        ]
    },
    {
        company: 'LOTS Wholesale Solution',
        role: 'IT Trainee',
        period: 'Sept 2021 – February 2022',
        highlights: [
            'E-commerce optimization improving speed 40%',
            'Python automation adding 40% productivity'
        ]
    },
];

const contactInfo = {
    linkedin: 'https://www.linkedin.com/in/gangeshkr996/',
    github: 'https://github.com/gangesh-kr',
    email: 'gangeshkr996@gmail.com',
    phone: '+91 8757202653'
};

// Floating Particle Component
function FloatingParticles({ count = 30 }: { count?: number }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none px-parallax-fast">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-amber-500/30"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float-particle ${5 + Math.random() * 10}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                />
            ))}
        </div>
    );
}

// Grid Background Component
function GridBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 px-parallax-slow">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    transform: 'perspective(500px) rotateX(60deg)',
                    transformOrigin: 'center top'
                }}
            />
        </div>
    );
}

// Glowing Orb Component
function GlowingOrbs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse px-parallax-medium" />
            <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse px-parallax-medium"
                style={{ animationDelay: '2s' }} />
        </div>
    );
}

export default function SkillsSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Parallax Effects
            gsap.to('.px-parallax-slow', {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });

            gsap.to('.px-parallax-medium', {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });

            gsap.to('.px-parallax-fast', {
                yPercent: 45,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // 2. Skill Card Animations
            const cards = gsap.utils.toArray('.skill-card');
            cards.forEach((card: any) => {
                const tags = card.querySelectorAll('.skill-tag');

                // Initialize state (Instant)
                gsap.set(card, { autoAlpha: 0, y: 30, scale: 0.98 });
                gsap.set(tags, { autoAlpha: 0, scale: 0.8 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=80px',
                        toggleActions: 'play none none none', // Play only once for stability
                    }
                });

                tl.to(card, {
                    y: 0,
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: 'power3.out'
                })
                    .to(tags, {
                        scale: 1,
                        autoAlpha: 1,
                        duration: 0.3,
                        stagger: 0.02,
                        ease: 'back.out(2)'
                    }, '-=0.2');

                // VERY AGGRESSIVE FAIL-SAFE: If not visible in 800ms, force show
                setTimeout(() => {
                    gsap.set([card, ...gsap.utils.toArray(tags)], {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        overwrite: true
                    });
                }, 800);
            });

            // 3. Experience Items
            const expCards = gsap.utils.toArray('.exp-card');
            expCards.forEach((card: any, i) => {
                const highlights = card.querySelectorAll('.exp-highlight');

                gsap.set(card, { autoAlpha: 0, x: i % 2 === 0 ? -30 : 30 });
                gsap.set(highlights, { autoAlpha: 0, scale: 0.9 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=80px',
                        toggleActions: 'play none none none'
                    }
                });

                tl.to(card, {
                    x: 0,
                    autoAlpha: 1,
                    duration: 0.6,
                    ease: 'power2.out'
                })
                    .to(highlights, {
                        scale: 1,
                        autoAlpha: 1,
                        duration: 0.3,
                        stagger: 0.02,
                    }, '-=0.3');

                // Fail-safe for experience
                setTimeout(() => {
                    gsap.set([card, ...gsap.utils.toArray(highlights)], {
                        autoAlpha: 1,
                        x: 0,
                        scale: 1,
                        overwrite: true
                    });
                }, 1000);
            });

            // 4. Contact Items
            const contactItems = gsap.utils.toArray('.contact-item');
            contactItems.forEach((item: any) => {
                gsap.set(item, { autoAlpha: 0, y: 20 });

                gsap.to(item, {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top bottom-=60px',
                        toggleActions: 'play none none none'
                    }
                });

                // Fail-safe for contact
                setTimeout(() => {
                    gsap.set(item, { autoAlpha: 1, y: 0, overwrite: true });
                }, 1200);
            });

            // Refresh ScrollTrigger
            ScrollTrigger.refresh();
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-charcoal relative overflow-hidden">
            <GridBackground />
            <GlowingOrbs />
            <FloatingParticles count={40} />

            {/* Skills Section */}
            <section className="relative z-20 py-24 px-8 min-h-screen flex items-center">
                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="text-center mb-20 px-parallax-medium">
                        <h2 className="text-5xl md:text-6xl font-bold mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600">
                                Skills & Expertise
                            </span>
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            Full Stack Developer with 3+ years specializing in MERN stack,
                            healthcare software, and enterprise applications
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {skillCategories.map((category) => (
                            <div
                                key={category.title}
                                className="skill-card p-10 rounded-3xl bg-zinc-900/40 border border-zinc-800/50
                                           hover:border-amber-500/40 transition-shadow duration-500
                                           hover:shadow-2xl hover:shadow-amber-500/5 backdrop-blur-xl"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl filter drop-shadow-lg">{category.icon}</span>
                                        <h3 className="text-2xl font-bold text-white transition-colors">
                                            {category.title}
                                        </h3>
                                    </div>
                                    <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-sm font-mono tracking-wider font-bold">
                                        {category.years}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {category.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="skill-tag px-4 py-2 rounded-xl bg-zinc-800/60 text-zinc-200
                                                       border border-zinc-700/50 hover:border-amber-500 hover:text-amber-400
                                                       transition-all duration-300 cursor-default hover:bg-zinc-800 inline-block"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="relative z-20 py-24 px-8 min-h-screen flex items-center bg-zinc-950/20">
                <div className="max-w-5xl mx-auto w-full relative z-10">
                    <div className="text-center mb-20 px-parallax-medium">
                        <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">Professional Journey</h3>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full" />
                    </div>

                    <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 via-orange-500/30 to-transparent" />

                        <div className="space-y-12">
                            {workExperience.map((exp) => (
                                <div key={exp.company} className="exp-card relative pl-20 group">
                                    <div className="absolute left-6 top-7 w-5 h-5 rounded-full bg-amber-500
                                                  border-4 border-zinc-950 shadow-xl group-hover:scale-125 transition-transform" />

                                    <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50
                                                  hover:border-amber-500/20 transition-all duration-300
                                                  hover:bg-zinc-900/60 backdrop-blur-xl">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-6">
                                            <div>
                                                <h4 className="text-2xl font-bold text-white mb-1">{exp.company}</h4>
                                                <p className="text-amber-500 font-semibold tracking-wide uppercase text-sm">{exp.role}</p>
                                            </div>
                                            <span className="text-zinc-500 font-mono text-sm bg-zinc-800/50 px-3 py-1 rounded-md border border-zinc-700/30 whitespace-nowrap">
                                                {exp.period}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2.5">
                                            {exp.highlights.map((highlight, i) => (
                                                <span
                                                    key={i}
                                                    className="exp-highlight px-4 py-1.5 rounded-lg bg-zinc-800/40 text-zinc-300 text-sm border border-zinc-700/30 inline-block"
                                                >
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="relative z-20 py-24 px-8 min-h-screen flex items-center">
                <div className="max-w-4xl mx-auto w-full relative z-10">
                    <div className="text-center mb-20 px-parallax-medium">
                        <h3 className="text-5xl font-bold mb-6 tracking-tighter">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
                                Connect with Me
                            </span>
                        </h3>
                        <p className="text-zinc-400 text-lg">Always open for exciting projects and collaborations.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer"
                            className="contact-item group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50
                                    hover:border-blue-500/30 transition-all duration-500 hover:bg-zinc-900/60 backdrop-blur-xl">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💼</div>
                            <h4 className="text-white font-bold mb-1">LinkedIn</h4>
                            <p className="text-zinc-500 text-sm truncate">@gangeshkr996</p>
                        </a>

                        <a href={contactInfo.github} target="_blank" rel="noopener noreferrer"
                            className="contact-item group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50
                                    hover:border-purple-500/30 transition-all duration-500 hover:bg-zinc-900/60 backdrop-blur-xl">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🐙</div>
                            <h4 className="text-white font-bold mb-1">GitHub</h4>
                            <p className="text-zinc-500 text-sm truncate">@gangesh-kr</p>
                        </a>

                        <a href={`mailto:${contactInfo.email}`}
                            className="contact-item group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50
                                    hover:border-red-500/30 transition-all duration-500 hover:bg-zinc-900/60 backdrop-blur-xl">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📧</div>
                            <h4 className="text-white font-bold mb-1">Email</h4>
                        </a>

                        <a href={`tel:${contactInfo.phone}`}
                            className="contact-item group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50
                                    hover:border-green-500/30 transition-all duration-500 hover:bg-zinc-900/60 backdrop-blur-xl">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📱</div>
                            <h4 className="text-white font-bold mb-1">Phone</h4>
                        </a>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes float-particle {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
                    25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; }
                    50% { transform: translateY(-5px) translateX(-2px); opacity: 0.4; }
                    75% { transform: translateY(-15px) translateX(7px); opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}

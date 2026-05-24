import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Warp Transition ─────────────────────────────────────────────────────────

export function WarpSection() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.warp-text',
                { autoAlpha: 0, letterSpacing: '0.05em', filter: 'blur(12px)' },
                {
                    autoAlpha: 1,
                    letterSpacing: '0.3em',
                    filter: 'blur(0px)',
                    duration: 1.4,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 70%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={ref}
            className="relative z-20 flex items-center justify-center min-h-screen pointer-events-none"
        >
            <div className="text-center">
                <div className="warp-text font-mono text-[10px] text-gold/60 uppercase tracking-[0.5em] mb-4">
                    Entering Warp Speed
                </div>
                <div className="warp-text font-black text-5xl md:text-7xl text-white/5 uppercase tracking-widest select-none">
                    Initializing
                </div>
            </div>
        </section>
    );
}

// ─── Skills Section ───────────────────────────────────────────────────────────

const skillCategories = [
    {
        title: 'Frontend',
        icon: '◈',
        color: 'from-cyan-500/20 to-blue-500/20',
        border: 'border-cyan-500/30',
        accent: 'text-cyan-400',
        skills: ['React.js', 'TypeScript', 'Three.js', 'WebGL', 'Redux', 'GSAP', 'Tailwind CSS'],
        years: '4Y',
    },
    {
        title: 'Backend',
        icon: '◉',
        color: 'from-emerald-500/20 to-green-500/20',
        border: 'border-emerald-500/30',
        accent: 'text-emerald-400',
        skills: ['Node.js', 'Express.js', 'RESTful APIs', 'Microservices', 'MySQL', 'MongoDB', 'GraphQL'],
        years: '2.8Y',
    },
    {
        title: 'DevOps',
        icon: '◐',
        color: 'from-amber-500/20 to-orange-500/20',
        border: 'border-amber-500/30',
        accent: 'text-amber-400',
        skills: ['Git/GitHub', 'Jenkins CI/CD', 'Docker', 'GCP', 'Linux', 'Redis', 'Swagger'],
        years: '2Y',
    },
    {
        title: 'Core',
        icon: '◎',
        color: 'from-purple-500/20 to-violet-500/20',
        border: 'border-purple-500/30',
        accent: 'text-purple-400',
        skills: ['System Design', 'Data Structures', 'OAuth/RBAC', 'FHIR Standards', 'RPA Automation'],
        years: '3Y',
    },
];

export function SkillsStorySection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            // Header reveal
            gsap.fromTo('.skills-header',
                { autoAlpha: 0, y: 40 },
                {
                    autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.skills-header',
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    }
                }
            );

            // Cards staggered
            gsap.fromTo('.skill-story-card',
                { autoAlpha: 0, y: 50, scale: 0.96 },
                {
                    autoAlpha: 1, y: 0, scale: 1,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 60%',
                        toggleActions: 'play none none none',
                    }
                }
            );

            // Skill tags
            gsap.fromTo('.skill-pill',
                { autoAlpha: 0, scale: 0.7 },
                {
                    autoAlpha: 1, scale: 1,
                    duration: 0.4,
                    stagger: 0.025,
                    ease: 'back.out(2)',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 50%',
                        toggleActions: 'play none none none',
                    }
                }
            );

            // Failsafe
            setTimeout(() => {
                gsap.set(['.skills-header', '.skill-story-card', '.skill-pill'], {
                    autoAlpha: 1, y: 0, scale: 1, overwrite: 'auto',
                });
            }, 1500);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative z-20 py-32 px-8 min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto w-full">
                {/* Section header */}
                <div className="skills-header text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
                        <span className="font-mono text-xs text-gold/60 uppercase tracking-[0.4em]">Chapter 02</span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50">
                            SKILLS
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold to-yellow-600">
                            .ORBIT
                        </span>
                    </h2>
                    <p className="font-mono text-sm text-white/40 max-w-xl mx-auto leading-relaxed">
                        Constellation of technologies orbiting 3+ years of fullstack mastery
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillCategories.map((cat) => (
                        <div
                            key={cat.title}
                            className={`skill-story-card group relative p-8 rounded-2xl bg-gradient-to-br ${cat.color}
                                border ${cat.border} backdrop-blur-xl
                                hover:border-opacity-60 transition-all duration-500
                                hover:scale-[1.01] cursor-default`}
                        >
                            {/* Corner decoration */}
                            <div className={`absolute top-4 right-4 text-2xl ${cat.accent} opacity-40 group-hover:opacity-70 transition-opacity`}>
                                {cat.icon}
                            </div>

                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <h3 className={`text-2xl font-black tracking-tight ${cat.accent}`}>{cat.title}</h3>
                                    <div className="text-white/30 font-mono text-xs mt-1">Development</div>
                                </div>
                                <span className={`font-mono text-xs ${cat.accent}/60 bg-white/5 px-3 py-1 rounded-sm border ${cat.border}`}>
                                    {cat.years}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {cat.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className={`skill-pill font-mono text-xs px-3 py-1.5 rounded-sm
                                            bg-black/30 text-white/60 border border-white/10
                                            hover:border-white/30 hover:text-white/90 transition-all duration-200`}
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
    );
}

// ─── Experience Section ────────────────────────────────────────────────────────

const workExperience = [
    {
        company: 'AMC Bridge India',
        role: 'Software Development Engineer',
        period: 'Apr 2025 – Present',
        color: 'text-gold',
        accent: 'bg-gold',
        border: 'border-gold/30',
        dot: 'bg-gold',
        highlights: [
            'CAD file visualization with Three.js & WebGL',
            'Web browser for CAD files with admin section',
        ],
    },
    {
        company: 'Kiswok Industries',
        role: 'Node.js Developer / Fullstack',
        period: 'Jul 2024 – Feb 2025',
        color: 'text-cyan-400',
        accent: 'bg-cyan-400',
        border: 'border-cyan-400/30',
        dot: 'bg-cyan-400',
        highlights: [
            'HRMS/CRM reducing paperwork by 70%',
            'OAuth, RBAC, MFA — security risk ↓40%',
            'Redis caching — load times ↑40-50%',
        ],
    },
    {
        company: 'ElevonData Labs',
        role: 'Consultant Software Developer',
        period: 'Mar 2022 – Jun 2024',
        color: 'text-orange-400',
        accent: 'bg-orange-400',
        border: 'border-orange-400/30',
        dot: 'bg-orange-400',
        highlights: [
            'Healthcare app — 50K+ users (FHIR)',
            'React.js migration — performance ↑35%',
            'CI/CD pipelines — deploy time ↓70%',
        ],
    },
    {
        company: 'LOTS Wholesale Solution',
        role: 'IT Trainee',
        period: 'Sep 2021 – Feb 2022',
        color: 'text-purple-400',
        accent: 'bg-purple-400',
        border: 'border-purple-400/30',
        dot: 'bg-purple-400',
        highlights: [
            'E-commerce optimization — speed ↑40%',
            'Python automation — productivity ↑40%',
        ],
    },
];

export function ExperienceStorySection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.exp-header',
                { autoAlpha: 0, y: 40 },
                {
                    autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.exp-header',
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    }
                }
            );

            gsap.fromTo('.exp-story-card',
                { autoAlpha: 0, x: -40 },
                {
                    autoAlpha: 1, x: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 60%',
                        toggleActions: 'play none none none',
                    }
                }
            );

            // Timeline spine draw effect
            gsap.fromTo('.timeline-spine',
                { scaleY: 0 },
                {
                    scaleY: 1,
                    duration: 1.5,
                    ease: 'power2.inOut',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 60%',
                        toggleActions: 'play none none none',
                    }
                }
            );

            setTimeout(() => {
                gsap.set(['.exp-header', '.exp-story-card', '.timeline-spine'], {
                    autoAlpha: 1, x: 0, scaleY: 1, overwrite: 'auto',
                });
            }, 1500);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative z-20 py-32 px-8 min-h-screen flex items-center">
            <div className="max-w-5xl mx-auto w-full">
                {/* Header */}
                <div className="exp-header text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
                        <span className="font-mono text-xs text-gold/60 uppercase tracking-[0.4em]">Chapter 03</span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50">
                            MISSION
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold to-yellow-600">
                            .LOG
                        </span>
                    </h2>
                    <p className="font-mono text-sm text-white/40">3+ years across 4 companies. 0 unsolved problems.</p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical spine */}
                    <div
                        className="timeline-spine absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/80 via-gold/30 to-transparent origin-top"
                    />

                    <div className="space-y-8">
                        {workExperience.map((exp, i) => (
                            <div key={exp.company} className="exp-story-card relative pl-16 group">
                                {/* Timeline node */}
                                <div className={`absolute left-4 top-6 w-4 h-4 rounded-full ${exp.dot}
                                    border-2 border-black shadow-lg
                                    group-hover:scale-125 transition-transform duration-300
                                    shadow-current`}
                                />

                                {/* Card */}
                                <div className={`p-6 rounded-2xl bg-white/[0.03] border ${exp.border}
                                    hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-sm`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                        <div>
                                            <h4 className={`text-xl font-black ${exp.color} tracking-tight`}>{exp.company}</h4>
                                            <p className="text-white/50 text-sm font-mono mt-0.5">{exp.role}</p>
                                        </div>
                                        <span className={`font-mono text-xs text-white/30 bg-white/5
                                            px-3 py-1 rounded-sm border border-white/10 whitespace-nowrap self-start`}
                                        >
                                            {exp.period}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5">
                                        {exp.highlights.map((h, j) => (
                                            <div key={j} className="flex items-start gap-2">
                                                <span className={`${exp.color} opacity-60 mt-0.5 text-xs`}>▸</span>
                                                <span className="text-white/50 text-sm font-mono">{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Contact Section ───────────────────────────────────────────────────────────

const contactLinks = [
    {
        label: 'LinkedIn',
        value: '@gangeshkr996',
        href: 'https://www.linkedin.com/in/gangeshkr996/',
        icon: '◈',
        color: 'text-blue-400',
        border: 'border-blue-400/20',
        hover: 'hover:border-blue-400/50',
    },
    {
        label: 'GitHub',
        value: '@gangesh-kr',
        href: 'https://github.com/gangesh-kr',
        icon: '◉',
        color: 'text-purple-400',
        border: 'border-purple-400/20',
        hover: 'hover:border-purple-400/50',
    },
    {
        label: 'Email',
        value: 'gangeshkr996@gmail.com',
        href: 'mailto:gangeshkr996@gmail.com',
        icon: '◐',
        color: 'text-red-400',
        border: 'border-red-400/20',
        hover: 'hover:border-red-400/50',
    },
    {
        label: 'Phone',
        value: '+91 8757202653',
        href: 'tel:+918757202653',
        icon: '◎',
        color: 'text-green-400',
        border: 'border-green-400/20',
        hover: 'hover:border-green-400/50',
    },
];

export function ContactStorySection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.contact-header',
                { autoAlpha: 0, y: 40 },
                {
                    autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.contact-header',
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    }
                }
            );

            gsap.fromTo('.contact-card',
                { autoAlpha: 0, y: 30, scale: 0.95 },
                {
                    autoAlpha: 1, y: 0, scale: 1,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 60%',
                        toggleActions: 'play none none none',
                    }
                }
            );

            setTimeout(() => {
                gsap.set(['.contact-header', '.contact-card'], { autoAlpha: 1, y: 0, scale: 1, overwrite: 'auto' });
            }, 1500);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative z-20 py-32 px-8 min-h-screen flex items-center">
            <div className="max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="contact-header text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
                        <span className="font-mono text-xs text-gold/60 uppercase tracking-[0.4em]">Chapter 04</span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50">
                            OPEN
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold to-yellow-600">
                            .CHANNEL
                        </span>
                    </h2>
                    <p className="font-mono text-sm text-white/40 max-w-sm mx-auto">
                        Uplink established. Transmission protocols ready.
                    </p>

                    {/* Signal decorations */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-gold/40 rounded-full"
                                style={{
                                    width: `${3 + i * 2}px`,
                                    height: `${3 + i * 2}px`,
                                    animation: `pulse 2s ease-in-out infinite`,
                                    animationDelay: `${i * 0.2}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Contact cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contactLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`contact-card group p-6 rounded-2xl bg-white/[0.03]
                                border ${link.border} ${link.hover}
                                hover:bg-white/[0.06] transition-all duration-400
                                backdrop-blur-sm flex items-center gap-5`}
                        >
                            <span className={`text-3xl ${link.color} opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 inline-block`}>
                                {link.icon}
                            </span>
                            <div>
                                <div className={`font-mono text-xs ${link.color}/60 uppercase tracking-widest mb-1`}>
                                    {link.label}
                                </div>
                                <div className="text-white/70 text-sm group-hover:text-white/90 transition-colors font-mono">
                                    {link.value}
                                </div>
                            </div>
                            <div className={`ml-auto font-mono text-lg ${link.color} opacity-0 group-hover:opacity-60 transition-opacity`}>
                                ↗
                            </div>
                        </a>
                    ))}
                </div>

                {/* Final sign-off */}
                <div className="text-center mt-16">
                    <div className="font-mono text-xs text-white/20 uppercase tracking-[0.4em]">
                        ◈ Always open for exciting projects ◈
                    </div>
                </div>
            </div>
        </section>
    );
}
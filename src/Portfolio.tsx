import "./index.css";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Briefcase,
  Layout,
  Code2,
  Sparkles,
} from "lucide-react";

import ProfileImage from "./assets/sanyam.png";

/* =========================================
   BRAND ICONS  (inline SVG — lucide-react has no brand icons)
========================================= */

const GitHubIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden='true'
  >
    <path d='M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z' />
  </svg>
);

const LinkedInIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden='true'
  >
    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
  </svg>
);

/* =========================================
   TYPES
========================================= */

interface Project {
  id: number;
  Live?: string;
  title: string;
  desc: string;
}

interface ContactItem {
  title: string;
  value: string;
  icon: React.ReactNode;
}

/* =========================================
   CONSTANTS  (module-level — never recreated)
========================================= */

const NAV_LINKS = ["Home", "Projects", "Skills", "Contact"] as const;

const SOCIAL_ICONS: { label: string; icon: React.ReactNode; href: string }[] = [
  {
    label: "Email",
    icon: <Mail size={20} />,
    href: "mailto:jainsanyam441@gmail.com",
  },
  {
    label: "LinkedIn",
    icon: <LinkedInIcon size={20} />,
    href: "https://www.linkedin.com/in/jainsanyam01",
  },
  {
    label: "GitHub",
    icon: <GitHubIcon size={20} />,
    href: "https://github.com/Sanyam122",
  },
];

const FEATURE_CARDS = [
  {
    title: "AI Helpdesk System",
    role: "Full Stack Project",
    icon: <Sparkles size={28} />,
  },
  {
    title: "Responsive UI/UX",
    role: "Frontend Developer",
    icon: <Layout size={28} />,
  },
  {
    title: "MERN Stack Apps",
    role: "React JS Developer",
    icon: <Code2 size={28} />,
  },
];

const CONTACT_ITEMS: ContactItem[] = [
  {
    title: "Email",
    value: "jainsanyam441@gmail.com",
    icon: <Mail size={22} />,
  },
  { title: "Phone", value: "+91 9116048980", icon: <Phone size={22} /> },
  {
    title: "Location",
    value: "Pune, Maharashtra, India",
    icon: <MapPin size={22} />,
  },
];

const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    title: "AI Helpdesk System",
    desc: "Built a smart AI-powered helpdesk platform using MERN stack with chatbot assistance and authentication. To be live soon, connect with me on LinkedIn to get updated.",
  },
  {
    id: 2,
    title: "StayHub",
    Live: "https://stayhub-dgq1.onrender.com/listings",
    desc: "A travel guide built for frequent travelers, providing curated recommendations with interactive maps and user reviews.",
  },
  {
    id: 3,
    title: "Weather App",
    desc: "Created a responsive weather application with real-time data integration and a clean UI.",
  },
];

const SKILLS_DATA: string[] = [
"HTML",
"CSS",
"JavaScript",
"TypeScript",
"React JS",
"BootStrap",
"Data Structures And Algorithms",
];

/* =========================================
   GLOBAL STYLES  (injected once, outside component)
========================================= */

const globalStyles = `
  html { scroll-behavior: smooth; }
  *, *::before, *::after { box-sizing: border-box; }
  body { overflow-x: hidden; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }

  .curve-surface {
    position: relative;
    isolation: isolate;
  }

  .curve-surface::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.18));
    pointer-events: none;
    z-index: -1;
  }

  .soft-grid {
    background-image:
      linear-gradient(rgba(14, 165, 233, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14, 165, 233, 0.035) 1px, transparent 1px);
    background-size: 42px 42px;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-14px); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }

  @keyframes ctaBreath {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-2px) scale(1.018); }
  }

  .cta-breath {
    animation: ctaBreath 3.4s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

// Inject once at module load — avoids recreating a <style> node every render
if (typeof document !== "undefined") {
  const tag = document.createElement("style");
  tag.textContent = globalStyles;
  document.head.appendChild(tag);
}

/* =========================================
   INTERSECTION OBSERVER HOOK
   FIX: options stabilised with useMemo inside hook so
   object-literal callers don't trigger infinite loops.
========================================= */

function useIntersectionObserver<T extends Element>(
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // threshold and rootMargin are primitives — safe as deps
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}

/* =========================================
   SKILL CARD
========================================= */

const SkillCard = memo(({ skill }: { skill: string }) => (
  <div className='curve-surface transform-gpu bg-white/85 backdrop-blur-sm rounded-[28px] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] text-center hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(14,165,233,0.14)] transition-all duration-300 font-medium text-gray-600 hover:scale-[1.03] border border-white/80 hover:border-sky-200/70'>
    {skill}
  </div>
));
SkillCard.displayName = "SkillCard";

/* =========================================
   PROJECT CARD
========================================= */

const ProjectCard = memo(({ project }: { project: Project }) => (
  <div className='curve-surface relative overflow-hidden transform-gpu bg-white/90 backdrop-blur-md rounded-[36px] p-6 shadow-[0_22px_55px_rgba(15,23,42,0.08)] hover:-translate-y-3 hover:shadow-[0_30px_80px_rgba(14,165,233,0.18)] transition-all duration-500 group hover:scale-[1.02] border border-white/80'>
    <a href={project.Live}>
      <div className='absolute -right-12 -top-12 h-36 w-36 rounded-full bg-sky-300/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
      <div className='relative h-44 rounded-[30px] bg-gradient-to-br from-sky-50 via-white to-blue-100 flex items-center justify-center text-sky-600 font-bold text-xl mb-6 text-center px-4 group-hover:scale-105 transition-transform duration-500 shadow-inner'>
        {project.title}
      </div>
      <h3 className='relative text-2xl font-semibold mb-3'>{project.title}</h3>
      <p className='relative text-gray-500 leading-8'>{project.desc}</p>
    </a>
  </div>
));
ProjectCard.displayName = "ProjectCard";

/* =========================================
   SOCIAL ICONS  (pure component — stable reference)
========================================= */

const SocialIcons = memo(() => (
  <>
    {SOCIAL_ICONS.map(({ label, icon, href }) => (
      <a
        key={label}
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={label}
        className='transform-gpu w-14 h-14 rounded-[22px] flex items-center justify-center shadow-[0_12px_30px_rgba(15,23,42,0.08)] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-110 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-sky-500 hover:shadow-[0_18px_42px_rgba(14,165,233,0.16)] active:scale-95 border border-white/80'
      >
        {icon}
      </a>
    ))}
  </>
));
SocialIcons.displayName = "SocialIcons";

/* =========================================
   FEATURE CARDS  (pure component)
   FIX: extracted so memoisation doesn't depend on pageLoaded —
   parent passes it as a prop instead, keeping memo stable.
========================================= */

const FeatureCards = memo(({ visible }: { visible: boolean }) => (
  <>
    {FEATURE_CARDS.map((item, i) => (
      <div
        key={item.title}
        className={`curve-surface transform-gpu w-full max-w-[250px] bg-white/90 backdrop-blur-md rounded-[34px] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.08)] transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(14,165,233,0.16)] hover:scale-[1.03] border border-white/80 ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
        }`}
        style={{ transitionDelay: `${i * 160}ms` }}
      >
        <div className='h-32 rounded-[28px] bg-gradient-to-br from-sky-50 via-white to-blue-100 flex flex-col items-center justify-center gap-2 text-sky-600 font-bold text-center p-4 mb-4 shadow-inner'>
          <span className='text-sky-500'>{item.icon}</span>
          <span className='text-sm'>{item.title}</span>
        </div>
        <div className='bg-slate-50/80 rounded-[24px] p-4 text-center text-gray-600 border border-white/70'>
          {item.role}
        </div>
      </div>
    ))}
  </>
));
FeatureCards.displayName = "FeatureCards";

/* =========================================
   MAIN COMPONENT
========================================= */

export default function Portfolio() {
  const [pageLoaded, setPageLoaded] = useState(false);

  const { ref: projectsRef, isVisible: projectsVisible } =
    useIntersectionObserver<HTMLElement>();
  const { ref: skillsRef, isVisible: skillsVisible } =
    useIntersectionObserver<HTMLElement>();
  const { ref: contactRef, isVisible: contactVisible } =
    useIntersectionObserver<HTMLElement>();

  /* ── Page load ─────────────────────────────────────────────── */
  useEffect(() => {
    const id = window.setTimeout(() => setPageLoaded(true), 250);
    return () => window.clearTimeout(id);
  }, []);

  /* ── Projects: reveal all at once with CSS stagger ──────────
     FIX: previous code ran 7 setLoadedProjects calls (one per card),
     causing 7 re-renders. Now we flip a boolean once and let CSS
     animation-delay handle the stagger.
  ─────────────────────────────────────────────────────────────── */
  const showProjects = projectsVisible; // derived — no extra state

  /* ── Skills: same optimisation ──────────────────────────────
     FIX: previous code ran 31 setState calls.
  ─────────────────────────────────────────────────────────────── */
  const showSkills = skillsVisible; // derived — no extra state

  

  return (
    <div className='min-h-screen bg-[#edf1f4] overflow-x-hidden font-sans text-[#2d3640] px-3 py-3 md:px-5 md:py-5'>
      <main className='soft-grid relative min-h-screen bg-[#f8f9fb] overflow-hidden rounded-[44px] md:rounded-[56px] px-6 md:px-12 lg:px-16 py-8 md:py-10 shadow-[0_25px_90px_rgba(15,23,42,0.08)] border border-white/70'>
        {/* BACKGROUND BLURS */}
        <div className='absolute top-[-100px] right-[-100px] w-[360px] h-[360px] bg-blue-300/25 blur-3xl rounded-full animate-pulse pointer-events-none' />
        <div className='absolute bottom-[-120px] left-[-120px] w-[320px] h-[320px] bg-sky-200/25 blur-3xl rounded-full pointer-events-none' />
        <div className='absolute top-[38%] left-[42%] w-[220px] h-[220px] bg-white/60 blur-3xl rounded-full pointer-events-none' />

        {/* NAVBAR */}
{/* NAVBAR */}
<nav
  className={`sticky top-4 z-50 mb-14 transition-all duration-1000 ${
    pageLoaded
      ? "opacity-100 translate-y-0"
      : "opacity-0 -translate-y-10"
  }`}
>
  <div className="curve-surface relative mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-hidden rounded-[2rem] border border-white/75 bg-white/60 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:px-5">
    {/* Background glow */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -left-16 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />
    </div>

    {/* Logo */}
    <a
      href="#home"
      className="group flex shrink-0 items-center rounded-full px-3 py-2 transition-all duration-300 hover:bg-white/55"
      aria-label="Go to home section"
    >
      <span className="text-3xl font-extrabold tracking-tight text-[#2d3640] md:text-4xl">
        sanyam
        <span className="text-sky-500 transition-all duration-300 group-hover:drop-shadow-[0_0_14px_rgba(14,165,233,0.55)]">
          .
        </span>
      </span>
    </a>

    {/* Center Links */}
    <ul className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/45 p-1.5 text-sm font-medium text-gray-500 shadow-inner backdrop-blur-xl md:flex">
      {NAV_LINKS.map((item) => (
        <li key={item}>
          <a
            href={`#${item.toLowerCase()}`}
            className="group relative block overflow-hidden rounded-full px-5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:text-sky-600"
          >
            <span className="absolute inset-0 scale-75 rounded-full bg-sky-50 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
            <span className="relative z-10">{item}</span>
          </a>
        </li>
      ))}
    </ul>

    {/* CTA */}
    <a
      href="#contact"
      className="group relative flex shrink-0 items-center justify-center rounded-full bg-white/70 p-1.5 shadow-[0_14px_34px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)] active:scale-[0.98]"
    >
      <span className="relative isolate flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700 px-5 py-3 text-sm font-bold tracking-wide text-white shadow-[0_14px_30px_rgba(37,99,235,0.35)] transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-[0_20px_46px_rgba(37,99,235,0.45)] md:px-7">
        <span className="absolute inset-[2px] -z-10 rounded-full bg-gradient-to-br from-white/25 via-transparent to-blue-900/10" />
        <span className="absolute inset-y-0 -left-20 -z-10 w-16 skew-x-[-20deg] bg-white/35 blur-md transition-all duration-700 group-hover:left-[120%]" />

        <span className="hidden sm:inline">LET&apos;S TALK</span>
        <span className="sm:hidden">TALK</span>

        <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </a>
  </div>

  {/* Mobile Links */}
  <ul className="mx-auto mt-3 flex w-fit items-center gap-1 rounded-full border border-white/70 bg-white/60 p-1.5 text-sm font-medium text-gray-500 shadow-[0_14px_34px_rgba(15,23,42,0.07)] backdrop-blur-xl md:hidden">
    {NAV_LINKS.map((item) => (
      <li key={item}>
        <a
          href={`#${item.toLowerCase()}`}
          className="block rounded-full px-3.5 py-2 transition-all duration-300 hover:bg-sky-50 hover:text-sky-600"
        >
          {item}
        </a>
      </li>
    ))}
  </ul>
</nav>

        {/* HERO */}
        <section
          id='home'
          className='relative grid lg:grid-cols-[1fr_1.1fr_0.9fr] items-center gap-12 xl:gap-16 min-h-[90vh] py-10 rounded-[40px]'
        >
          {/* LEFT */}
          <div
            className={`relative z-10 text-center lg:text-left transition-all duration-1000 delay-200 ${
              pageLoaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-20"
            }`}
          >
            <h3 className='text-4xl md:text-5xl font-semibold mb-4'>
              Hello, I am 
            </h3>
            <h1 className='text-6xl md:text-8xl font-extrabold  leading-none mb-6'>
              Sanyam Jain
            </h1>
            <p className='text-gray-500 leading-8 max-w-md text-lg mx-auto lg:mx-0'>
              B.Tech IT student and Full-Stack Developer from Pune, India.
              Building clean, scalable and premium web experiences.
            </p>

            <div className='mt-12 flex flex-col gap-5 items-center lg:items-start'>
              <div className='curve-surface bg-white/90 backdrop-blur-sm px-6 py-4 rounded-[24px] shadow-[0_14px_34px_rgba(15,23,42,0.07)] text-gray-600 hover:shadow-[0_20px_48px_rgba(14,165,233,0.12)] transition-all duration-300 border border-white/80'>
                jainsanyam441@gmail.com
              </div>
              <div className='flex gap-4'>
                <SocialIcons />
              </div>
            </div>
          </div>

          {/* CENTER IMAGE */}
          <div
            className={`relative flex items-center justify-center min-h-[500px] lg:min-h-[700px] order-first lg:order-none transition-all duration-1000 delay-500 ${
              pageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            {/* MAIN CIRCLE */}
            <div className='absolute w-[320px] h-[320px] md:w-[500px] md:h-[500px] lg:w-[620px] lg:h-[620px] rounded-[42%_58%_55%_45%/45%_42%_58%_55%] bg-gradient-to-b from-white to-slate-200 shadow-inner' />

            {/* GLOW */}
            <div className='absolute w-[420px] h-[420px] md:w-[620px] md:h-[620px] rounded-[45%_55%_60%_40%/55%_45%_55%_45%] bg-sky-200/25 blur-3xl' />

            {/* FLOATING RING */}
            <div className='absolute top-[18%] left-[15%] w-12 h-12 rounded-[18px] border-[8px] border-gray-300/80 rotate-12 animate-float' />
            <div className='absolute bottom-[20%] right-[12%] w-16 h-16 rounded-full bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] animate-float' />

            {/* IMAGE */}
            <img
              src={ProfileImage}
              alt='Sanyam Jain'
              loading='eager'
              decoding='async'
              draggable={false}
              className='relative z-10 w-[340px] md:w-[520px] lg:w-[640px] xl:w-[760px] object-contain drop-shadow-[0_30px_70px_rgba(15,23,42,0.24)] animate-float hover:scale-[1.02] transition-all duration-500 select-none'
            />
          </div>

          {/* RIGHT */}
          <div className='flex flex-col gap-7 items-center lg:items-end'>
            <FeatureCards visible={pageLoaded} />
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id='projects'
          ref={projectsRef}
          className={`transition-all duration-1000 py-24 md:py-28 ${
            showProjects
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <h2 className='text-4xl md:text-5xl font-bold mb-14 tracking-tight'>
            Projects
          </h2>

          <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-8'>
            {PROJECTS_DATA.map((project, i) => (
              <div
                key={project.id}
                className={`transition-all duration-700 ${
                  showProjects
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: showProjects ? `${i * 80}ms` : "0ms",
                }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section
          id='skills'
          ref={skillsRef}
          className={`transition-all duration-1000 py-24 md:py-28 ${
            showSkills
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <h2 className='text-4xl md:text-5xl font-bold mb-14 tracking-tight'>
            Skills
          </h2>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {SKILLS_DATA.map((skill, i) => (
              <div
                key={skill}
                className={`transition-all duration-500 ${
                  showSkills
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: showSkills ? `${i * 30}ms` : "0ms" }}
              >
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section
          id='contact'
          ref={contactRef}
          className={`transition-all duration-1000 py-24 md:py-28 relative overflow-hidden ${
            contactVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <div className='absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-sky-300/20 blur-3xl animate-pulse pointer-events-none' />

          <h2 className='text-5xl font-bold tracking-tight mb-5'>
            Let&apos;s Work Together
          </h2>
          <p className='max-w-2xl text-gray-500 text-lg leading-8 mb-14'>
            Open to internships, freelance opportunities and full-time roles.
          </p>

          <div className='curve-surface relative bg-white/70 backdrop-blur-xl border border-white/80 rounded-[44px] md:rounded-[56px] p-6 md:p-10 lg:p-12 shadow-[0_30px_90px_rgba(15,23,42,0.1)] grid lg:grid-cols-2 gap-8 lg:gap-12 overflow-hidden'>
            {/* LEFT */}
            <div>
              <div className='flex items-center gap-5 mb-10'>
                <div className='w-20 h-20 rounded-[30px] bg-gradient-to-r from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-[0_22px_55px_rgba(14,165,233,0.34)] animate-float'>
                  <Send size={32} />
                </div>
                <div>
                  <h3 className='text-4xl font-bold mb-1'>Get In Touch</h3>
                  <p className='text-gray-500'>
                    Let&apos;s create something exceptional.
                  </p>
                </div>
              </div>

              <div className='space-y-6'>
                {CONTACT_ITEMS.map((item) => (
                  <div
                    key={item.title}
                    className='curve-surface transform-gpu flex items-center gap-5 p-6 rounded-[32px] bg-white/90 backdrop-blur-sm shadow-[0_16px_42px_rgba(15,23,42,0.07)] hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(14,165,233,0.14)] transition-all duration-300 border border-white/80'
                  >
                    <div className='w-16 h-16 rounded-[24px] bg-gradient-to-r from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-[0_18px_42px_rgba(14,165,233,0.3)] shrink-0'>
                      {item.icon}
                    </div>
                    <div>
                      <span className='text-gray-400 text-sm'>
                        {item.title}
                      </span>
                      <h4 className='font-semibold text-lg mt-1 break-all'>
                        {item.value}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className='flex flex-col justify-center gap-8'>
              <div className='rounded-[40px] p-8 bg-gradient-to-br from-sky-50 via-white to-blue-100 shadow-[0_22px_60px_rgba(15,23,42,0.08)] relative overflow-hidden hover:shadow-[0_30px_80px_rgba(14,165,233,0.16)] transition-all duration-500 border border-white/80'>
                <div className='absolute w-32 h-32 rounded-full bg-sky-300/20 top-[-30px] right-[-30px]' />
                <h3 className='text-3xl font-bold mb-5 relative z-10'>
                  Available For Work
                </h3>
                <p className='text-gray-600 leading-8 relative z-10'>
                  Let us build and grow togeather.
                </p>
                <button className='transform-gpu mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold shadow-[0_16px_36px_rgba(14,165,233,0.28)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_22px_55px_rgba(14,165,233,0.34)] active:scale-95 transition-all duration-300 relative z-10 flex items-center gap-2'>
                  <Briefcase size={18} />
                  Hire Me
                </button>
              </div>

              <div className='flex gap-5'>
                <SocialIcons />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

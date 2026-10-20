import { motion } from "motion/react";
import { scrollReveal, tap, useReducedMotion } from "../lib/motion";

export default function MissionCard() {
  const reduced = useReducedMotion();

  const reveal = scrollReveal(reduced);
  const chipHover = reduced ? {} : { whileHover: { scale: 1.02 }, whileTap: tap.card };
  const skills = [
    { label: "REACT.JS", cls: "text-[26px] font-black tracking-tighter text-white/80 uppercase" },
    { label: "NODE.js", cls: "text-[26px] font-extrabold tracking-tight text-white/80 lowercase flex items-center gap-1" },
    { label: "Express Js", cls: "text-[24px] font-bold tracking-tight text-white/80 flex items-center gap-1.5" },
    { label: "Java", cls: "text-[24px] font-semibold tracking-tight text-white/80" },
    { label: "MongoDb", cls: "text-[26px] font-black tracking-tight text-white/80 lowercase" },
    { label: "REST API", cls: "text-[26px] font-bold tracking-tight text-white/80" },
  ];

  return (
    <motion.section
      id="about"
      {...reveal}
      className="w-full bg-[#2F9FB3] rounded-[40px] p-8 md:p-14 text-white shadow-elevated"
    >
      <div className="max-w-[1100px]">
        <motion.h2
          {...scrollReveal(reduced, 0.06)}
          className="text-[32px] sm:text-[44px] md:text-[52px] font-medium leading-[1.08] tracking-[-0.03em] text-white"
        >
          I build reliable, user-friendly web products, from clean interfaces to solid backend logic, and I'm always learning to ship better software.
        </motion.h2>
      </div>

      <div className="mt-12 pt-8 border-t border-white/20 flex flex-wrap items-center justify-between gap-8">
        {skills.map((skill, i) => (
          <motion.span
            key={skill.label}
            {...scrollReveal(reduced, i * 0.05)}
            {...chipHover}
            className={skill.cls}
          >
            {skill.label}
          </motion.span>
        ))}
      </div>
    </motion.section>
  );
}

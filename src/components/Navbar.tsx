import { motion } from "motion/react";
import {
  fadeIn,
  hover,
  mountReveal,
  tap,
  useReducedMotion,
} from "../lib/motion";

export default function Navbar() {
  const reduced = useReducedMotion();

  const linkPress = reduced ? {} : { whileTap: { scale: 0.98 } };
  const pillHover = reduced ? {} : { whileHover: hover.scale, whileTap: tap.icon };
  const btnHover = reduced ? {} : { whileHover: hover.scale, whileTap: tap.press };

  return (
    <motion.header
      {...fadeIn(reduced, 0)}
      className="w-full h-20 bg-white rounded-[24px] px-8 flex items-center justify-between border border-black/[0.03]"
    >
      <motion.div
        {...mountReveal(reduced, 0)}
        className="flex items-center gap-3.5"
        aria-label="Sanyam Jain — back to top"
        {...pillHover}
      >
        <div className="w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center text-white font-bold text-lg tracking-tight">
          SJ
        </div>
        <span className="text-[16px] font-semibold tracking-wider text-[#222222] uppercase">
          Sanyam jain
        </span>
      </motion.div>

      <motion.nav
        {...mountReveal(reduced, 0.12)}
        className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#777777]"
      >
        <motion.a {...linkPress} href="#services" className="nav-link hover:text-[#222222]">
          Skills
        </motion.a>
        <motion.a {...linkPress} href="#work" className="nav-link hover:text-[#222222]">
          Work
        </motion.a>
        <motion.a {...linkPress} href="#contact" className="nav-link hover:text-[#222222]">
          Contact
        </motion.a>
      </motion.nav>

      <motion.a
        {...btnHover}
        href="#contact"
        className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#222222] text-white text-[15px] font-medium shadow-btn-dark hover:bg-black btn"
      >
        Contact Me
      </motion.a>
    </motion.header>
  );
}

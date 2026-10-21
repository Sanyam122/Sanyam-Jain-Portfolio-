import { motion } from "motion/react";
import { useReducedMotion } from "../lib/motion";
import { InView } from "./motion-primitives/InView";

export default function Footer() {
  const reduced = useReducedMotion();

  const linkPress = reduced ? {} : { whileTap: { scale: 0.98 } };

  return (
    <InView as="footer" className='w-full bg-white rounded-[24px] px-8 py-8 flex flex-col md:flex-row items-center justify-between border border-black/[0.03] gap-4 shadow-card'>
      <motion.div
        transition={{ delay: 0.06 }}
        className='flex items-center gap-3'
      >
        <div className='w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center text-white font-bold text-sm'>
          SJ
        </div>
        <span className='text-[14px] font-semibold text-[#222222] uppercase tracking-wider'>
          Sanyam jain
        </span>
      </motion.div>

      <motion.div
        transition={{ delay: 0.14 }}
        className='flex items-center gap-6 text-[13px] font-semibold uppercase tracking-wider text-[#666666]'
      >
        <motion.a
          {...linkPress}
          href='#top'
          className='foot-link hover:text-[#2F9FB3]'
        >
          B.tech
        </motion.a>
        <motion.a
          {...linkPress}
          href='#top'
          className='foot-link hover:text-[#2F9FB3]'
        >
          IT
        </motion.a>
        <motion.a
          {...linkPress}
          href='#services'
          className='foot-link hover:text-[#2F9FB3]'
        >
          Full Stack Dev
        </motion.a>
        <motion.a
          {...linkPress}
          href='#work'
          className='foot-link hover:text-[#2F9FB3]'
        >
          Java backend
        </motion.a>
      </motion.div>
    </InView>
  );
}

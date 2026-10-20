import { motion } from "motion/react";
import { hover, scrollReveal, tap, useReducedMotion } from "../lib/motion";

const FRONTEND_ICON = (
  <svg
    className='w-6 h-6'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <rect width='18' height='18' x='3' y='3' rx='2' strokeWidth='2'></rect>
    <path strokeWidth='2' d='M3 9h18M9 21V9'></path>
  </svg>
);

const BACKEND_ICON = (
  <svg
    className='w-6 h-6'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='m16 18 6-6-6-6M8 6l-6 6 6 6'
    ></path>
  </svg>
);

const DATABASES_ICON = (
  <svg
    className='w-6 h-6'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <ellipse cx='12' cy='5' rx='9' ry='3'></ellipse>
    <path d='M21 12c0 1.66-4 3-9 3s-9-1.34-9-3'></path>
    <path d='M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5'></path>
  </svg>
);

const PROBLEM_SOLVING_ICON = (
  <svg className='w-6 h-6' viewBox='0 0 24 24' fill='currentColor'>
    <path
      fill='#FFA116'
      d='M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.277 5.277 0 0 0-3.85-1.48c-1.472 0-2.843.566-3.85 1.48l-4.32 4.38c-1.028 1.009-1.593 2.378-1.593 3.821 0 1.442.565 2.812 1.593 3.82l4.332 4.363c1.007 1.028 2.378 1.613 3.85 1.613 1.473 0 2.844-.585 3.85-1.613l2.609-2.636c.514-.514.496-1.365-.039-1.901-.535-.535-1.386-.553-1.9-.038z'
    ></path>
    <path
      fill='#6C63E8'
      d='M10.802 13.5h9.396c.745 0 1.35-.605 1.35-1.35s-.605-1.35-1.35-1.35h-9.396c-.745 0-1.35.605 1.35 1.35s.605 1.35 1.35 1.35z'
    ></path>
  </svg>
);

const SERVICES = [
  {
    icon: FRONTEND_ICON,
    title: "Frontend",
    number: "01",
    body: "I can easily build resposive and interactive frontend using AI that doest not look like any ususal AI website. It includes notifications, animations, and typographay that make the app feel alive and intuitive.",
  },
  {
    icon: BACKEND_ICON,
    title: "Backend",
    number: "02",
    body: "I can build robust backend systems using Node.js and Java Spring Boot that handle parse requests, manage data, and ensure your app runs smoothly and securely.",
  },
  {
    icon: DATABASES_ICON,
    title: "Databases",
    number: "03",
    body: "I design MongoDB schemas and data flows that keep apps fast, organized, and ready to scale.",
  },
  {
    icon: PROBLEM_SOLVING_ICON,
    title: "Problem Solving",
    number: "04",
    body: "I practice DSA and pattern-based problem solving to write efficient code and think clearly under pressure.",
  },
];

export default function Services() {
  const reduced = useReducedMotion();

  const reveal = scrollReveal(reduced);
  const cardHover = reduced
    ? {}
    : { whileHover: hover.lift, whileTap: tap.card };
  const iconHover = reduced ? {} : { whileHover: { scale: 1.1 } };

  return (
    <motion.section
      id='services'
      {...reveal}
      className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'
    >
      {/* Services Left Column */}
      <motion.div
        {...scrollReveal(reduced, 0.06)}
        className='lg:col-span-4 lg:sticky lg:top-8 pt-4'
      >
        <motion.h2
          {...scrollReveal(reduced, 0.12)}
          className='text-[42px] md:text-[50px] font-medium text-[#222222] subhead-tight'
        >
          How Can I<br />
          Assist You?
        </motion.h2>
        <motion.p
          {...scrollReveal(reduced, 0.22)}
          className='mt-4 text-[16px] text-[#777777] max-w-[320px]'
        >
          End-to-end development, from clean interfaces to reliable APIs, built
          to grow with your product.
        </motion.p>
      </motion.div>

      {/* Services Right Column: 2x2 Grid of Cards */}
      <motion.div
        {...scrollReveal(reduced, 0.16)}
        className='lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6'
      >
        {SERVICES.map((service, i) => (
          <motion.div
            key={service.number}
            {...scrollReveal(reduced, 0.28 + i * 0.06)}
            {...cardHover}
            className='bg-white rounded-[32px] p-8 border border-black/[0.03] flex flex-col justify-between min-h-[260px] shadow-card'
          >
            <div className='flex items-start gap-5'>
              <motion.div
                {...iconHover}
                className='w-12 h-12 rounded-full bg-[#EEEEF6] flex-shrink-0 flex items-center justify-center text-[#6C63E8]'
              >
                {service.icon}
              </motion.div>
              <p className='text-[14px] text-[#777777] leading-relaxed'>
                {service.body}
              </p>
            </div>
            <div className='pt-8 flex items-baseline justify-between border-t border-black/[0.04]'>
              <h3 className='text-[24px] font-medium text-[#222222] tracking-tight'>
                {service.title}
              </h3>
              <span className='text-[16px] font-semibold text-[#777777]'>
                {service.number}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

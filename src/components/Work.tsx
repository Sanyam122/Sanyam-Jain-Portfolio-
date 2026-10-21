import { motion } from "motion/react";
import stayhubImg from "../assets/stayhub.png";
import { hover, tap, useReducedMotion } from "../lib/motion";
import { InView } from "./motion-primitives/InView";

export default function Work() {
  const reduced = useReducedMotion();

  const cardHover = reduced ? {} : { whileHover: hover.lift, whileTap: tap.card };
  const imageHover = reduced ? {} : { whileHover: hover.image };
  const btnHover = reduced ? {} : { whileHover: hover.scale, whileTap: tap.press };

  return (
    <InView as="section" id="work" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column (Sticky) */}
      <InView as="div" className="lg:col-span-4 lg:sticky lg:top-8 pt-4 space-y-6" transition={{ delay: 0.06 }}>
        <motion.h2
          transition={{ delay: 0.12 }}
          className="text-[42px] md:text-[50px] font-medium text-[#222222] subhead-tight"
        >
          Selected work
        </motion.h2>
        <motion.div transition={{ delay: 0.24 }}>
          <motion.a
            {...btnHover}
            href="https://github.com/your-username?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#222222] text-white text-[14px] font-medium shadow-btn-dark hover:bg-black btn"
          >
            See All
          </motion.a>
        </motion.div>
      </InView>

      {/* Right Column: Featured + 2-Column Projects */}
      <InView as="div" className="lg:col-span-8 space-y-6" transition={{ delay: 0.16 }}>
        {/* Full-Width Featured Card */}
        <InView
          as="div"
          transition={{ delay: 0.28 }}
          {...cardHover}
          className="bg-white rounded-[40px] p-6 md:p-8 border border-black/[0.03] shadow-card"
        >
          <div className="rounded-[28px] overflow-hidden aspect-[16/9] bg-stone-100">
            <motion.img
              {...imageHover}
              src="https://static.vecteezy.com/system/resources/previews/073/991/437/non_2x/illustration-of-online-job-portal-vector.jpg"
              alt="Job Portal project preview"
              data-label="Job Portal"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[18px] md:text-[20px] font-semibold tracking-wider text-[#222222] uppercase">
              Job Portal
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-[#E1F2F5] text-[#2F9FB3] text-[11px] font-semibold tracking-wider uppercase">
              java backend
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#EBEBEB] text-[#666666] text-[11px] font-semibold tracking-wider uppercase">
              React frontend
            </span>
          </div>
        </InView>

        {/* 2-Column Project Grid */}
        <InView as="div" transition={{ delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project 1: ZENPOINT */}
          <InView
            as="div"
            transition={{ delay: 0.48 }}
            {...cardHover}
            className="bg-white rounded-[32px] p-6 border border-black/[0.03] flex flex-col justify-between shadow-card"
          >
            <div className="rounded-[24px] overflow-hidden aspect-[16/10] bg-stone-100">
              <motion.img
                {...imageHover}
                src="https://cdn.jim-nielsen.com/ios/512/weather-2019-02-07.png"
                alt="Weather IQ project preview"
                data-label="Weather IQ"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-[17px] font-semibold tracking-wider text-[#222222] uppercase">
                  Weather iq
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#E1F2F5] text-[#2F9FB3] text-[11px] font-semibold tracking-wider uppercase">
                  React app
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#EBEBEB] text-[#666666] text-[11px] font-semibold tracking-wider uppercase">
                  Weather api&nbsp;
                </span>
              </div>
            </div>
          </InView>

          {/* Project 2: PAYU */}
          <InView
            as="a"
            href="https://stayhub-dgq1.onrender.com/listings"
            target="_blank"
            rel="noopener noreferrer"
            transition={{ delay: 0.56 }}
            {...cardHover}
            className="bg-white rounded-[32px] p-6 border border-black/[0.03] flex flex-col justify-between block shadow-card"
          >
            <div className="rounded-[24px] overflow-hidden aspect-[16/10] bg-stone-100">
              <motion.img
                {...imageHover}
                src={stayhubImg}
                alt="StayHub project preview"
                data-label="StayHub"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-[17px] font-semibold tracking-wider text-[#222222] uppercase">
                  stayhub
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#E1F2F5] text-[#2F9FB3] text-[11px] font-semibold tracking-wider uppercase">
                  Express &amp; node js
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#EBEBEB] text-[#666666] text-[11px] font-semibold tracking-wider uppercase">
                  Map api
                </span>
              </div>
            </div>
          </InView>
        </InView>
      </InView>
    </InView>
  );
}

const GITHUB_SVG = (
  <svg
    className="w-5 h-5 text-[#222222]"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    ></path>
  </svg>
);

const INSTAGRAM_SVG = (
  <svg
    className="w-5 h-5 text-[#E1306C]"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
  </svg>
);

const LINKEDIN_SVG = (
  <svg
    className="w-5 h-5 text-[#0A66C2]"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
  </svg>
);

const X_SVG = (
  <svg
    className="w-4 h-4 text-[#000000]"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

export default function Hero() {
  return (
    <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* HERO LEFT COLUMN */}
      <div className="lg:col-span-6 bg-white rounded-[40px] p-8 md:p-14 flex flex-col justify-between border border-black/[0.03]">
        <div className="space-y-8">
          {/* Availability Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#E1F2F5] text-[#2F9FB3] text-[12px] font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#2F9FB3] status-dot"></span>
            AVAILABLE FOR WORK
          </div>

          {/* Huge Tight Headline */}
          <h1
            className="text-[56px] sm:text-[84px] xl:text-[88px] min-[1400px]:text-[100px] font-medium break-words text-[#222222] headline-tight tracking-[-0.04em]"
          >
            Hi, I'm a Full Stack Developer
          </h1>

          {/* Muted 2-line paragraph */}
          <p className="text-[17px] md:text-[19px] text-[#777777] leading-relaxed max-w-[480px]">
            Full-stack developer and B.Tech IT student from Pune, building useful web products with clean design and solid code. Open to software engineering internships.
          </p>
        </div>

        <div className="pt-8">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-[#222222] text-white text-[16px] font-medium shadow-btn-dark hover:bg-black btn"
          >
            Contact Me
          </a>
        </div>
      </div>

      {/* HERO RIGHT COLUMN (BENTO GRID) */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        {/* Row 1: Profile Card + Portrait Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
          {/* Profile Card */}
          <div className="bg-white rounded-[32px] p-7 flex flex-col justify-between border border-black/[0.03] min-h-[300px]">
            <div className="flex-1 flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[24px] font-semibold text-[#222222] tracking-tight">
                    SanyamJain
                  </h3>
                  <p className="text-[14px] text-[#777777] mt-0.5">Pune, India</p>
                </div>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#E8F0FE] text-[#2563EB] text-[12px] font-semibold tracking-wide">
                  Open To Work
                </span>
              </div>

              {/* Yoga Mockup preview embedded inside */}
              <div className="mt-6 rounded-[20px] overflow-hidden border border-black/[0.05] flex-1 min-h-[128px] relative bg-slate-50">
                <img
                  src="https://tse4.mm.bing.net/th/id/OIP.cY49Uo6xLDtA3JkhjI7BlwHaHa?r=0&amp;rs=1&amp;pid=ImgDetMain&amp;o=7&amp;rm=3"
                  alt="Project preview"
                  data-label="Project preview"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-85 media-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBEBEB] text-[#666666] text-[11px] font-semibold tracking-wider uppercase"
                style={{ fontSize: '9.5px', lineHeight: '12px' }}
              >
                Java Backend &amp; mern
              </span>
              <span className="text-[12px] text-[#777777] font-medium">UTC+5:30</span>
            </div>
          </div>

          {/* Portrait Card */}
          <div className="bg-white rounded-[32px] overflow-hidden border border-black/[0.03] relative min-h-[300px] group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuADzDvadllRfFMrzL_F-rRfz4773lpPkD3J7XaCNlIJV_Um5RcHNPkdsrpfe0myzl3tUakyU7skdb1nETBSBJulWAe-XSqYQNKcq9BJru3__4W2oOGanz0tTN5ZS7DZI9vVUA2xItgw7zgUYjhoWKiw0shwKG18Zy8w7SZIGoTnFIpwRsi1F8IvZXAjL7auuc1bCO4JFDivKjVrAWD_8PMp8B311UW3X5lyy9Dmkubj-mzzCjoblm1hP-Tp3eeEGRhRPeZ5y2L4Cacnag"
              alt="Sanyam Jain portrait"
              data-label="Sanyam Jain"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center media-img"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#222222]">Full Stack Developer</span>
              <span className="w-2 h-2 rounded-full bg-[#2F9FB3]"></span>
            </div>
          </div>
        </div>

        {/* Row 2: Violet Gradient Card + Socials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
          {/* Violet Gradient Card */}
          <div className="sm:col-span-8 violet-gradient-card rounded-[32px] p-7 text-white flex flex-col justify-between min-h-[190px]">
            <p className="text-[17px] font-medium tracking-tight text-white/95">
              Things I've built recently ✦
            </p>

            {/* Marquee logos with fade mask */}
            <div className="marquee-wrap relative overflow-hidden w-full py-2">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#8F8CF0] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#B7B3F7] to-transparent z-10 pointer-events-none"></div>
              <div className="animate-marquee items-center" aria-hidden="true">
                <span className="text-[17px] font-bold tracking-widest uppercase text-white/90">StayHub</span>
                <span className="text-[17px] font-bold tracking-widest uppercase text-white/90">Job Portal</span>
                <span className="text-[17px] font-bold tracking-widest uppercase text-white/90">Weather IQ</span>
                <span className="text-[17px] font-bold tracking-widest uppercase text-white/90">StayHub</span>
                <span className="text-[17px] font-bold tracking-widest uppercase text-white/90">Job Portal</span>
                <span className="text-[17px] font-bold tracking-widest uppercase text-white/90">Weather IQ</span>
              </div>
            </div>
          </div>

          {/* 2x3 Grid of Social Icon Buttons */}
          <div className="sm:col-span-4 bg-white rounded-[32px] p-5 border border-black/[0.03] grid grid-cols-2 gap-3 items-center justify-items-center">
            {/* GitHub */}
            <a
              href="https://github.com/Sanyam122"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#EEEEF6] flex items-center justify-center icon-btn"
              title="GitHub"
              aria-label="GitHub"
            >
              {GITHUB_SVG}
            </a>
            {/* LinkedIn */}
            <a
              href="https://www.instagram.com/sanyam_baj"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#EEEEF6] flex items-center justify-center icon-btn"
              title="Instagram"
              aria-label="Instagram"
            >
              {INSTAGRAM_SVG}
            </a>
            {/* Pinterest */}
            <a
              href="https://www.linkedin.com/in/jainsanyam01"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#EEEEF6] flex items-center justify-center icon-btn"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              {LINKEDIN_SVG}
            </a>
            {/* Behance */}
            <a
              href="https://x.com/jainsanyam441"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#EEEEF6] flex items-center justify-center icon-btn"
              title="X (Twitter)"
              aria-label="X (Twitter)"
            >
              {X_SVG}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

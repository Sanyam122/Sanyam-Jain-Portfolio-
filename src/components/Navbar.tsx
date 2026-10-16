export default function Navbar() {
  return (
    <header className="w-full h-20 bg-white rounded-[24px] px-8 flex items-center justify-between border border-black/[0.03]">
      <a href="#top" className="flex items-center gap-3.5" aria-label="Sanyam Jain — back to top">
        <div className="w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center text-white font-bold text-lg tracking-tight">
          SJ
        </div>
        <span className="text-[16px] font-semibold tracking-wider text-[#222222] uppercase">
          Sanyam jain
        </span>
      </a>

      <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#777777]">
        <a href="#services" className="nav-link hover:text-[#222222] transition-colors">
          Skills
        </a>
        <a href="#work" className="nav-link hover:text-[#222222] transition-colors">
          Work
        </a>
        <a href="#contact" className="nav-link hover:text-[#222222] transition-colors">
          Contact
        </a>
      </nav>

      <div>
        <a
          href="#contact"
          className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#222222] text-white text-[15px] font-medium shadow-btn-dark hover:bg-black btn"
        >
          Contact Me
        </a>
      </div>
    </header>
  );
}

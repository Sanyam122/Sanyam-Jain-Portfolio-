export default function Footer() {
  return (
    <footer className="w-full bg-white rounded-[24px] px-8 py-8 flex flex-col md:flex-row items-center justify-between border border-black/[0.03] gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center text-white font-bold text-sm">
          SJ
        </div>
        <span className="text-[14px] font-semibold text-[#222222] uppercase tracking-wider">
          Sanyam jain
        </span>
      </div>

      <div className="flex items-center gap-6 text-[13px] font-semibold uppercase tracking-wider text-[#666666]">
        <a href="#top" className="foot-link hover:text-[#2F9FB3]">
          B.tech
        </a>
        <a href="#top" className="foot-link hover:text-[#2F9FB3]">
          IT
        </a>
        <a href="#services" className="foot-link hover:text-[#2F9FB3]">
          Full Stack Dev
        </a>
        <a href="#work" className="foot-link hover:text-[#2F9FB3]">
          Java backend
        </a>
      </div>
    </footer>
  );
}

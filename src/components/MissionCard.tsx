export default function MissionCard() {
  return (
    <section id="about" className="w-full bg-[#2F9FB3] rounded-[40px] p-8 md:p-14 text-white">
      <div className="max-w-[1100px]">
        <h2 className="text-[32px] sm:text-[44px] md:text-[52px] font-medium leading-[1.08] tracking-[-0.03em] text-white">
          I build reliable, user-friendly web products, from clean interfaces to solid backend logic, and I'm always learning to ship better software.
        </h2>
      </div>

      <div className="mt-12 pt-8 border-t border-white/20 flex flex-wrap items-center justify-between gap-8">
        <span className="text-[26px] font-black tracking-tighter text-white/80 uppercase">
          REACT.JS
        </span>
        <span className="text-[26px] font-extrabold tracking-tight text-white/80 lowercase flex items-center gap-1">
          NODE.js
        </span>
        <span className="text-[24px] font-bold tracking-tight text-white/80 flex items-center gap-1.5">
          Express Js
        </span>
        <span className="text-[24px] font-semibold tracking-tight text-white/80">
          Java
        </span>
        <span className="text-[26px] font-black tracking-tight text-white/80 lowercase">
          MongoDb
        </span>
        <span className="text-[26px] font-bold tracking-tight text-white/80">
          REST API
        </span>
      </div>
    </section>
  );
}

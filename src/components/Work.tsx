export default function Work() {
  return (
    <section id="work" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column (Sticky) */}
      <div className="lg:col-span-4 lg:sticky lg:top-8 pt-4 space-y-6">
        <h2 className="text-[42px] md:text-[50px] font-medium text-[#222222] subhead-tight">
          Selected work
        </h2>
        <div>
          <a
            href="https://github.com/your-username?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#222222] text-white text-[14px] font-medium shadow-btn-dark hover:bg-black btn"
          >
            See All
          </a>
        </div>
      </div>

      {/* Right Column: Featured + 2-Column Projects */}
      <div className="lg:col-span-8 space-y-6">
        {/* Full-Width Featured Card */}
        <div className="bg-white rounded-[40px] p-6 md:p-8 border border-black/[0.03]">
          <div className="rounded-[28px] overflow-hidden aspect-[16/9] bg-stone-100">
            <img
              src="https://static.vecteezy.com/system/resources/previews/073/991/437/non_2x/illustration-of-online-job-portal-vector.jpg"
              alt="Job Portal project preview"
              data-label="Job Portal"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover media-img"
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
        </div>

        {/* 2-Column Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project 1: ZENPOINT */}
          <div className="bg-white rounded-[32px] p-6 border border-black/[0.03] flex flex-col justify-between">
            <div className="rounded-[24px] overflow-hidden aspect-[16/10] bg-stone-100">
              <img
                src="https://cdn.jim-nielsen.com/ios/512/weather-2019-02-07.png"
                alt="Weather IQ project preview"
                data-label="Weather IQ"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover media-img"
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
          </div>

          {/* Project 2: PAYU */}
          <a href="https://stayhub-dgq1.onrender.com/listings">
          <div className="bg-white rounded-[32px] p-6 border border-black/[0.03] flex flex-col justify-between">
            <div className="rounded-[24px] overflow-hidden aspect-[16/10] bg-stone-100">
              <img
                src="src/assets/stayhub.png"
                alt="StayHub project preview"
                data-label="StayHub"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover media-img"
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
          </div>
          </a>
        </div>
      </div>
    </section>
  );
}

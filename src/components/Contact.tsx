export default function Contact() {
  return (
    <section
      id="contact"
      className="w-full contact-gradient-card rounded-[32px] p-8 sm:p-14 md:p-20 flex justify-center border border-black/[0.04]"
    >
      <div className="w-full max-w-[840px] text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-[36px] sm:text-[46px] md:text-[52px] font-medium text-[#222222] subhead-tight">
            Contact with me to sizzle your project
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#777777] max-w-[620px] mx-auto leading-relaxed">
            Feel free to contact me if having any questions. I'm available for new projects or just for chatting.
          </p>
        </div>

        <form id="contact-form" className="space-y-4 pt-4 text-left" action="#" method="post">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              aria-label="Your name"
              autoComplete="name"
              required
              className="w-full px-6 py-4 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[#222222] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#6C63E8]/40 field text-[15px]"
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              aria-label="Your email"
              autoComplete="email"
              required
              className="w-full px-6 py-4 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[#222222] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#6C63E8]/40 field text-[15px]"
            />
          </div>
          <div>
            <textarea
              rows={5}
              id="message"
              name="message"
              placeholder="Work Description..."
              aria-label="Work description"
              required
              className="w-full p-6 rounded-[28px] bg-white/70 backdrop-blur-md border border-white/80 text-[#222222] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#6C63E8]/40 field text-[15px] resize-none"
            />
          </div>
          <div>
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden={true}
              className="hidden"
            />
            <button
              id="submit-btn"
              type="submit"
              className="w-full py-4 rounded-full bg-[#404247] text-white font-medium text-[16px] shadow-btn-dark btn btn-wide hover:bg-[#2b2d30] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span id="submit-label">Submit</span>
            </button>
            <p id="form-status" className="hidden" role="status" aria-live="polite"></p>
          </div>
        </form>
      </div>
    </section>
  );
}

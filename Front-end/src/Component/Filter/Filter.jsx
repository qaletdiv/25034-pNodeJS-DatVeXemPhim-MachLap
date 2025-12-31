export default function Filter() {
    return (
        <section className="py-10 bg-[#0f172a]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="relative">
                    <select
                        className="appearance-none w-full
               bg-card border border-white/10
               rounded-xl px-6 py-4 pr-12
               text-base"
                    >
                        <option>🎬 Thể loại</option>
                        <option>Hành động</option>
                        <option>Tình cảm</option>
                    </select>


                    <svg
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2
               w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                <div className="relative">
                    <select
                        className="appearance-none w-full
               bg-card border border-white/10
               rounded-xl px-6 py-4 pr-12
               text-base"
                    >
                        <option>📽 Định dạng</option>
                        <option>2D</option>
                        <option>3D</option>
                    </select>


                    <svg
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2
               w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                <div className="relative">
                    <select
                        className="appearance-none w-full
               bg-card border border-white/10
               rounded-xl px-6 py-4 pr-12
               text-base"
                    >
                        <option>📍 Rạp gần bạn</option>
                        <option>CGV</option>
                        <option>BHD</option>
                    </select>


                    <svg
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2
               w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

            </div>
        </section>
    );
}

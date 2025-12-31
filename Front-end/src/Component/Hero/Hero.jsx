import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../index.css";

const movies = [
    {
        id: 1,
        title: "Dune: Part Two",
        desc: "Cuộc chiến giành quyền kiểm soát hành tinh Arrakis.",
        image: "https://images.unsplash.com/photo-1608170825938-a8ea0305d46c",
    },
    {
        id: 2,
        title: "John Wick 4",
        desc: "Sát thủ huyền thoại trở lại với cuộc chiến khốc liệt.",
        image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b",
    },
    {
        id: 3,
        title: "Avatar 3",
        desc: "Cuộc phiêu lưu mới tại thế giới Pandora.",
        image: "https://images.unsplash.com/photo-1581905764498-f1b60bae941a",
    },
];

export default function Hero() {
    return (
        <section className="relative">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{ delay: 3000 }}
                loop
                pagination={{ clickable: true }}
                navigation
                className="h-[560px]"
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <div
                            className="h-full bg-cover bg-center relative"
                            style={{ backgroundImage: `url(${movie.image})` }}
                        >
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

                            {/* Content */}
                            <div className="relative z-10 h-full flex items-center">
                                <div className="max-w-7xl mx-auto px-6">
                                    <span className="inline-block mb-4 px-4 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                                        🔥 Phim hot
                                    </span>

                                    <h1 className="text-4xl md:text-6xl text-white font-extrabold mb-4">
                                        {movie.title}
                                    </h1>

                                    <p className="max-w-xl text-gray-300 mb-8">
                                        {movie.desc}
                                    </p>

                                    <div className="flex gap-4">
                                        <button className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/30 hover:scale-105 transition">
                                            🎟 Đặt vé ngay
                                        </button>

                                        <button className="px-8 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white hover:text-black transition">
                                            ▶ Xem trailer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}

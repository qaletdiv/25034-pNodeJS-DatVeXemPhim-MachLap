import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-[#020617] 
                    via-[#0f172a] to-black px-6"
    >
      {/* Glow background */}
      <div
        className="absolute w-96 h-96 bg-red-500/20 
                      blur-3xl rounded-full top-1/4 left-1/3"
      />

      <div
        className="relative max-w-4xl w-full 
                      bg-white/5 backdrop-blur-xl 
                      border border-white/10 
                      rounded-3xl p-10 
                      grid md:grid-cols-2 
                      gap-10 items-center"
      >
        {/* LEFT */}
        <div className="space-y-6 text-center md:text-left">
          <span className="text-red-500 font-semibold tracking-widest">
            ERROR 404
          </span>

          <h1
            className="text-5xl md:text-6xl 
                         font-extrabold text-white"
          >
            Không tìm thấy trang
          </h1>

          <p className="text-gray-400 text-lg">
            Trang bạn đang tìm không tồn tại hoặc đã bị xoá khỏi hệ thống.
          </p>

          <Link
            to="/"
            className="inline-flex items-center 
                       gap-2 bg-red-500 
                       hover:bg-red-600 
                       transition px-6 py-3 
                       rounded-xl font-semibold 
                       text-white shadow-xl"
          >
            ⬅ Quay về trang chủ
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Circle */}
            <div
              className="w-60 h-60 rounded-full 
                            bg-gradient-to-br 
                            from-red-500/20 
                            to-transparent 
                            blur-xl absolute"
            />

            {/* 404 */}
            <h1
              className="relative text-[120px] 
                           font-black text-white 
                           animate-pulse"
            >
              404
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

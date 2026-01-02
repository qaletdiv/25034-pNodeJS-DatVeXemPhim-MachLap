import React from "react";

const Footer = () => {
  return (
    <>
      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 pt-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* TOP FOOTER */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-700">
            {/* LOGO + DESC */}
            <div>
              <h2 className="text-2xl font-bold text-red-500 mb-3">
                🎬 TicketFilm
              </h2>
              <p className="text-sm leading-relaxed">
                Nền tảng đặt vé xem phim nhanh chóng, tiện lợi. Trải nghiệm điện
                ảnh đỉnh cao tại các rạp trên toàn quốc.
              </p>
            </div>
            {/* MENU */}
            <div>
              <h3 className="text-white font-semibold mb-4">Danh mục</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-red-500 transition">
                    Phim đang chiếu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500 transition">
                    Phim sắp chiếu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500 transition">
                    Rạp &amp; Giá vé
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500 transition">
                    Khuyến mãi
                  </a>
                </li>
              </ul>
            </div>
            {/* SUPPORT */}
            <div>
              <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-red-500 transition">
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500 transition">
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500 transition">
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500 transition">
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>
            {/* CONTACT */}
            <div>
              <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  📍 <span>TP. Cần Thơ, Việt Nam</span>
                </li>
                <li className="flex items-center gap-2">
                  📧 <span>support@ticketfilm.vn</span>
                </li>
                <li className="flex items-center gap-2">
                  📞 <span>1900 1234</span>
                </li>
              </ul>
            </div>
          </div>
          {/* SOCIAL + COPYRIGHT */}
          <div className="flex flex-col md:flex-row justify-between items-center py-6 text-sm">
            {/* SOCIAL */}
            {/* SOCIAL */}
            <div className="flex space-x-4 mb-4 md:mb-0">
              {/* Facebook */}
              <a
                href="#"
                className="group w-10 h-10 flex items-center justify-center rounded-full 
      bg-blue-600 border border-blue-600 
      hover:opacity-50 hover:border-blue-600 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 text-gray-50 group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 
23.403.597 24 1.326 24h11.495v-9.294H9.691V11.01h3.13V8.309
c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 
2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 
1.763v2.31h3.587l-.467 3.696h-3.12V24h6.116C23.403 
24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z"
                  />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                className="group w-10 h-10 flex items-center justify-center rounded-full 
      bg-gradient-to-br border from-pink-500 to-purple-600   border-gray-700 
      hover:opacity-50 hover:from-pink-500 hover:to-purple-600 
      hover:border-transparent transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 text-gray-50 group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7.75 2h8.5A5.75 5.75 0 0122 
7.75v8.5A5.75 5.75 0 0116.25 
22h-8.5A5.75 5.75 0 012 
16.25v-8.5A5.75 5.75 0 017.75 
2zm8.75 2h-9.5A3.75 
3.75 0 004 7.75v8.5A3.75 
3.75 0 007.75 
20h8.5A3.75 
3.75 0 0020 
16.25v-8.5A3.75 
3.75 0 0016.5 
4zm-4.5 
3.5a5 
5 0 110 
10 5 
5 0 010-10zm0 
2a3 
3 0 100 
6 3 
3 0 000-6zm5.25-.75a1 
1 0 110 
2 1 
1 0 010-2z"
                  />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#"
                className="group w-10 h-10 flex items-center justify-center rounded-full
      bg-red-600 border border-red-600 
      hover:opacity-50 hover:border-red-600 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 text-gray-50 group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M23.498 
6.186a3.02 
3.02 0 
00-2.124-2.136C19.515 
3.5 12 
3.5 12 
3.5s-7.515 
0-9.374.55A3.02 
3.02 0 
00.502 
6.186C0 
8.07 0 
12 0 
12s0 
3.93.502 
5.814a3.02 
3.02 0 
002.124 
2.136C4.485 
20.5 12 
20.5 12 
20.5s7.515 
0 9.374-.55a3.02 
3.02 0 
002.124-2.136C24 
15.93 24 
12 24 
12s0-3.93-.502-5.814zM9.75 
15.02V8.98L15.5 
12l-5.75 
3.02z"
                  />
                </svg>
              </a>
            </div>
            {/* COPYRIGHT */}
            <p className="text-gray-400">
              © 2025 CineBooking. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

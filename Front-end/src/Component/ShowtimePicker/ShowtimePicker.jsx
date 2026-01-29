import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Ho_Chi_Minh";

/* ===== FORMAT HELPERS (VN TIME) ===== */
const formatDateVN = (iso) => dayjs.utc(iso).tz(TZ).format("YYYY-MM-DD");

const formatTimeVN = (iso) => dayjs.utc(iso).tz(TZ).format("HH:mm");

const isPastShowtime = (iso) => dayjs().tz(TZ).isAfter(dayjs.utc(iso).tz(TZ));

/* ===== TODAY (VN) ===== */
const todayVN = dayjs().tz(TZ).format("YYYY-MM-DD");

const ShowtimePicker = ({ movie }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  /* ===== 1. DATE LIST (CHỈ HÔM NAY & TƯƠNG LAI) ===== */
  const dates = useMemo(() => {
    if (!movie?.showtimes?.length) return [];

    return [
      ...new Set(
        movie.showtimes
          .map((st) => formatDateVN(st.startTime))
          .filter((date) => dayjs(date).isSameOrAfter(todayVN, "day")),
      ),
    ].sort((a, b) => dayjs(a).unix() - dayjs(b).unix());
  }, [movie]);

  /* ===== AUTO SELECT NGÀY ĐẦU ===== */
  useEffect(() => {
    if (dates.length && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  /* ===== 2. FILTER SHOWTIME THEO NGÀY ===== */
  const showtimesByDate = useMemo(() => {
    if (!selectedDate) return [];

    return movie.showtimes.filter(
      (st) => formatDateVN(st.startTime) === selectedDate,
    );
  }, [movie, selectedDate]);

  /* ===== 3. GROUP THEO RẠP ===== */
  const theaters = useMemo(() => {
    const grouped = showtimesByDate.reduce((acc, st) => {
      const name = st.room?.movietheater?.name || "Không xác định";
      acc[name] = acc[name] || [];
      acc[name].push(st);
      return acc;
    }, {});

    Object.keys(grouped).forEach((key) => {
      grouped[key].sort(
        (a, b) => dayjs.utc(a.startTime).tz(TZ) - dayjs.utc(b.startTime).tz(TZ),
      );
    });

    return grouped;
  }, [showtimesByDate]);

  /* ===== UI ===== */
  if (!dates.length) {
    return (
      <div className="bg-[#1a1a1a] rounded-2xl p-8 text-gray-400">
        Chưa có lịch chiếu
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Lịch chiếu</h2>

      {/* ===== DATE PICKER ===== */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`px-6 py-3 rounded-full transition
              ${
                selectedDate === date
                  ? "bg-red-600"
                  : "bg-white/10 hover:bg-white/20"
              }
            `}
          >
            {dayjs(date).format("DD/MM")}
            {date === todayVN && " (Hôm nay)"}
          </button>
        ))}
      </div>

      {/* ===== THEATER & TIMES ===== */}
      <div className="space-y-8">
        {Object.entries(theaters).map(([theater, sts]) => (
          <div key={theater}>
            <h3 className="text-xl font-semibold mb-4">{theater}</h3>

            <div className="flex flex-wrap gap-4">
              {sts.map((st) => {
                const disabled = isPastShowtime(st.startTime);

                return (
                  <button
                    key={st.id}
                    disabled={disabled}
                    onClick={() => navigate(`/seats/${st.id}`)}
                    className={`px-6 py-3 rounded-lg border transition
                      ${
                        disabled
                          ? "border-gray-600 text-gray-500 cursor-not-allowed"
                          : "border-white/20 hover:bg-red-600"
                      }
                    `}
                  >
                    {formatTimeVN(st.startTime)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowtimePicker;

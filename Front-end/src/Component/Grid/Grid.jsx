// import DropCell from "../DropCell/DropCell";

// export default function Grid({ rooms, date }) {
//   // 48 ô = 24h * 2
//   const slots = Array.from({ length: 48 }, (_, i) => {
//     const hour = Math.floor(i / 2);
//     const minute = i % 2 === 0 ? 0 : 30;
//     return { hour, minute };
//   });

//   return (
//     <div className="overflow-x-auto">
//       <div className="grid grid-cols-[150px_repeat(48,100px)]">
//         {/* HEADER */}
//         <div></div>
//         {slots.map((s, i) => (
//           <div key={i} className="text-center font-semibold">
//             {String(s.hour).padStart(2, "0")}:{s.minute === 0 ? "00" : "30"}
//           </div>
//         ))}

//         {/* ROOMS */}
//         {rooms.map((r) => (
//           <div key={r.id} className="contents">
//             <div className="border p-2 font-medium text-center">{r.name}</div>

//             {slots.map((s, i) => (
//               <DropCell
//                 key={i}
//                 roomId={r.id}
//                 hour={s.hour}
//                 minute={s.minute}
//                 date={date}
//                 showtimes={r.showtimes}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// Grid.jsx
import DropCell from "../DropCell/DropCell";

export default function Grid({ rooms, date }) {
  const slots = Array.from({ length: 48 }, (_, i) => ({
    hour: Math.floor(i / 2),
    minute: i % 2 === 0 ? 0 : 30,
  }));

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[150px_repeat(48,100px)]">
        <div></div>
        {slots.map((s, i) => (
          <div key={i} className="text-center font-semibold">
            {String(s.hour).padStart(2, "0")}:{s.minute === 0 ? "00" : "30"}
          </div>
        ))}

        {rooms.map((r) => (
          <div key={r.id} className="contents">
            <div className="border p-2 text-center">{r.name}</div>
            {slots.map((s, i) => (
              <DropCell
                key={i}
                roomId={r.id}
                hour={s.hour}
                minute={s.minute}
                date={date}
                showtimes={r.showtimes}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

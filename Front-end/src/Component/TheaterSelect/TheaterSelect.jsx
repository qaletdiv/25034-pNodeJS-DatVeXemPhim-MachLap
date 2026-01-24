export default function TheaterSelect({ list, onChange }) {
  return (
    <select
      className="border p-2 rounded"
      onChange={(e) => onChange(e.target.value)}
    >
      <option>-- Chọn rạp --</option>
      {list.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}

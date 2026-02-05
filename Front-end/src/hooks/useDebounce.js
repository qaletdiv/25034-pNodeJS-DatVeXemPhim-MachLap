import { useEffect, useState } from "react";

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Sử dụng ref để lưu giá trị stringify để so sánh
  const stringifiedValue = JSON.stringify(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [stringifiedValue, delay]); // Dùng stringified value thay vì value

  return debouncedValue;
}

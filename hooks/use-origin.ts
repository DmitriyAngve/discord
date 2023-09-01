import { useEffect, useState } from "react";

// Это хук для чтения текущего URL
export const useOrigin = () => {
  const [mouted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : ""; // это код для полуения origin текущей URL страницы.
  // Сперва идет проверка, существует ли window вообще.
  // Если существует (то есть код выполняется в браузере), этот код обращается к "window.location.origin" чтобы получить "origin" текущей страницы
  // Далее используется тернарный оператор для возврата "origin" если "window" существует или пустой строки в противном случае.
  if (!mouted) {
    return "";
  }

  return origin;
};

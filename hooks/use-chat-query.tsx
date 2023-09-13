import qs from "query-string";

import { useInfiniteQuery } from "@tanstack/react-query"; // хук, предоставляющий поддержку для выполнения бесконечных запросов. Упрощает реализацию бесконечной загрузки данных в вашем приложении, обеспечивая удобный и гибкий способ управления данными, включая автом-ое кэширование и обработку ошибок

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string; // ключи запроса это уникальные строки, которые идентифицируют  определенный запрос в React Query. Каждый запрос должен иметь уникальный ключ, чтобы React Query мог отслеживать его состояние и управлять кэшированием
  apiUrl: string; // эта строка предоставляет URL-адрес, по которому будет выполнен запрос данных (указывает откуда брать данные для запроса)
  paramKey: "channelId" | "conversationId"; // эта строка указыает, какой параметр будет использоваться в запросе данных для фильтрации или определения, какие данные нужно получить
  paramValue: string; // эта строка будет предоставлять значение параметра, который будет использоваться в запросе данных. Это значение будет динамически изменяться в зависимости от текущего контекста
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  // pageParam - cursor for infinite loading
  // функция выполняет запрос данных в чате
  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      // функция для построения URL-адреса запроса. Создает "apiUrl", а также доп. параметры.
      {
        url: apiUrl,
        query: {
          cursor: pageParam, // значение курсора
          [paramKey]: paramValue, // динамическое свойство, которое будет включено в параметры запроса. "paramKey" и "paramValue" предоставляются в параметрах функции "useChatQuery". Использованы квадратные скобки - потому что переменная будет генерироваться во время выполнения, квадратными скобками создаётся динамическое свойство объекта. "paramKey" может быть ""channelId" | "conversationId""
        },
      },
      { skipNull: true } // этот второй аргумент указывает на пропуск параметров с пустыми значения при построении URL-адреса. Так пишут, чтобы избежат добавления null/undefined параметров в URL-адрес
    );

    const res = await fetch(url);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      // это хук используется для выполнения пагинированных запросов с возможностью бесконечной загрузки данных. Он принимает несколько параметров

      // ключ запроса, преставленный массивом, он идентифицирует запрос и его параметры.
      queryKey: [queryKey],
      // функция, которая выполняет запрос
      queryFn: fetchMessages,
      // функция, которая извлекает параметры следующей страницы из данных последней страницы (используется для определения, когда больше данных не доступно)
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      // интервал перезагрузки данных. Если WebSocket сконнетился - то интервал включен, и данные будут автоматически перезагружаться. В противном случае интервал равен 1 секунде (isConnected === false)
      refetchInterval: isConnected ? false : 1000,
    });

  // после выполнения хука, я получаю ссвойства:
  //  data - данные полученные из запроса
  //   fetchNextPage - функция, которая загружает следующую страницу данных если она есть
  // hasNextPage - булевое значение, указывающее, есть ли еще данные для загрузки
  // isFetchingNextPage - булевое значение, указывающее, выполняется ли в данный момент запрос для загрузки следующей страницы
  // status - статус запроса. Он может иметь значения: loading/error/success
  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
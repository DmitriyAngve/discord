import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};
// каждый ключ представляет собой часть конфигурации сокетов

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
}; // тут Я комбинирую типы, приходящие из призмы

// хук для управления сокетами
export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  // извлекаем из хука значение "socket". В моем случае это пользовательский хук, который предоставляет доступ к экземпляру сокета
  const { socket } = useSocket();

  // это хук из библиотеки React Query. Он предоставляет доступ к экземпляру queryClient, который используется для управления данными, полученными через запросы с использованием React Query
  const queryClient = useQueryClient();

  // этот код для обновления данных на клиенте в режиме реального времени с использованием сокетов
  useEffect(() => {
    if (!socket) {
      return;
    } // так как не смысла выполнять остальной код без сокета

    // подписываемся на событие updateKey. Когда сервер отправляет событие updatedKey, код внутри этой функции выполняется
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      // функция принимает аргумент message с комбинированным типом из призмы "MessageWithMemberWithProfile"
      queryClient.setQueryData([queryKey], (oldData: any) => {
        // "setQueryData" - это метод библиотеки react-query. Используется для обновления данных в кеше клиента. Он принимает ключ queryKey и ф-ю, которая обновляет данные
        // oldData: any - это текущие данные из кеша (oldData)

        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        } // тут идёт проверка, есть ли какие-либо данные в тукущем кеше. Если данных нет, то ф-ия возвращает oldData без изменений

        // далее создается новый массив данных, который будт содержать обновленные данные. Начинаем с копирования старых данных.
        // Идет переборка страницы данных и их элементы "items: page.items.map((item: MessageWithMemberWithProfile)" и поиск совпадающий "id". Если они есть, то находим такое сообщение и заменяем его на новое "message". В противном случае оставляем без изменений.
        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        // тут возвращаем обновленные данные, заменяя старые данные новыми внутри массива "pages"
        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    // Сперва подписываемся на событие "addKey" через сокет. Когда сервер отправляет событие "addKey" - код выполнится
    // "queryClient.setQueryData([queryKey], ...)" этот метод "setQueryData" используется (из реакт квери он) для обновления данных в кеше. "queryKey" - обновляет данные

    // "if (!oldData || !oldData.pages || oldData.pages.length === 0){..." - если нет в текущем кеше данных или они пусты, то создаем новую страницу с одним новым сообщение и возвращаем её
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        // копируем старые данные, чтобы не не менять их напрямую
        const newData = [...oldData.pages];

        // здесь обновляем первую страницу данных, обновляя новое сообщение в начале поиска сообщений
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        // возвращаем обновленные данные, заменяя старые данные новыми ввнтури массива pages
        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    // Эта ф-ия возвращает ф-ию очистки. Она будет выполнены, когда компонент размонтируется или  когда одна из зависимостей "[queryClient, addKey, queryKey, socket, updateKey]" изменится
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]);
};

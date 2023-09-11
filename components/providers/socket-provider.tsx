"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { io as ClientIO } from "socket.io-client";

// определеям структуру объекта состояния, который будет храниться в контексте
type SocketContextType = {
  socket: any | null; // это поле, где будет храниться Websocket объект
  isConnected: boolean; // это поле указывает, установлено ли Websocket соединние
};

// это создание конекста с использованием createContext из React. Создается контекст с начальным значением, где socket устанавливается в null, а isConnected в false
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// пользовательский хук, который представляет доступ к данным контекса. Использует useContext для получения значений из контекста SocketContext
export const useSocket = () => {
  return useContext(SocketContext);
};

// Это провайдер для работы с WebSocket, в который надо будет обернуть приложение и предоставить доступ к WebSocket через контекст
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  // тут деструктурируем пропсы children, которыепредставляют собой дочерние компоненты, обернутые провайдером
  const [socket, setSocket] = useState(null); // здесь создается состояние socket, которое будет хранить WebSocket, оно будет изменено, когда WebSocket будет установлен
  const [isConnected, SetIsConnected] = useState(false); // здесь создается состояние, которое указывает, установлено ли WebSocket соединение

  useEffect(() => {
    // этот эффект, который будет выполняться после монтирования компонента.
    // для управления жизненным циклом WebSocket'а

    // Внутри создается новый WebSocket с использованием ClientIO. Этот WebSocket настроен на подключение к серверу с URL, полученным из переменных окружения и на использование определенного пути "api/socket/io"
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    );

    // здесь устанавливается обработчик события connect. Этот обработчик вызывается, когда соединение с WebSocket-сервером успешно. Внутри SetIsConnected(true) - что означает, что соединений установленно
    socketInstance.on("connect", () => {
      SetIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      SetIsConnected(false);
    });

    // Обновляем состояние компонента
    setSocket(socketInstance);

    // В блоке return возвращается функция, которая будет выполнена, когда компонент будет размонтирован (отключение WebSocket)
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {/* value - задаёт данные, которые будут разделяться между компонентами, использующими контекст, и позволяет им получать доступ к этим данным */}
      {children}
    </SocketContext.Provider>
  );
};

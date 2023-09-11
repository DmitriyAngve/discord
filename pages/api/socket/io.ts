import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  }, // api - объект конфигурации для API маршрутов в Next.js
  // bodyParser - параметр, указывающий должен ли Next.js ыполнять автоматический разбор (парсинг) тела запроса, отправленного клиентом. Установил в false - чтобы парсинг не выполнялся автоматически
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  // тут проверка наличия io на серверном соксе (socket.server.io). Если он не существует, то выполняются дальнейшие шаги
  if (!res.socket.server.io) {
    // создание пути path, который будет использоваться для установки соес-сервера (обычно это URL адрес, по которому клиенты подключаются к серверу соксов)
    const path = "/api/socket/io";
    // получение объекта HTTP сервера (httpServer) из res.socket.server
    const httpServer: NetServer = res.socket.server as any;
    // создание экземпляра io сокс сервера, используя полученный httpServer и опции конфигурации SocketIO
    const io = new ServerIO(httpServer, {
      path: path,
      // @ts-ignore
      // addTrailingSlash: false - этот параметр указывает, следует ли автоматически добавлять к пути слэш в конце, если он отсутствует
      addTrailingSlash: false,
    });
    // присвоение созданного io объекта серверному соксу
    res.socket.server.io = io;
  }

  res.end();
}; // Обработчик сокс-сервера в Next.js

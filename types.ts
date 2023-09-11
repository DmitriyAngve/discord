import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
// "[]" в конце позволяет опеределить, что "members" это массив объектов, и я могу добавлять в него несколько элементов типа "Member & { profile: Profile }"

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
// NextApiResponse это стандартный тип данных, предоставляемый Next.js для представления HTTP-ответов
// socket - это доп. свойство, которое расширяет NextApiResponse. Представляет собой объект сетевоего соединения
// server - это сво-во объекта socket, которое представляет собой объект сервера (в данном случае NetServer)
// io - это сво-во объекта server, коорое представляет собой объект сервера SocketIO (SocketIOServer)
// Таким образом, NextApiResponseServerIo позволяет работать с HTTP-ответами, содержащими информацию о сокете и сервере Socket.IO

"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs"; // хук помогает получить информацию о текущем аутентифицированном пользователе. Используя этот хук можно получить данные пользователя, который заходит, авторизируясь. Получить можно идентификатор, адрес почты и тд.
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState();

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return; // если одно из этих условий отсутсвует, то дальнейшие действия не выполняются

    const name = `${user.firstName} ${user.lastName}`; // переменная, хранящая имя и фамилию в строку

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        ); // получаем данные с API с параметрами комнаты канала (чата)
        const data = await resp.json(); // преобразуем полученный ответ в json
        setToken(data.token); // затем устанавливаем значение data.json в состояние с помощью setToken
      } catch (e) {
        console.log(e);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 aimante-spin my-4" />
        <p>Loading...</p>
      </div>
    );
  }
};

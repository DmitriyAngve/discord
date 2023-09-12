import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { Message } from "@prisma/client";

import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10; // устанавливаем количество сообщений, которые будут запрашиваться в одном пакете при загрузке сообщений (при каждом запросе на получение сообщений будет запрошено 10 сообщений)

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url); // создаем новый объект URL на основе URL-адреса, предоставленного в "req.url", затем извлекаем "searchParams" из этого URL-адреса

    // cursor and channelId будут содержать значения, извлеченные из параметров запроса в URL-адресе.
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    let messages: Message[] = []; // создаем пустой массив для хранения объектов сообщений типа Message

    // с помощью cursor определяем с какого момента начинать загрузку сообщений. Если он присутствует, то значит мы загружаем сообщения с учётом пагинации (иначе начинаем сначала)
    if (cursor) {
      // если cursor присутствует, то применяем findMany для выполнения запроса к базе данных.
      messages = await db.message.findMany({
        take: MESSAGES_BATCH, // сколько сообщений берем из запроса
        skip: 1, // пропускаем 1 сообщение после указанного "cursor" (исключаем сообщение, на которое указывает cursor)
        cursor: {
          id: cursor,
        }, // это указывает, с какого сообщения начинать выборку (указываем id, который передан в cursor)
        where: {
          channelId,
        }, // запарашиваются сообщения для указанного "channelId" - это фильтрует сообщения по каналу

        include: {
          member: {
            // включается информация о "member", который написал сообщение
            include: {
              profile: true, // включая его profile
            },
          },
        },
        orderBy: {
          createdAt: "desc", // сообщения упорядочиваются по времени создания в порядке убывания
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } // тут начинается загрузки сообщений без учёта пагинации с самого начала списка.

    let nextCursor = null; // так как я еще не знаю какой будет курсор для следующей страницы (nextCursor - будет хранить идентификатор, который позволит определить с какой страницы начинать загрузку следующую порцию сообщений)

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    } // проверяем, есть ли еще сообщения на сервере, которые могут быть загружены на следующей страниц (если длина messages = MESSAGE_BATCH). В этом случае, nextCursor устанавливается в идентификатор последнего сообщения из текущей порции сообщений

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

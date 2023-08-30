import { v4 as uuidv4 } from "uuid";
import { currrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currrentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      // код для создания нового сервера в БД
      data: {
        profileId: profile.id, // связывание созданного сервера с определенным профилем по его идентификатору
        name,
        imageUrl,
        inviteCode: uuidv4(), // код для создания уникального кода приглашения (invite Code) с использованием функции "uuidv4" импортированной из библиотеки "uuid"
      },
    });
  } catch (error) {
    console.log("[SERVERS_POST]", error);
  }
  return new NextResponse("Internal Error", { status: 500 });
}

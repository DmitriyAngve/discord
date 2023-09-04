import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url); // деструктурируем сразу "searchParams", чтобы вытащить параметры из объекта URL, приходящие мне из req
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    const server = await db.server.update({
      // берем базу данных и обновляем сервер с помощью "update"
      where: {
        id: serverId,
        profileId: profile.id,
      }, // объявляем место где будем искать
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              }, // ищем пользователя, которого хотим обновить (его "profileId" не должен совпадать с "profile.id") - это чтобы не обновить самого Админа.
            },
            data: {
              role,
            }, // присваиваем новую роль
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          }, // после обновления сервера указываем какие данные хотим получить (всех пользователей и информацию об их профилях)
          orderBy: {
            role: "asc",
          }, // к тому же результат выдать отсортированным по ролям
        },
      },
    }); // короче, код для обновления роли участника (не админа), а так же возврат обновленной информации по ролям

    return NextResponse.json(server);
  } catch (error) {
    console.log("MEMBERS_ID_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

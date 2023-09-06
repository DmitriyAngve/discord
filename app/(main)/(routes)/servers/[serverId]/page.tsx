import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirectToSignIn } from "@clerk/nextjs";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    // ищем никальную запись, имеющую id = params.serverId
    // и хотя бы одного пользователя (members), у которого "profileId" равен "profile.id"
    // то есть ищется сервер, в котором пользователь "profile" является участником
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id, // подтвердим, что пользователь является пользователем
        },
      },
    },
    include: {
      // тут определяем какие связанные данные должны быть включены в результат запроса
      // в данном случае - channels
      channels: {
        where: { name: "general" }, // не даем переименовать канал с именем "general"
        orderBy: {
          createdAt: "asc", // сортируем по полю "createdAt"
        },
      },
    },
  });

  const initialChannel = server?.channels[0]; // берем первую запись

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;

import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId, // принадлежность к опеределнному серверу
      profileId: profile.id, // и имеет определенный профиль
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  ); // ищем беседу между наши профилем (currentMemeber.id) и пользователем, на которого кликнули (params.memberId)

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  } // если беседы нет, то автоматом перекидывает на general

  const { memberOne, memberTwo } = conversation; // Если при клики удалось создать беседу или найти существуюущую (findFirst) = > тогда достанем из conversation обоих пользователей

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne; // сравниваю участника mmeberOne с profile.id это проверка на то, принадлежит ли memeberOne текущему профилю (profile).
  // Если memberOne.profileId соответствует текущему профилю profile, то otherMember устанавливается равынм membrTwo. Если условие не выполняется, то otherMember устанавливается равным memberOne
  // По сути, это условие опрелеляет, кто из двух участников чата не является текущим профилием

  return <div>Member ID Page!</div>;
};
export default MemberIdPage;

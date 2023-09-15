import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

import { redirectToSignIn } from "@clerk/nextjs/server";

import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { MediaRoom } from "@/components/media-room";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
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
  // Если memberOne.profileId соответствует текущему профилю profile, то otherMember устанавливается равным membrTwo. Если условие не выполняется, то otherMember устанавливается равным memberOne
  // По сути, это условие опрелеляет, кто из двух участников чата не является текущим профилием

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation" // не забывай про ChatHeaderProps (там забито "channel" | "conversation")
      />
      {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};
export default MemberIdPage;

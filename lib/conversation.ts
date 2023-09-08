import { db } from "@/lib/db";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }

  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    // функция выполняет поиск беседы между memberOne and memberTwo. Использует метод findFirst чтобы найти первую беседу, соответствующую параметрам описанным ниже
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      // это условие для поиска, в данном случае, беседы, у которой memberOneId равен memberOneId и memberTwoId равен memberTwoId. Это условие определяет да фильтра с помощью оператора AND
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
        // Тут с помощью include Я запращиваю информацию о двух участниках беседы memberOne and memberTwo. Для каждого из них включена информация об иъ профилях "profile: true"
      },
    });
  } catch {
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      // тут Я указываю какие данные будут сохранены в ноовой записи беседы "memberOneId" and "memberTwoId" - это идентификаторы участников беседы. Передаем их в data
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        // первый должен содержать profile
        memberTwo: {
          include: {
            profile: true,
          },
        },
        // второй должен содержать profile
      },
    });
  } catch {
    return null;
  }
};

import { db } from "@/lib/db";

const findConversation = async (memberOneId: string, memberTwoId: string) => {
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
      }, // Тут с помощью include Я запращиваю информацию о двух участниках беседы memberOne and memberTwo. Для каждого из них включена информация об иъ профилях "profile: true"
      memberTwo: {
        include: {
          profile: true,
        },
      },
    },
  });
};

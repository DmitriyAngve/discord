import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
// "[]" в конце позволяет опеределить, что "members" это массив объектов, и я могу добавлять в него несколько элементов типа "Member & { profile: Profile }"

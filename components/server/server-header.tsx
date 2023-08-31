"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles; // этот Сервер из types.ts, потому что Сервер имеет Channels, Members and profiles of this members
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  return <div>Server Header</div>;
};

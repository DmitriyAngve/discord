import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  // now let's find server with this Id
  const server = await db.server.findUnique({
    where: {
      id: params.serverId, // serverId - from prop "params" because I named folder "[serverId]"
    },
  });

  return <div>{children}</div>;
};

export default ServerIdLayout;

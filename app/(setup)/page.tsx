import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();

  // Users is part of servers?
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // If we manage to find the server that this profile is a part of we're gonna immediately redirect them to that server. If there is no such server we're gonna show them for now just a text "Create a Server "
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <div>Create a Server</div>;
};

export default SetupPage;

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { use } from "react";

export const currrentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};

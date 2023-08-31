"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "@/components/modals/create-server-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  } // preventing the modals to be rendered on the server side because that can create inconsistencies thus creating hydration errors

  return (
    <>
      <CreateServerModal />
    </>
  );
};

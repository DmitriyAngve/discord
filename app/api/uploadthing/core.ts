import { auth } from "@clerk/nextjs";
import { use } from "react";

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  return { userId: userId };
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

// "serverImage" и "messageFile" - это два разных маршрута обработки типов файлов.
// "f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }) и f(["image", "pdf"])" - настройки параметров файлов для каждого маршрута
// ".middleware(() => handleAuth())" - это добавление промежуточного обработчика, который будет вызываться перед обработкой запроса для каждого маршрута. Использует функцию "handleAuth()" для аутентификации (могут быть и другие действия)
// ".onUploadComplete(() => {})" - этот обработчик будет вызываться после успешной загрузки файла на сервер

export type OurFileRouter = typeof ourFileRouter;

// хук для контролирования всех модулей в зустанд

import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel";
// определяет пользовательский тип "ModalType", который имеет одно значение "createServer" - это ограниченный набор возможных типов модальных окон
interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
} // описывает состояние и действия, доступные в этом хранилище состояния
// isOpen :(type: ModalType) => void - метод "onOpen" используетя для открытия модального окна с заданным типом. Он принимает аргумент "type" и устанавливает соответсвующий тип модального окна в св-во "type"

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
// "export const useModal = create<ModalStore>((set) => ({})" - эта строка создает хранилище Zustand, используя функцию "create". Внутри функции "create" определенно начальное состояние модального окна, где "type" равно "null" и тд

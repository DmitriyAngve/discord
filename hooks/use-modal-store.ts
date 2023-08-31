// хук для контролирования всеъ модулей в зустанд
import { create } from "zustand";

export type ModalType = "createServer";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
} // описывает состояние и действия, доступные в этом хранилище состояния
// isOpen :(type: ModalType) => void - метод "onOpen" используетя для открытия модального окна с заданным типом. Он принимает аргумент "type" и устанавливает соответсвующий тип модального окна в св-во "type"

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ type: null, isOpen: false }),
}));

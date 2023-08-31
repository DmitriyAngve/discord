// хук для контролирования всеъ модулей в зустанд
import { create } from "zustand";

export type ModalType = "createServer"; // определяет пользовательский тип "ModalType", который имеет одно значение "createServer" - это ограниченный набор возможных типов модальных окон

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
// "export const useModal = create<ModalStore>((set) => ({})" - эта строка создает хранилище Zustand, используя функцию "create". Внутри функции "create" определенно начальное состояние модального окна, где "type" равно "null" и тд

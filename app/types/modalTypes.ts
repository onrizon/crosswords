export interface ModalContextProps {
  modal: { title: string; lottie: unknown; description: string; button?: () => void } | null;
  setModal: (modal: { title: string; lottie: unknown; description: string; button?: () => void } | null) => void;
}
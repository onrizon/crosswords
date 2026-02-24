export interface ModalContextProps {
  modal: { title: string; lottie: React.ReactNode; description: string; button?: () => void } | null;
  setModal: (modal: { title: string; lottie: React.ReactNode; description: string; button?: () => void } | null) => void;
}
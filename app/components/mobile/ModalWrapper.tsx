import { ModalContext } from "@/lib/Context";
import { ModalContextProps } from "@/types/modalTypes";
import { useState } from "react";
import Modal from "./Modal";

export default function ModalWrapper({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalContextProps["modal"]>(null);

  return (
    <ModalContext.Provider value={setModal}>
      {children}
      <Modal modal={modal} />
    </ModalContext.Provider>
  );
}
import { Context } from "@/lib/Context";
import { ModalContextProps } from "@/types/modalTypes";
import { useState } from "react";
import Modal from "./Modal";



export default function ModalContext({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalContextProps["modal"]>(null);

  return (
    <Context.Provider value={{ modal, setModal }}>
      {children}
      <Modal />
    </Context.Provider>
  );
}
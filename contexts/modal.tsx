"use client";

import {
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { Modal } from "@/components/modal";

interface ModalContextType {
  pushModal: (modalInfo: ReactNode) => void;
  shiftModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  pushModal: (modalInfo: ReactNode) => modalInfo,
  shiftModal: () => null,
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ReactNode[]>([]);

  const pushModal = useCallback(
    (newContent: ReactNode) => {
      setContent((c) => [newContent, ...c]);
    },
    [setContent]
  );

  const shiftModal = useCallback(() => {
    setContent((c) => c.slice(1));
  }, []);

  const modalValues = useMemo(
    () => ({
      pushModal,
      shiftModal,
    }),
    [pushModal, shiftModal]
  );

  return (
    <ModalContext.Provider value={modalValues}>
      {children}
      <Modal isOpen={content.length > 0} shiftModal={shiftModal}>
        {content[0]}
      </Modal>
    </ModalContext.Provider>
  );
}
const useModal = () => useContext(ModalContext) as ModalContextType;

export default useModal;

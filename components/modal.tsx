import { Card } from "@/components/ui/card";

interface Props {
  isOpen: boolean;
  shiftModal: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, shiftModal, children }: Props) {
  return (
    isOpen && (
      <div
        className="fixed w-screen h-screen flex items-center justify-center backdrop-blur-sm bg-black/[0.6] z-10"
        onClick={shiftModal}
      >
        <Card
          className="max-w-full flex flex-col justify-start items-left min-w-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </Card>
      </div>
    )
  );
}

import React from "react";

interface NoteCardsContainerPropsInterface {
  children: JSX.Element;
}

function NoteCardsContainer({ children }: NoteCardsContainerPropsInterface) {
  return (
    <div className="flex-1 max-w-screen-md p-7  bg-[#1A1A1A] w-[700px] h-[300px] rounded-[10px]">
      {children}
    </div>
  );
}

export default NoteCardsContainer;

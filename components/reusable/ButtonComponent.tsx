import React from "react";

interface ButtonComponentProps extends React.HTMLProps<HTMLButtonElement> {
  variant?: "solid" | "bordered";
}

const MAIN_BUTTON_STYLES = " px-[23px] h-[39px] w-full text-sm";

const BORDERED_STYLES = "rounded-[5px] rounded border border-[#434343] ";
const SOLID_STYLES = "rounded-[5px] rounded bg-[#282828]";

const classNames: any = {
  bordered: BORDERED_STYLES,
  solid: SOLID_STYLES,
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  variant = "solid",
  children,
  onClick = () => {},
  disabled = false,
}) => {
  return (
    <button
      className={`${classNames[variant]} ${MAIN_BUTTON_STYLES} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
export default ButtonComponent;

import { IconType } from "react-icons";

export interface DefaultButtonProps {
  label: string;
  callback: () => void;
  filled?: boolean;
  Icon?: IconType;
  RightIcon?: IconType;
}

export const DefaultButton: React.FC<DefaultButtonProps> = ({
  label,
  callback,
  filled,
  Icon,
  RightIcon,
}) => {
  return (
    <button
      type="button"
      onClick={callback}
      className={`${
        filled
          ? "text-white bg-custom-primary hover:bg-custom-primary/90"
          : "text-custom-primary hover:text-custom-primary/90"
      } w-full text-center focus:outline-none rounded-md text-sm px-5 py-2 inline-flex justify-center items-center mr-2`}
    >
      {Icon && (
        <label className="mr-1">
          <Icon />
        </label>
      )}
      {label}
      {RightIcon && (
        <label className="ml-1">
          <RightIcon />
        </label>
      )}
    </button>
  );
};

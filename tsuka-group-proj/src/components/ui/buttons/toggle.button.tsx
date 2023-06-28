import { useState } from "react";

interface SwitchProps {
  isContinuous: boolean;
  onToggle: () => void;
}

const Switch = ({ isContinuous, onToggle }: SwitchProps) => {
  const toggle = () => {
    onToggle();
  };

  return (
    <div className="flex items-center">
      <label htmlFor="switch" className="ml-3 relative flex items-center">
        <input
          type="checkbox"
          id="switch"
          name="switch"
          className="sr-only"
          checked={isContinuous}
          onChange={toggle}
        />
        <div
          className={`w-12 h-6 p-1 rounded-full ${
            isContinuous ? "bg-custom-green" : "bg-custom-red"
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              isContinuous ? "translate-x-[24px]" : ""
            }`}
          />
        </div>
      </label>
    </div>
  );
};

export default Switch;

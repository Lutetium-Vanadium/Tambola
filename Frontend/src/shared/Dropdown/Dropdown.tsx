import React, { useState } from "react";

interface DropdownProps {
  placeholder: string;
  options: string[];
  value?: string;
  changeValue: (newValue: string) => void;
  isButton?: boolean;
}

function Dropdown({ placeholder, options, changeValue: _changeValue, value, isButton = false }: DropdownProps) {
  const [title, setTitle] = useState(value ?? placeholder);
  const [showOptions, setShowOptions] = useState(false);

  const changeValue = (title: string) => {
    if (!isButton) {
      setTitle(title);
    }
    _changeValue(title);
  };

  return (
    <div className={`dropdown${showOptions ? " -focus" : ""}${isButton ? " btn" : ""}`} onClick={() => setShowOptions(!showOptions)}>
      <p className={`title${title === placeholder ? " -placeholder" : ""}`}>{title}</p>
      <ul className="options" style={{ height: showOptions ? `${options.length * 2}rem` : 0 }}>
        {options.map((option, index) => (
          <li className="option" key={index} onClick={() => changeValue(option)}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dropdown;

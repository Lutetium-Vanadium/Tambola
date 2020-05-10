import React, { useState } from "react";

interface DropdownProps {
  placeholder: string;
  options: string[];
  changeValue: (newValue: string) => void;
}

function Dropdown({ placeholder, options, changeValue: _changeValue }: DropdownProps) {
  const [title, setTitle] = useState(placeholder);
  const [showOptions, setShowOptions] = useState(false);

  const changeValue = (title: string) => {
    setTitle(title);
    _changeValue(title);
  };

  return (
    <div className={`dropdown${showOptions ? " -focus" : ""}`} onClick={() => setShowOptions(!showOptions)}>
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

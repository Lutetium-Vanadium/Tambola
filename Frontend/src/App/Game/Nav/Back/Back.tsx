import React from "react";

import backSvg from "./back.svg";

interface BackProps {
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function Back({ onClick }: BackProps) {
  return (
    <div style={{ textAlign: "center" }} onClick={onClick} className="back">
      <img src={backSvg} alt="back" />
    </div>
  );
}

export default Back;

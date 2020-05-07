import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

const showNumber = (num: number) => {
  ReactDOM.render(<ShowNumber num={num} />, document.getElementById("notification-root"));
};

const LEAVE_DELAY = 5000;
const center: React.CSSProperties = {
  width: "100%",
  textAlign: "center",
};

interface ShowNumberProps {
  num: number;
}

function ShowNumber({ num }: ShowNumberProps) {
  const [height, setHeight] = useState(0);
  const [wrapperStyle, setWrapperStyle] = useState({ transform: "translateY(-200px)" });

  const notify = useRef<HTMLDivElement>(null);
  const notificationClose = useRef<HTMLDivElement>(null);

  const closeNotification = () => {
    setWrapperStyle({
      transform: `translateY(${-height - 20}px)`,
    });
    setTimeout(() => {
      const notificationRoot = document.getElementById("notification-root");
      if (notificationRoot) {
        ReactDOM.unmountComponentAtNode(notificationRoot);
      }
    }, 300);
  };

  useEffect(() => {
    let notifyRect = notify.current?.getBoundingClientRect();
    setHeight(notifyRect?.height ?? 0);
    setWrapperStyle({ transform: "translateY(0)" });
    setTimeout(() => {
      notificationClose.current?.click();
    }, LEAVE_DELAY);
  }, []);

  return (
    <div className="notification" style={wrapperStyle} ref={notify}>
      <div style={{ width: (8 * window.innerWidth) / 10 }}>
        <p style={center}>New Number</p>
        <p style={{ ...center, fontSize: window.innerHeight / 10, fontWeight: "bold" }}>{num}</p>
      </div>
      <div className="close-x" onClick={closeNotification} ref={notificationClose}>
        <button>&#215;</button>
      </div>
    </div>
  );
}

export default showNumber;

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export default function notification(content: string | string[], important = false) {
  if (typeof content === "string") {
    content = [content];
  }
  ReactDOM.render(<Notify content={content} important={important} />, document.getElementById("notification-root"));
}

const LEAVE_DELAY = 5000;

interface NotifyProps {
  content: string[];
  important: boolean;
}

function Notify({ content, important }: NotifyProps) {
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
    if (!important) {
      setTimeout(() => {
        notificationClose.current?.click();
      }, LEAVE_DELAY);
    }
  }, []);

  return (
    <div className="notification" style={wrapperStyle} ref={notify}>
      <div style={{ width: (8 * window.innerWidth) / 10 }}>
        {content.map((text, i) => (
          <p key={`notification-p-${i}`}>{text}</p>
        ))}
      </div>
      <div className="close-x" onClick={closeNotification} ref={notificationClose}>
        <button>&#215;</button>
      </div>
    </div>
  );
}

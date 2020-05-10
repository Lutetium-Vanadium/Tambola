import React, { useState, useRef } from "react";

type TouchDetails = {
  x: number;
  index: number;
};

const THRESHOLD = window.innerWidth / 3;
const SCALE = 2;

interface DeletableListProps<T> {
  enable?: boolean;
  className?: string;
  itemClassName?: string;
  list: T[];
  children: (value: T, index: number) => any;
  remove: (index: number) => void;
  Start?: () => JSX.Element;
  End?: () => JSX.Element;
}

function DeletableList<T>({ enable = true, className, itemClassName, list, children, remove, Start, End }: DeletableListProps<T>) {
  const [touchStart, setTouchStart] = useState<TouchDetails>({
    x: 0,
    index: 0,
  });
  const [transform, setTransform] = useState(0);
  const touchMoveDX = useRef(0); // set as useRef to prevent rerender

  const handleTouchStart = (e: React.TouchEvent<HTMLLIElement>) => {
    if (!enable) return;
    setTouchStart({
      x: e.touches[0].clientX,
      index: +(e.currentTarget.dataset["index"] ?? 0),
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLLIElement>) => {
    if (!enable) return;
    touchMoveDX.current = e.touches[0].clientX - touchStart.x;
    if (touchMoveDX.current > THRESHOLD || touchMoveDX.current < -THRESHOLD) {
      setTransform(touchMoveDX.current);
    } else {
      setTransform(0);
    }
  };

  const handleTouchEnd = () => {
    if (!enable) return;
    if (touchMoveDX.current > THRESHOLD) {
      setTransform(0.25 * SCALE * window.innerWidth);
    } else if (touchMoveDX.current < -THRESHOLD) {
      setTransform(-0.25 * SCALE * window.innerWidth);
    } else {
      setTransform(0);
    }
  };

  return (
    <ul className={"list " + className}>
      {Start && <Start />}
      {list.map((value, index) => (
        <li
          className={itemClassName}
          key={index}
          data-index={index}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <p className="left" onClick={() => remove(index)}>
            Remove
          </p>
          <p className="right" onClick={() => remove(index)}>
            Remove
          </p>
          <div className="translate-wrapper" style={touchStart.index === index ? { transform: `translateX(${transform / SCALE}px)` } : {}}>
            {children(value, index)}
          </div>
        </li>
      ))}
      {End && <End />}
    </ul>
  );
}

export default DeletableList;

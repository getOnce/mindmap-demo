import React, { useState, useRef, useEffect } from "react";
export default function DragCanvas({ children }: React.PropsWithChildren) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  // wheel mouse x y
  const [mouseDownFlag, setMouseDownFlag] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [movingX, setMovingX] = useState(0);
  const [movingY, setMovingY] = useState(0);
  let [scale, setScale] = useState(1);

  const $target = useRef<HTMLDivElement | null>(null);

  function onMouseDown(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    // e.button === 0表示的是右键
    if (e.button === 0) {
      setX(e.clientX);
      setY(e.clientY);
      setMouseDownFlag(true);
    }
  }
  function onMosueUp() {
    setMouseDownFlag(false);
    setTranslateX(translateX + movingX);
    setTranslateY(translateY + movingY);
    setMovingX(0);
    setMovingY(0);
  }
  function onMouseMove(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    if (mouseDownFlag) {
      const movingX = e.clientX - x;
      const movingY = e.clientY - y;
      setMovingX(movingX);
      setMovingY(movingY);
    }
  }
  function onDoubleClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const newScale = Math.min(Math.max(0.125, scale + 0.2), 4);
    setScale(newScale);
  }

  useEffect(() => {
    function zoom(event: WheelEvent) {
      event.preventDefault();
      // 当ctrlKey为true的时候说明是在放大缩小
      if (event.ctrlKey) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scale += event.deltaY * -0.01;
        // Restrict scale
        scale = Math.min(Math.max(0.125, scale), 4);
        setScale(scale);
        // 当ctrlKey不为true的时候说明是在划动
      } else {
        setTranslateX((originalX) => {
          return originalX - event.deltaX * 0.2;
        });
        setTranslateY((originalY) => {
          return originalY - event.deltaY * 0.2;
        });
      }
    }
    const $current = $target.current;
    if ($current) {
      $current.addEventListener("wheel", zoom, { passive: false });
    }
    return () => {
      if ($current) {
        $current.removeEventListener("wheel", zoom);
      }
    };
  }, []);
  return (
    <section
      ref={$target}
      onDoubleClick={onDoubleClick}
      onMouseUp={onMosueUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      className={`m--main__inner ${
        mouseDownFlag ? "m--main__inner-down" : ""
      } `}
      style={{
        transform: `translate(${translateX + movingX}px, ${
          translateY + movingY
        }px) scale(${scale})`,
      }}
    >
      {children}
    </section>
  );
}

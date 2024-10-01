import "./resizable.css";

import { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children?: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: any;

    const listener = () => {
      timer && clearTimeout(timer);

      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);
        if (window.innerWidth * 0.75 < width)
          setWidth(window.innerWidth * 0.75);
      }, 100);
    };

    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  const resizableProps: ResizableBoxProps =
    direction === "horizontal"
      ? {
          width,
          height: Infinity,
          axis: "x",
          resizeHandles: ["e"],
          minConstraints: [innerWidth * 0.2, Infinity],
          maxConstraints: [innerWidth * 0.75, Infinity],
          style: {
            display: "flex",
          },
          onResizeStop: (e, { size }) => setWidth(size.width),
        }
      : {
          width: Infinity,
          height: 300,
          axis: "y",
          resizeHandles: ["s"],
          minConstraints: [Infinity, 30],
          maxConstraints: [Infinity, innerHeight * 0.9],
        };

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;

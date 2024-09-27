import "./resizable.css";
import { ResizableBox } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children?: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox
      width={Infinity}
      height={100}
      axis={direction === "horizontal" ? "x" : "y"}
      resizeHandles={["s"]}
    >
      {children}
    </ResizableBox>
  );
};

export default Resizable;

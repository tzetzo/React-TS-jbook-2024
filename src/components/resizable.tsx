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
      minConstraints={[Infinity, 30]}
      maxConstraints={[Infinity, window.innerHeight * 0.9]}
    >
      {children}
    </ResizableBox>
  );
};

export default Resizable;

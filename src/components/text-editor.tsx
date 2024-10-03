import MDEditor from "@uiw/react-md-editor";
import React, { useEffect, useRef, useState } from "react";

const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      console.log(e.target);
      if (ref.current && e.target && ref.current.contains(e.target as Node))
        return;
      setEditing(false);
    };

    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div ref={ref}>
        <MDEditor />
      </div>
    );
  }

  return (
    <div className="container" onClick={() => setEditing(true)}>
      <MDEditor.Markdown source={"# Header"} />
    </div>
  );
};

export default TextEditor;

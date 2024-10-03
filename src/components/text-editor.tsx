import "./text-editor.css";

import MDEditor from "@uiw/react-md-editor";
import React, { useEffect, useRef, useState } from "react";

const TextEditor: React.FC = () => {
  const [value, setValue] = useState("# Header");
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
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
      <div ref={ref} className="text-editor">
        <MDEditor
          value={value}
          onChange={(v) => {
            setValue(v || "");
          }}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown className="text-editor" source={value} />
      </div>
    </div>
  );
};

export default TextEditor;

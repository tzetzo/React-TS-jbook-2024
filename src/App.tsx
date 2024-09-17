import "bulmaswatch/superhero/bulmaswatch.min.css";

import { useState } from "react";

import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";
import bundle from "./bundler";

function App() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
}

export default App;

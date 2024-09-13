import "bulmaswatch/superhero/bulmaswatch.min.css";

import { useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";

import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";

function App() {
  const [input, setInput] = useState("");
  const esbuildServiceRef = useRef<esbuild.Service | null>(null);
  const iframe = useRef<any>();

  useEffect(() => {
    const startService = async () => {
      esbuildServiceRef.current = await esbuild.startService({
        worker: true,
        wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm", // the file in the public folder we copied from node_modules
      });
    };
    startService();
  }, []);

  const onClick = async () => {
    if (!esbuildServiceRef.current) return;

    iframe.current.srcdoc = html;

    // const result = await esbuildServiceRef.current.transform(input, { //transform means transpile(from JSX into JS)
    //   loader: 'jsx',
    //   target: 'es2015'
    // });
    const result = await esbuildServiceRef.current.build({
      entryPoints: ["index.js"], // we want index.js to be the first file bundled in our app
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"', //replaces process.env.NODE_ENV with the string "production"
        global: "window", //replaces the var global with the var window
      },
    });

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  const html = `
    <html>
    <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener("message", (event) => {
            try {
              eval(event.data);
            } catch (error) {
              const root = document.querySelector("#root");
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4> ' + error + '</div>';
              console.error(error);
            }
          }, false)
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
      {/* <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea> */}
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        title="code preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
}

export default App;

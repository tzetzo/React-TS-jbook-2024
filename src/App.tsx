import { useEffect, useRef, useState } from "react";
import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

function App() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const esbuildServiceRef = useRef<esbuild.Service | null>(null);

  useEffect(() => {
    const startService = async () => {
      esbuildServiceRef.current = await esbuild.startService({ 
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm' // the file in the public folder we copied from node_modules
    });

  }
    startService();
  }, []);

  

  const onClick = async () => {
    if(!esbuildServiceRef.current) return;


    // const result = await esbuildServiceRef.current.transform(input, { //transform means transpile(from JSX into JS)
    //   loader: 'jsx',
    //   target: 'es2015'
    // });
    const result = await esbuildServiceRef.current.build({
      entryPoints: ['index.js'], // we want index.js to be the first file bundled in our app
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"', //replaces process.env.NODE_ENV with the string "production"
        global: "window" //replaces the var global with the var window
      }
    });
    
    setCode(result.outputFiles[0].text)
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

export default App;

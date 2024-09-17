import * as esbuild from "esbuild-wasm";

import { unpkgPathPlugin } from "../plugins/unpkg-path-plugin";
import { fetchPlugin } from "../plugins/fetch-plugin";

let service: esbuild.Service;

export default async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm", // the file in the public folder we copied from node_modules
    });
  }

  const result = await service.build({
    entryPoints: ["index.js"], // we want index.js to be the first file bundled in our app
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: {
      "process.env.NODE_ENV": '"production"', //replaces process.env.NODE_ENV with the string "production"
      global: "window", //replaces the var global with the var window
    },
  });

  return result.outputFiles[0].text;
};

import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const unpkgPathPlugin = (inputCode: string) => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // figure out where the entryPoint (index.js as specified in App.tsx) is stored as well as any import
      build.onResolve({ filter: /.*/ }, async (args) => {
        if (args.path === "index.js")
          return { path: args.path, namespace: "a" };

        if (args.path.includes("./") || args.path.includes("../")) {
          return {
            path: new URL(
              args.path,
              "https://unpkg.com" + args.resolveDir + "/"
            ).href,
            namespace: "a",
          };
        }

        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: "a",
        };
      });

      // load the index.js and any import modules
      build.onLoad({ filter: /.*/ }, async (args) => {
        // this tells esbuild not to look for the index.js file but to use the following code
        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: inputCode,
          };
        }

        // Check to see if we have already fetched this file and if it is in the cahce
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // If it is in the cahce return it immediately
        if (cachedResult) return cachedResult;

        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // Store response in the cahce
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};

import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
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

        const fileType = args.path.match(/\.css$/) ? "css" : "jsx";

        // remove all new line chars, escape all single and double quotes
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents =
          fileType === "css"
            ? `
                const style = document.createElement('style');
                style.innerText = '${escaped}';
                document.head.appendChild(style);
            `
            : data;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // Store response in the cahce
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};

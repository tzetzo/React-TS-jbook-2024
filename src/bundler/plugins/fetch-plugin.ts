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
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        // this tells esbuild not to look for the index.js file but to use the following code
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      // When we dont return anything from the `onLoad` function esbuild continues to execute the next `onLoad`!!!
      // We use this to our advantage to extract common logic
      build.onLoad({ filter: /.*/ }, async (args) => {
        // Check to see if we have already fetched this file and if it is in the cahce
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // If it is in the cahce return it immediately
        if (cachedResult) return cachedResult;
      });

      build.onLoad({ filter: /\.css$/ }, async (args) => {
        const { data, request } = await axios.get(args.path);

        // remove all new line chars, escape all single and double quotes
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `
                const style = document.createElement('style');
                style.innerText = '${escaped}';
                document.head.appendChild(style);
            `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // Store response in the cahce
        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args) => {
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

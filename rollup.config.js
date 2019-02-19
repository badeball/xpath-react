import resolve from "rollup-plugin-node-resolve";

import pkg from "./package.json";

export default {
  external: ["react"],
  input: "lib/index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named"
    },
    {
      file: pkg.module,
      format: "es"
    }
  ],
  plugins: [
    resolve({
      module: true
    })
  ]
};

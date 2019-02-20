import resolve from "rollup-plugin-node-resolve";

import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default {
  external: ["react"],
  input: "lib/index.ts",
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
    }),
    typescript()
  ]
};

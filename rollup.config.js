import pkg from "./package.json";

export default {
  external: ["react", "xpath-evaluator"],
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
  ]
};

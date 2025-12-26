export default {
  schema: "./sanity/schemaTypes/index.ts",
  generates: {
    "./sanity/types.ts": {
      plugins: ["typescript"]
    }
  }
};

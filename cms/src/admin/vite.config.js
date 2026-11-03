const { mergeConfig } = require('vite');

// Keeps the admin build inside the memory of a 2 GB server.
module.exports = (config) => {
  return mergeConfig(config, {
    build: {
      reportCompressedSize: false,
      rollupOptions: {
        maxParallelFileOps: 2,
      },
    },
  });
};

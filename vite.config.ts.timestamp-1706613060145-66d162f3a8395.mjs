// vite.config.ts
import legacy from "file:///c:/ays/front-end/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import react from "file:///c:/ays/front-end/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///c:/ays/front-end/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    legacy({
      // targets: ["ie >= 11"], // expected compatible browser target range
      renderLegacyChunks: true,
      // need to generate legacy browser compatible chunks (default true)
      modernPolyfills: false
      // no need to generate polyfills block for modern browsers (default false)
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxheXNcXFxcZnJvbnQtZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJjOlxcXFxheXNcXFxcZnJvbnQtZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9jOi9heXMvZnJvbnQtZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IGxlZ2FjeSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tbGVnYWN5XCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIGxlZ2FjeSh7XHJcbiAgICAgIC8vIHRhcmdldHM6IFtcImllID49IDExXCJdLCAvLyBleHBlY3RlZCBjb21wYXRpYmxlIGJyb3dzZXIgdGFyZ2V0IHJhbmdlXHJcbiAgICAgIHJlbmRlckxlZ2FjeUNodW5rczogdHJ1ZSwgLy8gbmVlZCB0byBnZW5lcmF0ZSBsZWdhY3kgYnJvd3NlciBjb21wYXRpYmxlIGNodW5rcyAoZGVmYXVsdCB0cnVlKVxyXG4gICAgICBtb2Rlcm5Qb2x5ZmlsbHM6IGZhbHNlLCAvLyBubyBuZWVkIHRvIGdlbmVyYXRlIHBvbHlmaWxscyBibG9jayBmb3IgbW9kZXJuIGJyb3dzZXJzIChkZWZhdWx0IGZhbHNlKVxyXG4gICAgfSksXHJcbiAgXSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd08sT0FBTyxZQUFZO0FBQzNQLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUc3QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxNQUVMLG9CQUFvQjtBQUFBO0FBQUEsTUFDcEIsaUJBQWlCO0FBQUE7QUFBQSxJQUNuQixDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

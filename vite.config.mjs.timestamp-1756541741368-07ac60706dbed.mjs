// vite.config.mjs
import { defineConfig, loadEnv } from "file:///D:/Junglore-Admin-250825/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Junglore-Admin-250825/node_modules/@vitejs/plugin-react/dist/index.mjs";
import jsconfigPaths from "file:///D:/Junglore-Admin-250825/node_modules/vite-jsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = `${"5000"}`;
  return {
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 5000
      port: PORT,
      host: true
    },
    define: {
      global: "window"
    },
    resolve: {
      alias: [
        // { find: '', replacement: path.resolve(__dirname, 'src') },
        // {
        //   find: /^~(.+)/,
        //   replacement: path.join(process.cwd(), 'node_modules/$1')
        // },
        // {
        //   find: /^src(.+)/,
        //   replacement: path.join(process.cwd(), 'src/$1')
        // }
        // {
        //   find: 'assets',
        //   replacement: path.join(process.cwd(), 'src/assets')
        // },
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false
        },
        less: {
          charset: false
        }
      },
      charset: false,
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    base: "/admin",
    plugins: [react(), jsconfigPaths()]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcSnVuZ2xvcmUtQWRtaW4tMjUwODI1XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxKdW5nbG9yZS1BZG1pbi0yNTA4MjVcXFxcdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9KdW5nbG9yZS1BZG1pbi0yNTA4MjUvdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IGpzY29uZmlnUGF0aHMgZnJvbSAndml0ZS1qc2NvbmZpZy1wYXRocyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIGNvbnN0IEFQSV9VUkwgPSBgJHtlbnYuVklURV9BUFBfQkFTRV9OQU1FfWA7XG4gIGNvbnN0IFBPUlQgPSBgJHsnNTAwMCd9YDtcblxuICByZXR1cm4ge1xuICAgIHNlcnZlcjoge1xuICAgICAgLy8gdGhpcyBlbnN1cmVzIHRoYXQgdGhlIGJyb3dzZXIgb3BlbnMgdXBvbiBzZXJ2ZXIgc3RhcnRcbiAgICAgIG9wZW46IHRydWUsXG4gICAgICAvLyB0aGlzIHNldHMgYSBkZWZhdWx0IHBvcnQgdG8gNTAwMFxuICAgICAgcG9ydDogUE9SVCxcbiAgICAgIGhvc3Q6dHJ1ZVxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICBnbG9iYWw6ICd3aW5kb3cnXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczogW1xuICAgICAgICAvLyB7IGZpbmQ6ICcnLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpIH0sXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICBmaW5kOiAvXn4oLispLyxcbiAgICAgICAgLy8gICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvJDEnKVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgZmluZDogL15zcmMoLispLyxcbiAgICAgICAgLy8gICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvJDEnKVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICBmaW5kOiAnYXNzZXRzJyxcbiAgICAgICAgLy8gICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzJylcbiAgICAgICAgLy8gfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgY2hhcnNldDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgbGVzczoge1xuICAgICAgICAgIGNoYXJzZXQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjaGFyc2V0OiBmYWxzZSxcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBvc3Rjc3NQbHVnaW46ICdpbnRlcm5hbDpjaGFyc2V0LXJlbW92YWwnLFxuICAgICAgICAgICAgQXRSdWxlOiB7XG4gICAgICAgICAgICAgIGNoYXJzZXQ6IChhdFJ1bGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYXRSdWxlLm5hbWUgPT09ICdjaGFyc2V0Jykge1xuICAgICAgICAgICAgICAgICAgYXRSdWxlLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0sXG4gICAgYmFzZTogXCIvYWRtaW5cIixcbiAgICBwbHVnaW5zOiBbcmVhY3QoKSwganNjb25maWdQYXRocygpXVxuICB9O1xufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUSxTQUFTLGNBQWMsZUFBZTtBQUN0UyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFFBQU0sVUFBVSxHQUFHLElBQUksa0JBQWtCO0FBQ3pDLFFBQU0sT0FBTyxHQUFHLE1BQU07QUFFdEIsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBO0FBQUEsTUFFTixNQUFNO0FBQUE7QUFBQSxNQUVOLE1BQU07QUFBQSxNQUNOLE1BQUs7QUFBQSxJQUNQO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsSUFDVjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFjUDtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLFNBQVM7QUFBQSxRQUNYO0FBQUEsUUFDQSxNQUFNO0FBQUEsVUFDSixTQUFTO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxRQUNQLFNBQVM7QUFBQSxVQUNQO0FBQUEsWUFDRSxlQUFlO0FBQUEsWUFDZixRQUFRO0FBQUEsY0FDTixTQUFTLENBQUMsV0FBVztBQUNuQixvQkFBSSxPQUFPLFNBQVMsV0FBVztBQUM3Qix5QkFBTyxPQUFPO0FBQUEsZ0JBQ2hCO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUFBLEVBQ3BDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

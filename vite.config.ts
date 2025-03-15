import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [
      react(),
      tsconfigPaths(),
      {
        name: "override-config", // Plugin tùy chỉnh để đặt target esnext
        config: () => ({
          build: {
            target: "esnext", // Đặt target là esnext để hỗ trợ các tính năng hiện đại
          },
        }),
      },
    ],
  });
};

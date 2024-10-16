import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

const viteConfig = async () => {
  return defineConfig({
    base: "./",
    plugins: [
      vue({ isProduction: true }),
      vueDevTools({ launchEditor: "vim" }),
    ],
  });
};

export default viteConfig;

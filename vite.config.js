import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

const viteConfig = async () => {
  return {
    base: "./",
    plugins: [
      vue({ isProduction: true }),
      vueDevTools({ launchEditor: "vim" }),
    ],
  };
};

export default viteConfig;

import vue from "@vitejs/plugin-vue";

const viteConfig = async () => {
  return {
    base: "./",
    plugins: [vue()],
  };
};

export default viteConfig;

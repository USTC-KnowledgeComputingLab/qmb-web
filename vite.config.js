import vue from "@vitejs/plugin-vue";

const viteConfig = async () => {
  return {
    plugins: [vue()],
  };
};

export default viteConfig;

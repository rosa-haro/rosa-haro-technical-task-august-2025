import type { StorybookConfig } from "@storybook/react-vite";
import svgr from "vite-plugin-svgr";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: async (config) => {
    config.plugins = [
      ...(config.plugins || []),
      svgr({
        svgrOptions: {
          svgo: true,
          svgoConfig: {
            plugins: [
              { name: "removeDimensions" },
              { name: "removeAttrs", params: { attrs: "(fill|stroke)" } },
            ],
          },
        },
      }),
    ];
    return config;
  },
};
export default config;

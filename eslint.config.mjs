import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig.slice(0, 2),
  {
    ...nextConfig[1],
    rules: {
      ...(nextConfig[1]?.rules || {}),
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  ...nextConfig.slice(2),
  {
    ignores: ["node_modules/**", ".next/**", "build/**"],
  },
];

export default eslintConfig;

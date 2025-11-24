// jest.config.cjs
module.exports = {
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },

  transformIgnorePatterns: [
    "node_modules/(?!lucide-react)"
  ],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
};

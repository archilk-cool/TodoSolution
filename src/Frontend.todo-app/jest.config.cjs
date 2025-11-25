// jest.config.cjs
module.exports = {
  testEnvironment: "jsdom",

  // Allow imports like "@/components/TaskItem"
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  // Make sure lucide-react (ESM) is transformed
  transformIgnorePatterns: ["node_modules/(?!lucide-react)"],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

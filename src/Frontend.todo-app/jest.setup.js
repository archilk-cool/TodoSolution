// jest.setup.js

// 1) Add jest-dom matchers
require("@testing-library/jest-dom");

// 2) Mock lucide-react (all icons become simple SVGs)
jest.mock("lucide-react", () => {
  const React = require("react");
  const Icon = React.forwardRef((props, ref) =>
    React.createElement("svg", { ref, "data-mock-icon": true, ...props })
  );

  // Any imported icon name becomes <Icon />
  return new Proxy(
    {},
    {
      get: () => Icon,
    }
  );
});

// 3) Mock framer-motion so motion.div / AnimatePresence don’t cause trouble
jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    AnimatePresence: ({ children }) => <>{children}</>,
    motion: {
      div: React.forwardRef((props, ref) => <div ref={ref} {...props} />),
    },
  };
});

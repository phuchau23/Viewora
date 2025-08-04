/// <reference types="jest" />
import "@testing-library/jest-dom";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} alt={props.alt || "mocked image"} />;
  },
}));

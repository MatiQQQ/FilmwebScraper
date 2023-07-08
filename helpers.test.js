const { describe, it, expect } = require("@jest/globals");
const { validateServiceName, prettifyServiceName } = require("./utils/helpers");

describe("Testing prettifying services' names -> prettifyServiceName()", () => {
  it("should return prettified version of service name", () => {
    const prettyServiceName = prettifyServiceName(serviceName);
    expect(prettyServiceName).toBe("HBO MAX");
  });

  it("should throw an error if serviceName parameter is empty or null", () => {
    const functionWrapper = () => {
      prettifyServiceName();
    };
    expect(functionWrapper).toThrow("serviceName empty, null or undefined");
  });
});

describe("Testing text validation function -> validateServiceName()", () => {
  it("should return true if parameter is proper text value (defined, not null, not empty, not a number)", () => {
    const isValidTextParameter = validateServiceName("netflix");
    expect(isValidTextParameter).toBe(true);
  });

  it("should return false if parameter is not proper string (undefined, null, empty, number)", () => {
    const isValidTextParameter =
      validateServiceName("") &&
      validateServiceName() &&
      validateServiceName(null) &&
      validateServiceName(987);
    expect(isValidTextParameter).toBe(false);
  });
});

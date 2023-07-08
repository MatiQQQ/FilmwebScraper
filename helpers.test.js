const { describe, it, expect } = require("@jest/globals");
const { existsSync: fsExistsSync } = require("fs");
const { dirname: pathDirname } = require("path");
const {
  validateServiceName,
  prettifyServiceName,
  checkIfFolderExistsAndCreate,
} = require("./utils/helpers");
const serviceName = "hbo_max";

describe("Testing prettifying services' names -> prettifyServiceName()", () => {
  it("should return prettified version of service name", () => {
    const prettyServiceName = prettifyServiceName(serviceName);
    expect(prettyServiceName).toBe("Hbo Max");
  });

  it("should throw an error if serviceName parameter is empty or null", () => {
    const functionWrapper = () => {
      prettifyServiceName();
    };
    expect(functionWrapper).toThrow("Invalid service name");
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

describe("Testing checkIfFolderExistsAndCreate()", () => {
  const path = "./test_output/movies.csv";
  it("should throw an error if path is undefined, empty, null or number", () => {
    const functionWrapper = async () => {
      await checkIfFolderExistsAndCreate();
    };

    expect(functionWrapper).rejects.toThrow("Invalid path");
  });

  it("should create a folder structure from path is proper path is provided", async () => {
    await checkIfFolderExistsAndCreate(path);
    const folderExists = fsExistsSync(pathDirname(path));
    expect(folderExists).toBe(true);
  });
});

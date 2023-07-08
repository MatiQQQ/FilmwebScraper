const { existsSync: fsExistsSync } = require("fs");
const { mkdir: fsMkdir } = require("fs/promises");
const { dirname: pathDirname } = require("path");
const pino = require("pino");
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

exports.validateServiceName = (serviceName) => {
  let isValid = true;
  if (!serviceName) isValid = false;
  if (typeof serviceName !== "string") isValid = false;
  if (String(serviceName).length === 0) isValid = false;
  return isValid;
};

exports.prettifyServiceName = (serviceName) => {
  const isValidServiceName = this.validateServiceName(serviceName);
  if (!isValidServiceName) throw Error("Invalid service name");
  if (serviceName === "canal_plus_manual") return "Canal+";
  const clearedString = serviceName.includes("_")
    ? serviceName.replaceAll("_", " ")
    : serviceName;
  const finalString = clearedString
    .split(" ")
    .map((el) => el.at(0).toUpperCase() + el.slice(1))
    .join(" ");
  return finalString;
};

exports.checkIfFolderExistsAndCreate = async (path) => {
  if (!this.validateServiceName(path)) throw Error("Invalid path");
  const folderPath = pathDirname(path);
  if (!fsExistsSync(folderPath)) {
    try {
      await fsMkdir(folderPath, { recursive: true });
      logger.info(`Folder ${folderPath} created`);
      return;
    } catch (error) {
      throw Error("Error with folder creation");
    }
  }
};

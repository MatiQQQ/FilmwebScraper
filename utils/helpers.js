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
